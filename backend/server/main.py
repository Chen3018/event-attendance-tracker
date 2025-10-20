from typing import Union
from fastapi import FastAPI, HTTPException
from sqlmodel import Session
import auth

from ..database.db import engine, init_db
from ..database.models import *

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