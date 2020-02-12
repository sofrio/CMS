# -*- coding: utf-8 -*-
 
import os
import cv2 as cv
import util as ut

INPUT_VIDEO = "vtest.avi"
OUTPUT_VIDEO = "vtest_out.avi"
RECORD_DIR = "/CMS.REC/record-data/29/2018/10/11/00/"
DETECT_DIR = "/CMS.REC/detect-data/29/2018/10/11/00/"
IMAGE_SIZE = (320, 240)

def write(path, image):
    path = RECORD_DIR + path
    ut.make_dirs(path)
    cv.imwrite(path, image)
    print(path)

def get_path(usec):
    sec = usec // 1000000
    usec = usec % 1000000
    mnt = sec // 60
    sec = sec % 60
    path = "%02d/%02d/%06d.jpg" % (mnt, sec, usec)
    return path

def avi2jpg():
    cap = cv.VideoCapture()
    if not cap.open(INPUT_VIDEO):
        print("could not open '{}'.".format(INPUT_VIDEO))
        return
    fps = cap.get(cv.CAP_PROP_FPS)
    period = 1000000 / fps
    print("fps: {} => period: {}".format(fps, period))
    old_mask = os.umask(0)
    usec = 0.0
    while True:
        done, image = cap.read()
        if not done: break
        image = cv.resize(image, IMAGE_SIZE)
        path = get_path(int(usec))
        write(path, image)
        usec += period
    os.umask(old_mask)
    cap.release()

def read(path):
    path = DETECT_DIR + path
    image = cv.imread(path)
    if image is None: return None 
    print(path)
    return image

def jpg2avi():
    fourcc = cv.VideoWriter_fourcc(*'XVID') 
    fps = 10.0
    out = cv.VideoWriter(OUTPUT_VIDEO,fourcc, fps, IMAGE_SIZE)
    period = 1000000 / fps
    usec = 0.0
    while True:
        path = get_path(int(usec))
        image = read(path)
        if image is None: break
        image = cv.resize(image, IMAGE_SIZE)
        out.write(image)
        usec += period
    out.release()
    
def main():
    #avi2jpg()
    jpg2avi()

if __name__ == '__main__':
    main()
