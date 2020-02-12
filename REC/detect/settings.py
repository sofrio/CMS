# -*- coding: utf-8 -*-
"""設定ファイルを管理するモジュール"""
__author__ = "kojima@sofrio.com"
__date__ = "May 13 05:28:29 2018"

import os
import configparser
import util as ut

SETTINGS = "__settings.ini"
DIR = "dir"
OPENCV_DIR = "opencv"
DATA_DIR = "data"
CASCADE_DIR = "cascade"

class Settings(object):
    config = configparser.ConfigParser()

def dir_contains(dir_path, name):
    try:
        if name in os.listdir(dir_path): return True
    except IOError:
        pass
    return False

def load(name=SETTINGS):
    Settings.config.read(name)
    if not Settings.config.has_section(DIR):
        Settings.config.add_section(DIR)

def save(name=SETTINGS):
    with open(name, 'w') as file:
        Settings.config.write(file)

def get_option(section, option, default=""):
    try:
        value = Settings.config.get(section, option)
    except configparser.NoSectionError:
        value = default
    except configparser.NoOptionError:
        value = default
    return value

def set_option(section, option, value):
    if not Settings.config.has_section(section):
        Settings.config.add_section(section)
    Settings.config.set(section, option, value)

def get_opencv_dir():
    need_save = False
    path = get_option(DIR, OPENCV_DIR)
    while True:
        if dir_contains(path, "etc"): break
        need_save = True
        path = input("Enter OpenCV installed directory ('q' to quit) >> ")
        if path == "q" or path == "Q": return ""
    if need_save:
        Settings.config.set(DIR, OPENCV_DIR, path)
        save()
    return path

def __get_dir(option, kind, name):
    if name == "": return name
    need_save = False
    path = os.getcwd() + kind
    if dir_contains(path, name): return path + "/" + name
    path = get_option(DIR, option)
    while True:
        if dir_contains(path, name): break
        need_save = True
        path = input("Enter %s directory contains %s ('q' to quit) >> " % (kind, name))
        if path == "q" or path == "Q": return ""
    if need_save:
        Settings.config.set(DIR, option, path)
        save()
    return path

def __get_path(option, mid_dir, get_dir, name):
    if name == "":
        return name
    path = os.getcwd() + mid_dir
    if dir_contains(path, name): return path + "/" + name
    path = get_option(DIR, option)
    if dir_contains(path, name): return path + "/" + name
    path = get_opencv_dir() + mid_dir
    if dir_contains(path, name): return path + "/" + name
    path = get_dir(name)
    if path == "q" or path == "Q": return ""
    return path + "/" + name

def get_data_dir(name):
    return __get_dir(DATA_DIR, "data", name)

def get_cascade_dir(name):
    return __get_dir(CASCADE_DIR, "cascade", name)

def get_data_path(name):
    return __get_path(DATA_DIR, "/sample/data", get_data_dir, name)

def get_cascade_path(name):
    return __get_path(CASCADE_DIR, "/etc/haarcascades", get_cascade_dir, name)

def get_section(section):
    return Settings.config.items(section)

def get_section_values(section):
    if not Settings.config.has_section(section): return ()
    values = []
    for _, value in Settings.config.items(section):
        values.append(value)
    return tuple(values)

def set_section(section, values):
    if not Settings.config.has_section(section):
        Settings.config.add_section(section)
    values = ut.uniq(values)
    for i, value in enumerate(values):
        Settings.config.set(section, str(i), value)


if __name__ == '__main__':
    import main
    main.main()
