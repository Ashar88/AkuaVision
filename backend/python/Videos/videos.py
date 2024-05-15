import cv2
import pandas as pd
from ultralytics import YOLO
import os
import logging
import sys

def detect(model_path, video_path, save_path, conf_thresh=0.5, image=320):
    model = YOLO(model_path)
    results = model(video_path, imgsz=image, conf=conf_thresh, save=True, name=save_path, exist_ok=True, stream=True)
    try:
        for r in results:
            next(results)
    except :
        pass


if __name__ == '__main__':
    video_path = sys.argv[1]
    model_path = sys.argv[2]
    conf_thresh = float(sys.argv[3])
    imgsz = int(sys.argv[4])

    output_path = '/'.join(video_path.replace("uploads", "processed", 1).split('/')[:-1])

    print("In python file", model_path, conf_thresh)
    print("In python file", video_path, output_path)

    
    detect(model_path, video_path, output_path, conf_thresh, imgsz)
