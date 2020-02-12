# -*- coding: utf-8 -*-
"""Kalmanフィルタを実装したモジュール"""
__author__ = "kojima@sofrio.com"
__date__ = "Jun 14 11:50:14 2018"

import numpy as np
import cv2 as cv

INIT_TOLERANCE = 1.0

class Kalman(object):
    """Kalmanフィルタ"""
    def __init__(self):
        self.kalman = cv.KalmanFilter(4, 2)
        self.kalman.measurementMatrix = np.array(
            [[1, 0, 0, 0],
             [0, 1, 0, 0]], np.float32)
        self.kalman.transitionMatrix = np.array(
            [[1, 0, 1, 0],
             [0, 1, 0, 1],
             [0, 0, 1, 0],
             [0, 0, 0, 1]], np.float32)
        self.kalman.processNoiseCov = np.array(
            [[1, 0, 0, 0],
             [0, 1, 0, 0],
             [0, 0, 1, 0],
             [0, 0, 0, 1]], np.float32) * 0.03
        self.pos = None

    def init(self, point):
        self.pos = point
        self.correct(point)
        self.predict()

    def correct(self, point):
        x, y = [p - s for p, s in zip(point, self.pos)]
        pts = np.array([np.float32(x), np.float32(y)], np.float32)
        return self.kalman.correct(pts)

    def predict(self):
        kpr = self.kalman.predict()
        return tuple([k + s for k, s in zip(kpr.flatten(), self.pos)])


if __name__ == '__main__':
    from main import track
    from particle_color import ParticleColor
    track(ParticleColor)
