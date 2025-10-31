from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, func
from sqlalchemy import Integer
from dotenv import load_dotenv
import os

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
def signup(name: str, email: str, password: str):
    with Session(engine) as session:
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
        payload = auth.decode_access_token(token.credentials)
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
        
        return EventList(
            current_event=current_event,
            future_events=future_events,
            past_events=past_events
        )
    
@app.post("/event")
def create_event(name: str, start_time: str, end_time: str, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        event = Event(name=name, start_time=start_time, end_time=end_time)
        session.add(event)
        session.commit()
        session.refresh(event)
        return event
    
@app.post("/guest/{event_id}")
def add_guest(event_id: str, name: str, current_user: User = Depends(get_current_user)):
    with Session(engine) as session:
        event = session.get(Event, event_id)
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        guest = Guest(name=name, event_id=event_id, user_id=current_user.id)
        session.add(guest)
        session.commit()
        session.refresh(guest)
        return guest
