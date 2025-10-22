from typing import Union
from fastapi import FastAPI, HTTPException
from sqlmodel import Session, select, func
from sqlalchemy import Integer

import server.auth as auth
from database.db import engine, init_db
from database.database_models import *
from server.api_models import *

app = FastAPI()

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
def login(email: str, password: str):
    with Session(engine) as session:
        user = session.query(User).filter(User.email == email).first()
        if not user or not auth.verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        token = auth.create_access_token(data={"sub": user.email})
        return {"access_token": token, "token_type": "bearer"}
    
@app.get("/events", response_model=list[EventPreview])
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

        return [
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
    
@app.post("/events")
def create_event(name: str, start_time: str, end_time: str):
    with Session(engine) as session:
        event = Event(name=name, start_time=start_time, end_time=end_time)
        session.add(event)
        session.commit()
        session.refresh(event)
        return event
    
@app.post("/event/{event_id}")
def add_guest(event_id: str, name: str):
    with Session(engine) as session:
        event = session.get(Event, event_id)
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        guest = Guest(name=name, event_id=event_id)
        session.add(guest)
        session.commit()
        session.refresh(guest)
        return guest
