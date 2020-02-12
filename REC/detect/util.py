# -*- coding: utf-8 -*-
"""汎用定数や汎用関数を集めたモジュール"""
__author__ = "kojima@sofrio.com"
__date__ = "May 13 05:28:29 2018"

import pdb
import inspect
import cProfile as profile

import os
import sys
import itertools
import threading
import numpy as np
import cv2 as cv

CTRL_C = 3
ESC = 27

WHITE = (255, 255, 255)
GRAY = (128, 128, 128)
BLACK = (0, 0, 0)
RED = (0, 0, 255)
GREEN = (0, 255, 0)
BLUE = (255, 0, 0)
CYAN = (255, 255, 0)
PURPLE = (255, 0, 128)
YELLOW = (0, 255, 255)
COLORS = (WHITE, RED, GREEN, BLUE, GRAY, CYAN, PURPLE, YELLOW, BLACK)
COLOR_NAMES = ("白", "赤", "緑", "青", "灰", "水", "紫", "黄", "黒")

TEXT_LEFT = 4
TEXT_TOP = 16
TEXT_TOP_LEFT = (TEXT_LEFT, TEXT_TOP)
TEXT_HIGHT = 14
LIST_BASE = 22 + TEXT_HIGHT
LIST_POS = (TEXT_LEFT, LIST_BASE)


class ProgramError(Exception):
    pass

def debug_break(*_):
    """デバッガに突入する。"""
    pdb.set_trace()

def get_members(object, predicate=None):
    """inspect.getmembers()を呼び出す。"""
    return inspect.getmembers(object, predicate)

def get_arg_spec(func):
    """inspect.getargspec()を呼び出す。"""
    return inspect.getargspec(func)
    
def no_main():
    """main() がないことを通知し、コマンドプロンプトが消えない様に何らかの入力を待つ。"""
    print("There is no main(), execute Main.py instead.")
    input("Press ENTER...")

def abort(msg):
    """プログラムを中断する。"""
    print("The program has aborted..." + msg)
    input("Press ENTER...")
    class AbortionError(Exception):
        pass
    raise AbortionError(msg)

def get_arg(idx):
    """指定された位置のコマンド引数を取得する。"""
    try:
        arg = sys.argv[idx]
    except IndexError:
        arg = ""
    return arg

def is_ok(msg):
    ans = input(msg + " (y/n) >> ")
    return ans == "y" or ans == "Y"

def ask(msg):
    return is_ok(msg + "\nよろしいですか？")

def menu_input(msg, menu, shift=1):
    print(msg)
    keys = tuple(menu)
    menus = ("\t" + str(i + shift) + " : " + item for i, item in enumerate(keys))
    print("\n".join(menus))
    ans = input(">> ")
    try:
        idx = int(ans) - shift
        return keys[idx]
    except ValueError:
        return ans
    except LookupError:
        return ans

def menu_in(msg, menu, shift=1):
    ans = menu_input(msg, menu, shift)
    return ans if ans in menu else None

def uniq(seq):
    seen = set()
    seen_add = seen.add
    return [x for x in seq if x not in seen and not seen_add(x)]

def clone_iterater(iterater, n=2):
    return itertools.tee(iterater, n)

def window_closed(window_name):
    return cv.getWindowProperty(window_name, 0) < 0 if window_name else False

def wait_key(tick, escaper=None):
    wait_key.last_key = -1
    until = cv.getTickCount() + tick
    while True:
        wait_key.last_key = cv.waitKey(1)
        if wait_key.last_key == CTRL_C: raise KeyboardInterrupt
        if wait_key.last_key >= 0: break
        if escaper and escaper(): break
        if tick > 0 and cv.getTickCount() >= until: break
    return wait_key.last_key

wait_key(1) # to create instance

def make_dirs(path):
    dirs = os.path.dirname(path)
    if os.path.isdir(dirs): return
    os.makedirs(dirs, 0o777, exist_ok=True)
    
