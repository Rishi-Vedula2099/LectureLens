from sqlalchemy import Column, String, DateTime, Text, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

def generate_id():
    return str(uuid.uuid4())[:12]  # type: ignore

class User(Base):
    __tablename__ = "users"
    id         = Column(String, primary_key=True, default=generate_id)
    email      = Column(String, unique=True, nullable=False)
    name       = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Video(Base):
    __tablename__ = "videos"
    id         = Column(String, primary_key=True, default=generate_id)
    user_id    = Column(String, ForeignKey("users.id"), nullable=True)
    video_url  = Column(String, nullable=False)
    title      = Column(String)
    status     = Column(String, default="processing")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Transcript(Base):
    __tablename__ = "transcripts"
    id         = Column(String, primary_key=True, default=generate_id)
    video_id   = Column(String, ForeignKey("videos.id"), nullable=False)
    content    = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notes(Base):
    __tablename__ = "notes"
    id           = Column(String, primary_key=True, default=generate_id)
    video_id     = Column(String, ForeignKey("videos.id"), nullable=False)
    summary      = Column(Text)
    topics       = Column(JSON)
    flashcards   = Column(JSON)
    quiz         = Column(JSON)
    key_takeaways= Column(JSON)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
