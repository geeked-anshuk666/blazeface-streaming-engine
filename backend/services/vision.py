import io
import logging
import mediapipe as mp
from PIL import Image, ImageDraw

logger = logging.getLogger(__name__)

class VisionService:
    def __init__(self):
        # Initialize Mediapipe Face Detection
        self.mp_face_detection = mp.solutions.face_detection
        self.face_detection = self.mp_face_detection.FaceDetection(
            model_selection=0, # 0 for short-range, 1 for long-range
            min_detection_confidence=0.5
        )

    def process_frame(self, frame_bytes: bytes):
        """
        Processes a single frame: detects face and draws a bounding box.
        Returns: (processed_frame_bytes, roi_data or None)
        """
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(frame_bytes))
            
            # Mediapipe requires RGB images
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            import numpy as np
            image_array = np.array(image)
            
            # Detect faces
            results = self.face_detection.process(image_array)
            
            roi_data = None
            
            if results.detections:
                # Strictly isolate the first/largest face detected
                # Mediapipe detections are already sorted by confidence or size
                detection = results.detections[0]
                bbox = detection.location_data.relative_bounding_box
                
                # ROI Data (Normalized)
                roi_data = {
                    "x_min": bbox.xmin,
                    "y_min": bbox.ymin,
                    "width": bbox.width,
                    "height": bbox.height,
                    "confidence": detection.score[0]
                }
                
                # Draw ROI using Pillow
                draw = ImageDraw.Draw(image)
                width, height = image.size
                
                # Convert normalized coordinates to pixel coordinates
                left = bbox.xmin * width
                top = bbox.ymin * height
                right = (bbox.xmin + bbox.width) * width
                bottom = (bbox.ymin + bbox.height) * height
                
                # Draw the axis-aligned minimal bounding box
                draw.rectangle([left, top, right, bottom], outline="red", width=3)

            # Convert back to bytes (JPEG)
            output_buffer = io.BytesIO()
            image.save(output_buffer, format="JPEG")
            return output_buffer.getvalue(), roi_data

        except Exception as e:
            # Catch image parsing errors, drop frame, log warning, do not crash
            logger.warning(f"Failed to process frame: {e}")
            return frame_bytes, None

vision_service = VisionService()
