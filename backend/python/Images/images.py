from ultralytics import YOLO
import sys

def detect_and_display(model_path,image_path, save_path, conf_thresh=0.5, image=320):
    model = YOLO(model_path)
    results = model(image_path, imgsz=image, conf=conf_thresh, stream=True)

    for i, result in enumerate(results):
        result.save(filename=save_path[i])



if __name__ == '__main__':
    image_paths = sys.argv[1]
    model_path = sys.argv[2]
    conf_thresh = float(sys.argv[3])
    imgsz = int(sys.argv[4])

    if not isinstance(image_paths, list):
        image_paths = [image_paths]

    output_paths = [s.replace("uploads", "processed", 1) for s in image_paths]

    print("In python file", model_path, conf_thresh)

    detect_and_display(model_path, image_paths, output_paths, conf_thresh, imgsz)
