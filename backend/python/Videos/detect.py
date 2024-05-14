import cv2
import pandas as pd
from ultralytics import YOLO
import os
import logging

log_folder = 'log'
if not os.path.exists(log_folder):
    os.makedirs(log_folder)

log_file_path = os.path.join(log_folder, 'vehicle_detection.log')
logging.basicConfig(filename=log_file_path, filemode='a', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')


def video_filename(prefix):
    videos_folder = 'videos'
    if not os.path.exists(videos_folder):
        os.makedirs(videos_folder)

    existing_files = os.listdir(videos_folder)
    if not existing_files:
        return os.path.join(videos_folder, f"{prefix}_1.mp4")

    last_counter = 0
    existing_files.sort()
    for name in reversed(existing_files):
        if prefix in name:
            last_filename = name
            last_counter = int(last_filename.split('_')[-1].split('.')[0])
            break

    next_counter = last_counter + 1
    return os.path.join(videos_folder, f"{prefix}_{next_counter}.mp4")




def detectVideo(video_path, model_path='yolov8n.pt',
                  bounding_box_color=(0, 255, 0),
                  bounding_box_thickness=2,
                  text_size=1,
                  text_color=(0, 255, 255),
                  text_thickness=2,
                  save_output_file = False,
                  save_output_file_prefix = "video",
                  save_output_file_name = "",
                  view_output_video = True,
                 ):

    try:
        if not os.path.isfile(video_path):
            logging.error(f" {video_path} file does not exist.")
            return

        model = YOLO(model_path)    
        required_classes = {1: 'bicycle', 2: 'car', 3: 'motorcycle', 4: 'airplane', 5: 'bus', 6: 'train', 7: 'truck'}
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            logging.error("Error opening video file.")
            return

        if(save_output_file):
            save_output_file_name = video_filename(save_output_file_prefix) if len(save_output_file_name)==0 else save_output_file_name

            frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fps = int(cap.get(cv2.CAP_PROP_FPS))

            # Define the codec and create VideoWriter object
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(save_output_file_name, fourcc, fps, (frame_width, frame_height))


        while True:    
            ret, frame = cap.read()
            if not ret:
                break

            results = model.predict(frame, verbose=False)
            a = results[0].boxes.data
            a = a.detach().cpu().numpy()  
            px = pd.DataFrame(a).astype("float")

            bbox_list = []         
            for index, row in px.iterrows():
                x1 = int(row[0])
                y1 = int(row[1])
                x2 = int(row[2])
                y2 = int(row[3])
                d = int(row[5])
                if d in required_classes:
                    c = required_classes[d]
                    bbox_list.append([x1, y1, x2, y2, c])

            for bbox in bbox_list:
                x1, y1, x2, y2, c = bbox
                cv2.rectangle(frame, (x1, y1), (x2, y2), bounding_box_color , bounding_box_thickness)
                cv2.putText(frame, str(c), (x1, y1), cv2.FONT_HERSHEY_COMPLEX, text_size, text_color, text_thickness)


            if(save_output_file):
                out.write(frame)  # Write the frame to the video
            if(view_output_video):
                cv2.imshow("Result", frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break


        if(save_output_file):
            out.release()

        cap.release()
        cv2.destroyAllWindows()
        logging.info("Processing completed successfully.")
    
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