def imread(path, flags=cv.IMREAD_COLOR, dtype=np.uint8):
    data = np.fromfile(path, dtype)
    return cv.imdecode(data, flags)

def imwrite(path, image, params=None):
    ext = os.path.splitext(path)[1]
    r, data = cv.imencode(ext, image, params)
    if not r: return False
    with open(path, mode="w+b") as f:
        data.tofile(f)
    return True

def box_rect(box):
    x, y, X, Y = box
    return (x, y, X - x, Y - y)

def rect_box(rect):
    x, y, w, h = rect
    return (x, y, x + w, y + h)

def rotated_rect_box(rect):
    return np.int0(cv.boxPoints(rect))

def bounding_rect(rect):
    box = rotated_rect_box(rect)
    return cv.boundingRect(box)

def rect_center(rect):
    if len(rect) == 3: #may be rotatedRect
        rect = bounding_rect(rect)
    x, y, w, h = rect
    return (int(x + w / 2), int(y + h / 2))

def rect_gtr(rect, size):
    if len(rect) == 3: #may be rotatedRect
        rect = bounding_rect(rect)
    w, h = rect[2:]
    return w > size and h > size

def rect_contains(rect, point):
    if rect and point:
        if len(rect) == 3: #may be rotatedRect
            rect = bounding_rect(rect)
        x, y, w, h = rect
        X, Y = point
        return x <= X and X < x + w and y <= Y and Y < y + h
    return False

def rect_covers(rect, sub_rect):
    if len(rect) == 3: #may be rotatedRect
        rect = bounding_rect(rect)
    if len(sub_rect) == 3: #may be rotatedRect
        sub_rect = bounding_rect(sub_rect)
    x, y, w, h = rect
    _x, _y, _w, _h = sub_rect
    if _x < x or _y < y: return False
    X, Y = x + w, y + h
    _X, _Y = _x + _w, _y + _h
    if X < _X or Y < _Y: return False
    #print("rect_covers({}, {}) is True!".format(rect, sub_rect))
    return True

def limit_rect(rect, limit):
    br = rect_box(rect)
    bl = rect_box(limit)
    x, y = np.maximum(br[:2], bl[:2])
    X, Y = np.minimum(br[2:], bl[2:])
    return x, y, X - x, Y - y
    
def get_color(idx):
    return COLORS[idx % len(COLORS)]

def color_name(color):
    try:
        idx = COLORS.index(color)
        return COLOR_NAMES[idx]
    except ValueError:
        return str(color)

def draw_text(image, point, text, color=WHITE):
    x, y = point
    back = WHITE if color in (BLACK, BLUE) else BLACK
    cv.putText(image, text, (x + 1, y + 1), cv.FONT_HERSHEY_PLAIN, 1.0, back, thickness=2, lineType=cv.LINE_AA)
    cv.putText(image, text, (x, y), cv.FONT_HERSHEY_PLAIN, 1.0, color, lineType=cv.LINE_AA)

def draw_rect(image, rect, color, thickness=2):
    if not rect: return
    if len(rect) == 3: #may be rotatedRect
        draw_rotated_rect(image, rect, color, thickness)
        return
    x, y, w, h = np.int0(rect)
    cv.rectangle(image, (x, y), (x + w, y + h), color, thickness)

def draw_rotated_rect(image, rect, color, thickness=2):
    box = rotated_rect_box(rect)
    cv.drawContours(image, [box], 0, color, thickness)

def draw_ellipse(image, box, color, thickness=2):
    try:
        image = cv.ellipse(image, box, color, thickness)
    except cv.error as ex:
        print("{} => {}".format(box, ex))
    return image

def threader(func, *args):
    try:
        task = threading.Thread(target=func, args=args)
        #task.setDaemon(True)
        task.start()
        return task
    except threader.error as err:
        print("%s: %s" % (err, str(func)))
        func(*args)
        return None

if __name__ == '__main__':
    no_main()
