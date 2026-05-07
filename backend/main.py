import uuid
import asyncio
from typing import List
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

import models
import schemas
import database
from services.vision import vision_service

# Initialize Database
models.Base.metadata.create_all(bind=database.engine)

# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="FaceStream ROI Monitor")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Simple in-memory buffer for the MJPEG stream
latest_processed_frame = None
last_frame_time = 0
frame_lock = asyncio.Lock()

@app.post("/api/v1/feed/ingest", status_code=202)
async def ingest_feed(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    global latest_processed_frame, last_frame_time
    
    contents = await file.read()
    if len(contents) > 2 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Payload too large")
    
    # Process frame
    processed_bytes, roi_data = vision_service.process_frame(contents)
    
    # Update stream buffer and signal
    async with frame_lock:
        latest_processed_frame = processed_bytes
        last_frame_time = asyncio.get_event_loop().time()
    
    # Persist ROI data asynchronously (non-blocking)
    if roi_data:
        asyncio.create_task(persist_roi(roi_data))
    
    return {"status": "accepted", "face_detected": roi_data is not None}

async def persist_roi(roi_data: dict):
    # Use a fresh session for background persistence
    try:
        db = next(database.get_db())
        db_roi = models.FaceDetection(
            session_id=str(uuid.uuid4()),
            **roi_data
        )
        db.add(db_roi)
        db.commit()
        db.close()
    except Exception as e:
        print(f"ERROR persisting ROI: {e}")

async def generate_mjpeg():
    local_last_time = 0
    while True:
        if last_frame_time > local_last_time:
            async with frame_lock:
                frame = latest_processed_frame
                local_last_time = last_frame_time
            
            if frame:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        
        await asyncio.sleep(0.01) # Poll for new frames at 100Hz

@app.get("/api/v1/feed/stream")
async def stream_feed():
    return StreamingResponse(
        generate_mjpeg(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.get("/api/v1/roi", response_model=List[schemas.ROIRead])
async def get_roi_data(
    request: Request,
    limit: int = 100,
    db: Session = Depends(database.get_db)
):
    detections = db.query(models.FaceDetection)\
        .order_by(models.FaceDetection.timestamp.desc())\
        .limit(limit)\
        .all()
    return detections

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
