import urllib.request
import os

MODEL_URL = "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"
MODEL_PATH = "face_detector.tflite"

def download_model():
    if not os.path.exists(MODEL_PATH):
        print(f"Downloading face detector model from {MODEL_URL}...")
        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
        print("Download complete.")
    else:
        print("Model file already exists.")

if __name__ == "__main__":
    download_model()
