import uuid
from sqlalchemy import Column, Float, String, DateTime, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .database import Base

class FaceDetection(Base):
    __tablename__ = "face_detections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Bounding box coordinates (Normalized 0.0 - 1.0)
    x_min = Column(Float, nullable=False)
    y_min = Column(Float, nullable=False)
    width = Column(Float, nullable=False)
    height = Column(Float, nullable=False)
    
    # Confidence score from Mediapipe
    confidence = Column(Float, nullable=True)

    __table_args__ = (
        Index('ix_face_detections_session_timestamp', 'session_id', 'timestamp'),
    )
