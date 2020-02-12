# -*- coding: utf-8 -*-
"""追跡モジュールのラッパクラスと指定矩形（１つだけ）を追跡するクラスを収めたモジュール"""
__author__ = "kojima@sofrio.com"
__date__ = "May 24 13:42:50 2018"

import numpy as np
import cv2 as cv
import util as ut

TRACKER = "Tracking"
TRACK_BY_HUE = False
MAX_PATH = 16

class DummyTracker(object):
    def init(self, *_):
        return True

    def update(self, *_):
        return True, None

class Tracker(object):
    """追跡モジュールのラッパクラス。"""
    def __init__(self, tracker=None, name="", color=None):
        self.tracker = DummyTracker() if tracker is None else tracker()
        self.name = name
        self.color = color
        self.info = None
        self.rect = None
        self.path = []
        self.life = 1
        self.invalids = 0 #すぐに殺さない

    def init(self, image, rect):
        """追跡モジュールの初期化。"""
        if not self.tracker.init(image, rect): return False
        self.rect = rect
        self.info = getattr(self.tracker, "info", rect)
        self.path = []
        self.path.append(ut.rect_center(rect))
        return True

    def update(self, image, point=None):
        """追跡処理。マウスクリックによるモジュール削除指示の判定や追跡軌跡の保存を行う。"""
        tmp = cv.cvtColor(image, cv.COLOR_BGR2HSV_FULL) if TRACK_BY_HUE else image
        try:
            ok, rect = self.tracker.update(tmp)
            if not ok: return "追跡不能"
            if rect is None:
                rect = self.rect
            if ut.rect_contains(rect, point): return "削除指示"
        except cv.error as ex:
            print(ex)
            return "OpenCV エラー"
        self.append_path(rect)
        self.rect = rect
        return None

    def append_path(self, rect):
        """追跡軌跡の保存。"""
        self.path.append(ut.rect_center(rect))
        if len(self.path) > MAX_PATH:
            del self.path[0]

    def draw(self, image):
        """追跡モジュールの現在の追跡位置（矩形）や今迄の軌跡を描画する。"""
        drawer = getattr(self.tracker, "draw", None)
        if drawer:
            drawer(image)
        cv.polylines(image, [np.int0(self.path)], False, self.color)
        cv.circle(image, self.path[-1], 2, self.color, -1)
        ut.draw_rect(image, self.rect, self.color)


if __name__ == '__main__':
    ut.no_main()
