from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, func
from sqlalchemy import Integer
from dotenv import load_dotenv
import os
from PIL import Image
import numpy as np
import pytesseract
import cv2

import server.auth as auth
from database.db import engine, init_db
from database.database_models import *
from server.api_models import *

app = FastAPI()

load_dotenv()
FRONTEND_URL = os.getenv("FRONTEND_URL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # or ["*"] for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/signup")
def signup(signup_request: SignUpRequest):
    with Session(engine) as session:
        name = signup_request.name
        email = signup_request.email
        password = signup_request.password

        if session.query(User).filter(User.email == email).first():
            raise HTTPException(status_code=400, detail="Email already registered")

        user = User(name=name, email=email, password_hash=auth.hash_password(password))
        session.add(user)
        session.commit()

        token = auth.create_access_token(data={"sub": user.email})
        return {"access_token": token, "token_type": "bearer"}
    
@app.post("/login")
def login(login_request: LoginRequest):
    with Session(engine) as session:
        user = session.query(User).filter(User.email == login_request.email).first()
        if not user or not auth.verify_password(login_request.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        token = auth.create_access_token(data={"sub": user.email})
        return {"access_token": token, "token_type": "bearer"}
    
def get_current_user(token: str = Depends(auth.oauth2_scheme)):
    try:
        payload = auth.decode_access_token(token)
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    with Session(engine) as session:
        user = session.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    
@app.get("/profile", response_model=UserProfile)
def get_profile(current_user: User = Depends(get_current_user)):
    return UserProfile(name=current_user.name, email=current_user.email)
    
@app.get("/events", response_model=EventList)
def get_events_previews():
    with Session(engine) as session:
        result = session.exec(
            select(
                Event.id,
                Event.name,
                Event.start_time,
                Event.end_time,
                func.count(Guest.id).label("guest_invited"),
                func.sum(func.cast(Guest.checked_in, Integer)).label("guest_checked_in")
            )
            .join(Guest, isouter=True)
            .group_by(Event.id)
        ).all()

        events = [
            EventPreview(
                id=e[0],
                name=e[1],
                start_time=e[2],
                end_time=e[3],
                guest_invited=e[4],
                guest_checked_in=e[5] or 0
            )
            for e in result
        ]

        current_event = None
        future_events = []
        past_events = []
        for event in events:
            if event.start_time <= datetime.now() <= event.end_time:
                current_event = event
            elif event.start_time > datetime.now():
                future_events.append(event)
            else:
                past_events.append(event)
        
        past_events.sort(key=lambda e: e.start_time, reverse=True)
        future_events.sort(key=lambda e: e.start_time)

        return EventList(
            current_event=current_event,
            future_events=future_events,
            past_events=past_events
        )
    
@app.post("/event")
def create_event(event_create_request: EventCreateRequest, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        event = Event(name=event_create_request.name, start_time=event_create_request.start_time, end_time=event_create_request.end_time)
        session.add(event)
        session.commit()
        session.refresh(event)
        return event
    
@app.post("/guest/{event_id}")
def add_guests(event_id: str, names: list[str], current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        event = session.get(Event, event_id)
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        for name in names:
            guest = Guest(name=name, event_id=event_id, user_id=current_user.id)
            session.add(guest)
            session.commit()

        return {"detail": "Guests added successfully"}

@app.get("/event/{event_id}", response_model=EventDetails)
def get_event_details(event_id: str):
    with Session(engine) as session:
        event = session.get(Event, uuid.UUID(event_id))
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        guest_list_items = []
        guests = session.exec(select(Guest).where(Guest.event_id == event.id)).all()
        for guest in guests:
            invited_by_user = session.get(User, guest.user_id)
            guest_list_items.append(
                GuestListItem(
                    id=guest.id,
                    name=guest.name,
                    invitedBy=invited_by_user.name if invited_by_user else "Unknown",
                    checkedIn=guest.checked_in
                )
            )
        
        guest_invited = len(guests)
        guest_checked_in = sum(1 for guest in guests if guest.checked_in)

        return EventDetails(
            id=event.id,
            name=event.name,
            start_time=event.start_time,
            end_time=event.end_time,
            guest_invited=guest_invited,
            guest_checked_in=guest_checked_in,
            guestList=guest_list_items
        )
    
@app.delete("/guest/{guest_id}")
def delete_guest(guest_id: str, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        guest = session.get(Guest, guest_id)
        if not guest:
            raise HTTPException(status_code=404, detail="Guest not found")
        
        if guest.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this guest")
        
        session.delete(guest)
        session.commit()
        return {"detail": "Guest deleted successfully"}
    
@app.get("/home", response_model=HomeContent)
def get_home_content():
    with Session(engine) as session:
        current = session.exec(
            select(
                Event.id,
                Event.name,
                Event.start_time,
                Event.end_time,
                Event.guest_entered,
                Event.guest_left
            )
            .where(
                Event.start_time <= datetime.now(),
                Event.end_time >= datetime.now()
            )
        ).first()

        next = session.exec(
            select(
                Event.id,
                Event.name,
                Event.start_time,
                Event.end_time,
                Event.guest_entered,
                Event.guest_left
            )
            .where(Event.start_time > datetime.now())
            .order_by(Event.start_time)
        ).first()

        current_event = None
        if current:
            current_event = EventCounter(
                id=current[0],
                name=current[1],
                start_time=current[2],
                end_time=current[3],
                guest_entered=current[4],
                guest_left=current[5]
            )
        next_event = None
        if next:
            next_event = EventCounter(
                id=next[0],
                name=next[1],
                start_time=next[2],
                end_time=next[3],
                guest_entered=next[4],
                guest_left=next[5]
            )
        
        return HomeContent(
            current_event=current_event,
            next_event=next_event
        )

@app.delete("/event/{event_id}")
def delete_event(event_id: str, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        event = session.get(Event, event_id)
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        guests = session.exec(select(Guest).where(Guest.event_id == event.id)).all()
        for guest in guests:
            session.delete(guest)

        changes = session.exec(
            select(AttendanceLog).where(AttendanceLog.event_id == event.id)
        ).all()
        for log in changes:
            session.delete(log)
        
        session.delete(event)
        session.commit()
        return {"detail": "Event and associated guests deleted successfully"}
    
@app.post("/checkin/{event_id}")
def check_in_guest(event_id: str, checkin_request: CheckInRequest, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        name = checkin_request.name
        event = session.get(Event, uuid.UUID(event_id))
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        guest = session.exec(
            select(Guest)
            .where(Guest.event_id == event.id, Guest.name == name)
        ).first()
        if not guest:
            raise HTTPException(status_code=404, detail="Guest not found for this event")
        
        if guest.checked_in:
            raise HTTPException(status_code=400, detail="Guest already checked in")
        
        guest.checked_in = True
        event.guest_entered += 1

        log = AttendanceLog(
            event_id=event.id,
            delta=1,
            timestamp=datetime.now()
        )
        session.add(log)

        session.commit()
        return {"detail": f"Guest {name} checked in successfully"}
    
@app.post("/checkin/id/{event_id}")
def check_in_guest_by_id(event_id: str, id_photo: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        event = session.get(Event, uuid.UUID(event_id))
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        image = Image.open(id_photo.file)

        image = np.array(image)
        red_channel = image[:, :, 0]
        _, image = cv2.threshold(red_channel, 160, 255, cv2.THRESH_BINARY)
        text = pytesseract.image_to_string(image)

        lines = text.split("\n")
        name = ""
        if len(lines) > 0:
            name = lines[0].strip()
        
        guest = session.exec(
            select(Guest)
            .where(Guest.event_id == event.id, Guest.name == name)
        ).first()
        if not guest:
            raise HTTPException(status_code=404, detail="Guest not found for this event")
        
        if guest.checked_in:
            raise HTTPException(status_code=400, detail="Guest already checked in")
        
        guest.checked_in = True
        event.guest_entered += 1

        log = AttendanceLog(
            event_id=event.id,
            delta=1,
            timestamp=datetime.now()
        )
        session.add(log)

        session.commit()
        return {"detail": f"Guest {name} checked in successfully"}
        