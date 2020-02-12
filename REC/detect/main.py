# -*- coding: utf-8 -*-
"""
Created on Wed Oct  3 07:41:47 2018

@author: kojima
"""

import os
import sys
import time
import json
import shutil
import cv2 as cv
import util as ut
from detect import Detect

RECORD_DIR = "/CMS.REC/record-data/"
DETECT_DIR = "/CMS.REC/detect-data/"
IMAGE_EXT = ".jpg"
MOVIE_LIST = None #"movielist.json"

LOCAL_TEST = False
if LOCAL_TEST:
    RECORD_DIR = "Z:/REC/www/record-data/"
    DETECT_DIR = "Z:/REC/www/detect-data/"


def write(path, image):
    path = DETECT_DIR + path
    ut.make_dirs(path)
    cv.imwrite(path, image)
    print(path)

def copy(path):
    src = RECORD_DIR + path
    if not os.path.exists(src): return False
    dst = DETECT_DIR + path
    ut.make_dirs(dst)
    shutil.copyfile(src, dst)
    #s.chmod(dst, 0o666)
    print(dst)
    return True

def main():
    file_name = MOVIE_LIST if MOVIE_LIST else ut.get_arg(1)
    if file_name:
        with open(file_name) as file:
            movie_list = json.load(file)
    else:
        movie_list = json.load(sys.stdin)

    detect = Detect()
    detect.setup()
    old_mask = os.umask(0)
    start = time.time()
    writes = copies = 0
    for sec_list in movie_list.values():
        for path in sec_list.values():
            ext = os.path.splitext(path)[1]
            #if file_name or ext != IMAGE_EXT:
            if ext != IMAGE_EXT:
                if copy(path):
                    copies += 1
                continue
            image = cv.imread(RECORD_DIR + path)
            if image is None: continue
            #image = np.float32(image) / 255
            image = detect.process(path, image)
            #image = np.uint8(image * 255)
            write(path, image)
            writes += 1
    print("{} seconds for writing {} files and copying {} files.".format(time.time() - start, writes, copies))
    os.umask(old_mask)
    detect.release()
    return 0

if __name__ == '__main__':
    main()
