from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class EventPreview(BaseModel):
    id: uuid.UUID
    name: str
    start_time: datetime
    end_time: datetime
    guest_invited: int
    guest_checked_in: int

    class Config:
        orm_mode = True

