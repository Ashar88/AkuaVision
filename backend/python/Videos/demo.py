from detect import detectVideo

model_path = 'yolov8n.pt'
video_path = 'traffictrim.mp4'
output_video_path = 'processed_video.mp4'

detectVideo(video_path, model_path, save_output_file=True, save_output_file_name = output_video_path, view_output_video= False)
