from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class SignUpRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserProfile(BaseModel):
    name: str
    email: str

class EventPreview(BaseModel):
    id: uuid.UUID
    name: str
    start_time: datetime
    end_time: datetime
    guest_invited: int
    guest_checked_in: int

    class Config:
        orm_mode = True

class EventList(BaseModel):
    current_event: EventPreview | None
    future_events: list[EventPreview]
    past_events: list[EventPreview]

class GuestListItem(BaseModel):
    id: uuid.UUID
    name: str
    invitedBy: str
    checkedIn: bool

    class Config:
        orm_mode = True

class EventDetails(BaseModel):
    id: uuid.UUID
    name: str
    start_time: datetime
    end_time: datetime
    guest_invited: int
    guest_checked_in: int
    guestList: list[GuestListItem]

class EventCreateRequest(BaseModel):
    name: str
    start_time: datetime
    end_time: datetime

class EventCounter(BaseModel):
    id: uuid.UUID
    name: str
    start_time: datetime
    end_time: datetime
    guest_entered: int
    guest_left: int

class HomeContent(BaseModel):
    current_event: EventCounter | None
    next_event: EventCounter | None

class CheckInRequest(BaseModel):
    name: str