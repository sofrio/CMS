# -*- coding: utf-8 -*-
"""パーティクルにより対象を追跡するための抽象クラスとパーティクル用パラメータの設定パネルを収めたモジュール"""
__author__ = "kojima@sofrio.com"
__date__ = "Jun  3 10:14:28 2018"

import threading
import math
import numpy as np
import cv2 as cv
import util as ut
import settings
from kalman import Kalman

PARTICLE = "Particle"   # 設定ファイルに設定値を保存するときのセクション名
MAX_PARTICLE = 512      # ばら撒くパーティクルの個数の最大値〈個）
MIN_VAR = 4             # パーティクルをばら撒く時の分散の最小値（ピクセル）
MAX_VAR = 48            # パーティクルをばら撒く時の分散の最大値（ピクセル）
MIN_TARGET_SIZE = 1     # 追跡対象の特徴を取得する中心部矩形の最小値、１辺の長さの半分（ピクセル）
SIGMA = 20              # 尤度計算に用いる平正規分布の均分散（色距離**2）
NDIST_COEF = 1.0 / (math.sqrt(2.0 * np.pi) * SIGMA) # 尤度計算に用いる正規分布の固定係数
NDIST_DENOM = 2.0 * SIGMA * SIGMA # 尤度計算に用いる正規分布の固定分母
SIMPLE_RESAMPLE = True  # 前回の各尤度を無視して、すべてを前回位置にする
WIDE_IF_LIGHT = True    # 前回の総尤度が低い場合、ばら撒き分散の初期増分を復活させる
KALMAN_IF_LIGHT = False # 総尤度(=捕捉率)が低い場合、kalman予測位置を採用する
RATIO_RECT = 8          # 追跡矩形を総尤度(=捕捉率)によって伸縮させる場合の係数
MIN_RECT = 16           # 追跡矩形を総尤度(=捕捉率)によって伸縮させる場合の最小辺長（ピクセル）
UPDATE_TARGET = 3 / 4   # 総尤度(=捕捉率)が高い場合、追跡対象の特徴を現在位置で再取得する

LOCK = threading.Lock()


