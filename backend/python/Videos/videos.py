from ultralytics import YOLO
import os
import sys


def detect(model_path, video_path, save_path, fileName, conf_thresh=0.5, image=320):
    model = YOLO(model_path)
    results = model(video_path, imgsz=image, conf=conf_thresh, save=True, name=save_path, exist_ok=True, stream=True)
    try:
        for r in results:
            next(results)
    except :
        pass

    convert_avi_to_mp4(save_path+'/'+fileName.replace('.mp4', '.avi'), save_path+'/'+fileName)



def convert_avi_to_mp4(avi_file_path, output_name):
  command = f"ffmpeg -i '{avi_file_path}' -ac 2 -b:v 2000k -c:a aac -c:v libx264 -b:a 160k -vprofile high -bf 0 -strict experimental -f mp4 '{output_name}' -y"
  os.popen(command)
  return True



if __name__ == '__main__':
    video_path = sys.argv[1]
    model_path = sys.argv[2]
    conf_thresh = float(sys.argv[3])
    imgsz = int(sys.argv[4])

    output_path = '/'.join(video_path.replace("uploads", "processed", 1).split('/')[:-1])
    fileName = video_path.replace("uploads", "processed", 1).split('/')[-1]

    print("In python file", model_path, conf_thresh, fileName)
    print("In python file", video_path, output_path)

    
    detect(model_path, video_path, output_path, fileName, conf_thresh, imgsz)
