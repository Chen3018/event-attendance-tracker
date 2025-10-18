from sqlmodel import SQLModel, create_engine
from dotenv import load_dotenv
import os

from models import *

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def init_db():
    SQLModel.metadata.create_all(engine)