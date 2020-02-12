# -*- coding: utf-8 -*-
"""指定矩形から対象色を取り出しパーティクルにより対象色を追跡するモジュール"""
__author__ = "kojima@sofrio.com"
__date__ = "Jun  3 10:14:28 2018"

import math
from particle import Particle

class ParticleColor(Particle):
    """指定矩形中心部の「色」を追跡対象として追跡を行うパーティクルフィルタ。"""
    def __init__(self):
        super().__init__()
        self.target_color = None

    def setup_target(self, image, rect):
        """追跡対象を色として設定する。"""
        self.target_color = self.get_target_color(image, rect)
        return "色{} {}px".format(tuple(map(int, self.target_color)), self.target_size)

    def get_target_color(self, image, rect):
        """指定矩形の追跡色を計算する。継承クラスからも利用される。"""
        x, y, w, h = self.get_target_rect(image, rect)
        colors = image[y:y + h, x:x + w].reshape(-1, image.shape[2])
        color_sum = [sum(colors[:, i]) for i in range(image.shape[2])]
        color = [s / colors.shape[0] for s in color_sum]
        return color

    def calc_weight_diff(self, image, pos):
        """尤度算出のための差異値を計算する。"""
        return self.calc_color_diff(image, pos, self.target_color)

    def calc_color_diff(self, image, pos, color):
        """画像の指定位置の色として移植の差異値を計算する。継承クラスからも利用される。"""
        x, y = pos
        diff = [p - t for (p, t) in zip(image[y][x], color)]
        return math.sqrt(sum([d * d for d in diff]))

    def get_plot_color(self):
        """パーティクルをプロットする色を取得"""
        return self.target_color


if __name__ == '__main__':
    from main import track
    track(ParticleColor)