class Particle(object):
    """パーティクルで追跡するための抽象クラス。"""
    controller = None   # 制御パネル
    settings.load()
    # 実際にばら撒くパーティクルの数
    n_particle = int(settings.get_option(PARTICLE, "n_particle", 128))
    # 追跡対象の特徴を取得する中心部矩形の最小値、１辺の長さの半分（ピクセル）
    min_target_size = int(settings.get_option(PARTICLE, "min_target_size", 2))
    # パーティクルをばら撒く位置に対するkalman予測の反映比率
    kalman_ratio = float(settings.get_option(PARTICLE, "kalman_ratio", 1.0))
    # パーティクルをばら撒く時の分散の拡縮比率
    var_ratio = float(settings.get_option(PARTICLE, "var_ratio", 1.0))
    # ばら撒き分散の初期増分（追跡初期はkalman予測が無効なので、早い動作に追従できないため）
    init_var_inc = float(settings.get_option(PARTICLE, "init_var_inc", 0.5))
    # ばら撒き分散の初期増分の減衰率（kalman予測が有効になってくるのに応じて、初期増分を打ち消すため）
    var_dec_rate = float(settings.get_option(PARTICLE, "var_dec_rate", 0.5))
    # ばら撒いたパーティクルを表示するか否かのフラグ
    show_ps = True

    def __init__(self):
        #if Particle.controller is None:
            #Particle.controller = ParticleController()
        self.info = None            # 初期化情報
        self.particles = None       # パーティクル格納用の配列
        self.rect = None            # 追跡結果の矩形
        self.target_size = 0        # 追跡対象の特徴を取得する中心部矩形の半辺長
        self.predict_var = MIN_VAR  # パーティクルをばら撒く時の分散
        self.var_inc = 0.0          # パーティクルをばら撒く時の分散の増分（倍）
        self.pos = None             # 追跡結果の位置
        self.kalman = Kalman()      # 追跡位置予測用のkalmanフィルタ
        self.kalman_pos = None      # kalmanフィルタによって予測された追跡位置
        self.total_weight = 0       # 総尤度(=捕捉率)

    def init(self, image, rect):
        """追跡矩形の設定とパーティクル格納用配列の作成"""
        self.rect = rect
        # 追跡矩形の大きさに応じて、パーティクルをばら撒く時の分散の度合いを決める
        var_base = min(self.rect[2:]) #sum(self.rect[2:]) / 2
        MAGIC_VAR_RATIO = 5
        self.predict_var = min(max(var_base / MAGIC_VAR_RATIO, MIN_VAR), MAX_VAR)
        # 分散の増分を初期化する
        self.var_inc = Particle.init_var_inc
        # 追跡対象の特徴を取得する（色、明るさ、ヒストグラム、オブジェクトパターン等何でもよい）
        try: info = self.setup_target(image, rect) #画像領域をはみ出す可能性があるので
        except IndexError: return False
        # ログ出力用の要約
        self.info = "追跡対象 = {}, ばら撒き分散 = {}".format(info, self.predict_var)
        # kalmanフィルタを初期化
        self.pos = ut.rect_center(rect)
        self.kalman.init(self.pos)
        # パーティクル格納用の配列を作成
        LOCK.acquire()
        ps = np.ndarray((Particle.n_particle, 3), dtype=np.float32)
        LOCK.release()
        # パーティクル用配列に中心座標と尤度をセット
        x, y = self.pos
        w = self.calc_weight(image, self.pos)
        ps[:] = [x, y, w]
        self.total_weight = ps[:, 2].sum()
        if self.total_weight <= 0: return False
        self.particles = ps
        # 追跡開始
        self.update(image)
        return True

    def setup_target(self, image, rect):
        """追跡対象を設定する仮想関数。継承先で実装する必要あり。"""
        raise ut.ProgramError("Particle.get_target(self, image, rect) must be overrided.")

    def get_target_rect(self, image, rect, ofst=(0, 0)):
        """追跡対象の特徴を取得する中心部矩形を取得する、setup_target()から呼び出す必要がある"""
        ar = np.array(rect)
        wh = ar[2:] // 2
        MAGIC_SIZE_RATIO = 5
        self.target_size = int(max(wh.min() / MAGIC_SIZE_RATIO, Particle.min_target_size))
        #self.target_size = Particle.min_target_size
        xy = ar[:2] + wh + ofst - self.target_size
        tr = (xy[0], xy[1], self.target_size, self.target_size)
        ir = (0, 0, image.shape[1], image.shape[0])
        return ut.limit_rect(tr, ir)

    def calc_weight(self, image, pos):
        """尤度を算出する。追跡対象との差異から正規分布の確率密度を求める。"""
        try: diff = self.calc_weight_diff(image, tuple(map(int, pos))) #画像領域をはみ出す可能性があるので
        except IndexError: return 0
        #平均が 0、分散が SIGMA の正規分布の diff における確率密度を尤度とする
        return NDIST_COEF * math.exp(-diff * diff / NDIST_DENOM)

    def calc_weight_diff(self, image, pos):
        """尤度算出のための差異値を計算する仮想関数。継承先で実装する必要あり。"""
        raise ut.ProgramError("Particle.calc_weight_diff(self, image, pos) must be overrided.")

    def update(self, image):
        """追跡処理"""
        #Particle.controller.check_window()
        self.kalman_pos = self.kalman.predict()
        # 1.リサンプリング
        self.resample()
        # 2.推定
        self.predict(image.shape)
        # 3.観測
        self.pos = self.observe(image)
        if self.pos is None: return False, None
        if self.pos == 0: # KALMAN_IF_LIGHT = True 時のみ
            self.pos = self.kalman_pos
        self.kalman.correct(self.pos)
        return True, self.result(image)

    def resample(self):
        """1.リサンプリング(前状態の重みに応じてパーティクルを再選定)"""
        if SIMPLE_RESAMPLE:
            self.particles[:, :2] = self.pos
        else:
            # 以下はややこしいわりに、上記と能力的に大差ない
            # 累積重みの計算
            ws = self.particles[:, 2].cumsum()
            if ws.shape[0] <= 0: return
            # 新しいパーティクル用の空配列を生成
            new_ps = np.empty(self.particles.shape)
            # 前状態の重みに応じてパーティクルをリサンプリング（重みは1.0）
            for i in range(self.particles.shape[0]):
                w = np.random.rand()
                new_ps[i] = self.particles[(ws > w).argmax()]
            self.particles = new_ps

    def predict(self, image_shape):
        """2.推定（パーティクルの位置）"""
        # kalman予測を加味する
        ofst = [(k - p) * Particle.kalman_ratio for k, p in zip(self.kalman_pos, self.pos)]
        mag = max(1, sum(ofst) / self.predict_var) * Particle.var_ratio
        # 総尤度が低い場合、分散に初期増分を反映させる
        if WIDE_IF_LIGHT and self.__is_light(): # あまり効果なし
            self.var_inc = Particle.init_var_inc
        # 分散の初期増分を加味する
        var = self.predict_var * (1.0 + self.var_inc) * mag
        # 分散に従ってランダムに少し位置をずらす
        n = self.particles.shape[0]
        self.particles[:, 0] += ofst[0] + np.random.randn((n)) * var
        self.particles[:, 1] += ofst[1] + np.random.randn((n)) * var
        # 初期増分を減衰させる
        self.var_inc *= Particle.var_dec_rate

    def observe(self, image):
        """3.観測（全パーティクルの重み付き平均を取得）"""
        ps = self.particles
        # 尤度に従ってパーティクルの重み付け
        for i in range(ps.shape[0]):
            ps[i, 2] = self.calc_weight(image, ps[i, :2])
        self.total_weight = ps[:, 2].sum()
        if self.total_weight == 0: return None
        if KALMAN_IF_LIGHT and self.__is_light(): return 0
        # 重み和の計算
        x = (ps[:, 0] * ps[:, 2]).sum() / self.total_weight
        y = (ps[:, 1] * ps[:, 2]).sum() / self.total_weight
        try: return  (int(x), int(y)) # x, y が NaN の可能性があるので
        except ValueError: return None

    def __is_light(self):
        MAGIC_LIGHT_RATIO = 5
        max_weight = self.particles.shape[0] * NDIST_COEF
        ratio = math.sqrt(self.total_weight / max_weight) * MAGIC_LIGHT_RATIO
        return  ratio < 1


    def result(self, image):
        """追跡結果矩形の算出と追跡対象の更新"""
        x, y = self.pos
        max_weight = self.particles.shape[0] * NDIST_COEF
        if RATIO_RECT != 0:
            # self.total_weight（捕捉率）に応じて矩形の大きさを変える => 捕捉率が低いと小さくなる
            ratio = min(math.sqrt(RATIO_RECT * self.total_weight / max_weight), 1)
            w, h = [max(int(v * ratio), MIN_RECT) for v in self.rect[2:]]
        else:
            w, h = self.rect[2:]
        ir = (0, 0, image.shape[1], image.shape[0])
        rect = ut.limit_rect((x - w // 2, y - h // 2, w, h), ir)
        if UPDATE_TARGET and self.total_weight >= max_weight * UPDATE_TARGET:
            self.setup_target(image, rect)
        return rect

    def draw(self, image):
        """追跡状況の表示"""
        if Particle.show_ps:
            self.draw_target(image)
            # パーティクルを追跡対象色でプロットする
            ps = self.particles
            for i in range(ps.shape[0]):
                try: image[int(ps[i, 1]), int(ps[i, 0])] = self.get_plot_color() #画像領域をはみ出す可能性があるので
                except IndexError: pass

        if ut.wait_key.last_key == ord('x'):
            Particle.show_ps = not Particle.show_ps
            ut.wait_key.last_key = -1

    def draw_target(self, image, pos=None, color=None):
        """追跡対象の特徴を取得する中心部矩形を指定位置に描画する。"""
        if pos is None:
            pos = self.pos
        if color is None:
            color = self.get_plot_color()
        ts = self.target_size
        td = int(ts * 2)
        rect = (pos[0] -ts, pos[1] - ts, td, td)
        ut.draw_rect(image, rect, color, -1)

    def get_plot_color(self):
        """パーティクルをプロットする色を取得。継承側でオーバーライドする。"""
        return ut.WHITE


class ParticleController(object):
    """
    Particleの各種設定を変更するパネルです。
    以下の設定を変更できます。

    N_Prtcl: ばら撒くパーティクルの数、追跡中のものには変更が反映されない。
    Trgt_Sz: 追跡対象の特徴を取得する中心部矩形の大きさの最小値、辺長の半分。
    KalR*10: パーティクルをばら撒く位置に対するkalman予測の反映比率、実際値はスケール値の1/10。
    VarR*10: パーティクルをばら撒く時の分散の拡縮比率、実際値はスケール値の1/10。
    VarIncR: ばら撒き分散の初期（無予測時）増分、実際値はスケール値の1/10。
    VarDecR: ばら撒き分散の初期増分の減衰率（予測有効時の初期増分打消）、実際値はスケール値の1/10。
    Show_Pt: ばら撒いたパーティクルを画像上に表示するか否かのフラグ。

    パネルでの変更は、設定ファイルに保存され、次回実行時にも反映されます。

    """
    def __init__(self):
        self.window_name = "Particle Controller"
        self.setup()

    def setup(self):
        w = self.window_name
        print("===== {} を表示します。 =====".format(w))
        print(self.__doc__)
        cv.namedWindow(w)
        cv.imshow(w, np.zeros((48, 640, 3), np.uint8))
        cv.createTrackbar("N_Prtcl", w, Particle.n_particle, MAX_PARTICLE, self.on_n_particle)
        cv.createTrackbar("Trgt_Sz", w, Particle.min_target_size, 16, self.on_min_target_size)
        cv.createTrackbar("KalR*10", w, int(Particle.kalman_ratio * 10), 20, self.on_kalman_ratio)
        cv.createTrackbar("VarR*10", w, int(Particle.var_ratio * 10), 20, self.on_var_ratio)
        cv.createTrackbar("VarIncR", w, int(Particle.init_var_inc * 10), 30, self.on_var_inc)
        cv.createTrackbar("VarDecR", w, int(Particle.var_dec_rate * 10), 10, self.on_var_dec)
        cv.createTrackbar("Show_Pt", w, Particle.show_ps, 1, self.on_show_ps)

    def check_window(self):
        if ut.window_closed(self.window_name):
            self.setup()

    @staticmethod
    def on_n_particle(value):
        if value == 0:
            value = 1
        LOCK.acquire()
        Particle.n_particle = value
        LOCK.release()
        settings.set_option(PARTICLE, "n_particle", str(Particle.n_particle))
        settings.save()

    @staticmethod
    def on_min_target_size(value):
        value = max(value, 1)
        Particle.min_target_size = value
        settings.set_option(PARTICLE, "min_target_size", str(Particle.min_target_size))
        settings.save()

    @staticmethod
    def on_kalman_ratio(value):
        Particle.kalman_ratio = value / 10
        settings.set_option(PARTICLE, "kalman_ratio", str(Particle.kalman_ratio))
        settings.save()

    @staticmethod
    def on_var_ratio(value):
        Particle.var_ratio = value / 10
        settings.set_option(PARTICLE, "var_ratio", str(Particle.var_ratio))
        settings.save()

    @staticmethod
    def on_var_inc(value):
        Particle.init_var_inc = value / 10
        settings.set_option(PARTICLE, "init_var_inc", str(Particle.init_var_inc))
        settings.save()

    @staticmethod
    def on_var_dec(value):
        Particle.var_dec_rate = value / 10
        settings.set_option(PARTICLE, "var_dec_rate", str(Particle.var_dec_rate))
        settings.save()

    @staticmethod
    def on_show_ps(value):
        Particle.show_ps = value != 0


if __name__ == '__main__':
    from main import track
    from particle_color import ParticleColor
    track(ParticleColor)
