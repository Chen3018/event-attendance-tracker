from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
import uuid

class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    email: str
    password_hash: str

    guests: list["Guests"] = Relationship(back_populates="user")

class Event(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    start_time: datetime
    end_time: datetime

    guests: list["Guests"] = Relationship(back_populates="event")

class Guests(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name : str
    checked_in: bool = Field(default=False)
    event_id: uuid.UUID = Field(foreign_key="event.id")
    user_id: uuid.UUID = Field(foreign_key="user.id")

    event: Event = Relationship(back_populates="guests")
    user: User = Relationship(back_populates="guests")