from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional

class ROIBase(BaseModel):
    x_min: float
    y_min: float
    width: float
    height: float
    confidence: Optional[float] = None

class ROIRead(ROIBase):
    id: str
    session_id: str
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

class SessionMetadata(BaseModel):
    session_id: str
    frame_count: int
