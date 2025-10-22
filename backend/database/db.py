from sqlmodel import SQLModel, create_engine
from dotenv import load_dotenv
import os
from pathlib import Path

from database.database_models import *


load_dotenv(override=True)
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def init_db():
    SQLModel.metadata.create_all(engine)