# -*- coding: utf-8 -*-
"""自作の背景検出クラスやOpenCV内蔵の背景検出モデルを生成・管理するクラスを擁するモジュール"""
__author__ = "kojima@sofrio.com"
__date__ = "May 12 10:01:44 2018"

import cv2 as cv
import util as ut

IMAGE_RESIZE = 0
SMOOTH_BY_MORPH = True
STD_SMOOTH = 8

class Background(object):
    """ 背景と前景を検出します。 """
    def __init__(self, model):
        self.model = model()
        self.mask = None

    def scene(self, image):
        """背景検出モデルを強制初期化する。"""
        #self.apply(image, 1)
        self.apply(image, 0) #???

    def apply(self, image, rate=-1, smooth=STD_SMOOTH):
        """動画フレームを検出モデルに適用する。"""
        if not self.model: return

        if IMAGE_RESIZE > 0:
            h, w = image.shape[:2]
            size = (IMAGE_RESIZE, IMAGE_RESIZE * h / w)
            image = cv.resize(image, size)

        self.mask = self.model.apply(image, learningRate=rate)
        if smooth > 0:
            self.mask = self.smooth_mask(self.mask, smooth)

    @staticmethod
    def smooth_mask(mask, ksize):
        """背景マスクをぼかす。"""
        if ksize <= 0: return mask

        if SMOOTH_BY_MORPH:
            ksizes = (ksize, ksize)
            kernel = cv.getStructuringElement(cv.MORPH_CROSS, ksizes)
            mask = cv.morphologyEx(mask, cv.MORPH_OPEN, kernel)
            mask = cv.morphologyEx(mask, cv.MORPH_CLOSE, kernel)
            #find_connected_components()
            mask = cv.blur(mask, ksizes)
        else:
            ksize = 2 * (ksize // 2) + 1
            ksizes = (ksize, ksize)
            mask = cv.GaussianBlur(mask, ksizes, 0)#3.5, 3.5)
        return cv.threshold(mask, 2 * ksize, 255, cv.THRESH_BINARY)[1]


if __name__ == '__main__':
    ut.no_main()
    