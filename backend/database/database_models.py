from sqlmodel import SQLModel, Field, Relationship, Column
from datetime import datetime, timezone
import uuid
from sqlalchemy import DateTime

class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    email: str
    password_hash: str

    guests: list["Guest"] = Relationship(back_populates="user")

class Event(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    start_time: datetime = Field(sa_column=Column(DateTime(timezone=True)))
    end_time: datetime = Field(sa_column=Column(DateTime(timezone=True)))
    guest_entered: int = Field(default=0)
    guest_left: int = Field(default=0)

    guests: list["Guest"] = Relationship(back_populates="event")

class Guest(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name : str
    checked_in: bool = Field(default=False)
    event_id: uuid.UUID = Field(foreign_key="event.id")
    user_id: uuid.UUID = Field(foreign_key="user.id")
    check_in_time: datetime | None = Field(default=None, sa_column=Column(DateTime(timezone=True)))

    event: Event = Relationship(back_populates="guests")
    user: User = Relationship(back_populates="guests")

class AttendanceLog(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    event_id: uuid.UUID = Field(foreign_key="event.id")
    delta: int
    timestamp: datetime = Field(default_factory=datetime.now(timezone.utc), sa_column=Column(DateTime(timezone=True)))