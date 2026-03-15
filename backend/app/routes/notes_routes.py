from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class NotesResponse(BaseModel):
    video_id: str
    summary: str
    topics: list[dict]
    flashcards: list[dict]
    quiz: list[dict]
    key_takeaways: list[str]

@router.get("/{video_id}", response_model=NotesResponse)
async def get_notes(video_id: str):
    """Fetch stored structured notes for a processed video."""
    # In production: fetch from PostgreSQL DB
    # For demo: return mock notes
    raise HTTPException(status_code=404, detail="Use /process-video endpoint first")
