# -*- coding: utf-8 -*-
"""
Created on Wed Oct  3 07:41:47 2018

@author: kojima
"""

import cv2 as cv
import util as ut
from background import Background
from tracker import Tracker
from tracker import TRACK_BY_HUE
from particle_color import ParticleColor

OPENCV4 = True

BACK_MODEL = cv.createBackgroundSubtractorKNN
#BACK_MODEL = cv.createBackgroundSubtractorMOG2

TRACKER = ParticleColor
#TRACKER = cv.TrackerBoosting_create
#TRACKER = cv.TrackerCSRT_create
#TRACKER = #cv.TrackerGOTURN_create
#TRACKER = cv.TrackerKCF_create
#TRACKER = cv.TrackerMedianFlow_create
#TRACKER = cv.TrackerMIL_create
#TRACKER = cv.TrackerMOSSE_create
#TRACKER = cv.TrackerTLD_create

CONTOURS_IDX = 0 if OPENCV4 else 1
MAX_TRACKERS = 8
MAX_MIN = 64
MAX_INVALIDS = 8
SCENE_RATIO = 0.6
REMOVE_DUP = True
BLACK_RATE = 0.2

class Detect(object):
    def __init__(self):
        self.back = None
        self.trackers = []
        self.max_trackers = MAX_TRACKERS
        self.creates = 0
        self.removes = 0
        self.min_size = int(MAX_MIN / 4)
        self.path = ""

    def setup(self):
        self.back = Background(BACK_MODEL)

    def release(self):
        self.trackers = None
        self.back = None
    
    def process(self, path, image):
        self.path = path
        self.update_trackers(image)
        self.back.apply(image)
        self.process_detect(image)
        self.draw_trackers(image)
        self.limit_trackers()
        return image

    def update_trackers(self, image, point=None):
        """全ての追跡モジュール群の追跡処理を呼び出す。"""
        removes = []
        for tracker in self.trackers:
            err = self.update_tracker(tracker, image, point)
            if err is None:
                tracker.life += 1
            else:
                removes.append((tracker, err))
        for tracker, err in removes:
            self.remove_tracker(tracker, err)

    def update_tracker(self, tracker, image, point):
        """追跡モジュールの更新と消滅判定を行う。Trackクラスのメソッドのオーバーライド。"""
        if not tracker: return ""
        err = tracker.update(image, point)
        if err: return err
        err = self.out_of_use(tracker)
        if err:
            tracker.rect = None
        return err

    def out_of_use(self, tracker):
        """追跡結果の矩形の重複、無効を判定する。無効は数フレーム後に遅延処理。"""
        rect = tracker.rect
        if REMOVE_DUP: #コストの割に効果が小さいか？
            for tr in self.trackers:
                if tr == tracker or not tr.rect: continue
                if ut.rect_covers(tr.rect, rect): return "重複"
                if ut.rect_covers(rect, tr.rect): return "重複"
        if self.valid(rect):
            tracker.invalids = 0
        else:
            tracker.invalids += 1
            if tracker.invalids >= MAX_INVALIDS: return "無効"
        return None

    def valid(self, rect):
        """追跡結果が背景の中に埋もれているか否かを判断し、埋もれている場合は無効と判定する。"""
        mask = self.back.mask
        if BLACK_RATE == 0 or mask is None: return True
        if len(rect) == 3: rect = ut.bounding_rect(rect)
        x, y, X, Y = map(int, ut.rect_box(rect))
        try:
            mask_data = mask[y:Y, x:X].flatten()
            nzs = cv.countNonZero(mask_data)
            return nzs > mask_data.shape[0] * BLACK_RATE
        except TypeError as ex:
            print(ex)
            return True

    def process_detect(self, image):
        """新たな追跡モジュールの生成判定を行い、必要なら生成する。"""
        rects = self.detect(image)
        rects = (rect for rect in rects if ut.rect_gtr(rect, self.min_size))
        tmp, rects = ut.clone_iterater(rects)
        if self.check_scene(image, tmp): return
        for rect in rects:
            if not self.to_be_used(rect): continue
            #if len(rect) == 3: #may be rotatedRect
            #    rect = ut.bounding_rect(rect)
            self.append_tracker(image, rect)

    def detect(self, _):
        """背景検出モデルが前景と判定した部分を矩形群として返却する。"""
        contours = cv.findContours(self.back.mask, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)[CONTOURS_IDX]
        return (cv.boundingRect(cont) for cont in contours)

    def check_scene(self, image, rects):
        """場面転換の判定を行い、必要なら追跡モジュール群を全消滅させる。"""
        detect_area = sum([rect[2] * rect[3] for rect in rects])
        image_area = image.shape[0] * image.shape[1]
        if detect_area < image_area * SCENE_RATIO: return False
        #self.log("場面転換")
        self.back.scene(image)
        self.trackers = []
        return True

    def to_be_used(self, rect):
        """探索された矩形が新規で有効なものか否かを判定する。"""
        return not self.overlap(rect) # and self.valid(rect)

    def overlap(self, rect):
        """探索矩形が既に追跡中かどうかを判定し、追跡中の場合は追跡側の矩形を探索矩形で置き換える。"""
        o = ut.rect_center(rect)
        for tracker in self.trackers:
            if ut.rect_contains(tracker.rect, o) or ut.rect_contains(rect, ut.rect_center(tracker.rect)):
                tracker.rect = rect
                tracker.append_path(rect)
                return True
        return False

    def append_tracker(self, image, rect):
        """新たな矩形が指定されたときに、新たな追跡モジュールを生成する。"""
        if not rect: return 0
        color = ut.get_color(self.creates)
        name = ut.color_name(color)
        tracker = self.create_tracker(image, rect, name, color)
        if not tracker: return 0
        #self.log("+ {}: {}".format(tracker.name, tracker.info))
        self.trackers.append(tracker)
        self.creates += 1
        return 1

    def create_tracker(self, image, rect, name="", color=ut.GREEN):
        """現在の追跡モジュールを破棄して新たな追跡モジュールを生成する。"""
        try:
            tracker = Tracker(TRACKER, name, color)
            tmp = cv.cvtColor(image, cv.COLOR_BGR2HSV_FULL) if TRACK_BY_HUE else image
            return tracker if tracker.init(tmp, rect) else None
        except cv.error:
            #print(ex)
            return None

    def draw_trackers(self, image, unit="Trackers"):
        """全ての追跡モジュール群の追跡状況を描画する。"""
        ut.draw_text(image, ut.TEXT_TOP_LEFT, "{} {}.".format(len(self.trackers), unit), ut.GREEN)
        for tracker in self.trackers:
            tracker.draw(image)

    def limit_trackers(self):
        """追跡モジュールの総数を管理する。増えすぎたときは古いものから破棄する。"""
        while len(self.trackers) > self.max_trackers:
            self.remove_tracker(self.trackers[0], "個数制限")

    def remove_tracker(self, tracker, reason):
        """不要になった追跡モジュール群を破棄する。"""
        if not tracker: return
        #self.total_lives += tracker.life
        #self.log("- {}: 追跡コマ数 = {}, 消滅理由 = {}".format(tracker.name, tracker.life, reason))
        self.trackers.remove(tracker)
        self.removes += 1

    #def log(self, msg):
        #print("[{}] {}".format(self.path, msg))


if __name__ == '__main__':
    import main
    main.main()
