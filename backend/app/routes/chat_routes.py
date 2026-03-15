from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import answer_question

router = APIRouter()

class ChatRequest(BaseModel):
    video_id: str
    question: str
    transcript: str | None = None

class ChatResponse(BaseModel):
    answer: str
    timestamp_refs: list[str] = []

@router.post("/", response_model=ChatResponse)
async def chat_with_video(request: ChatRequest):
    """
    Answers questions based on video transcript context.
    Uses OpenAI GPT-4o with transcript as context window.
    """
    try:
        answer, refs = await answer_question(
            question=request.question,
            transcript=request.transcript or "",
            video_id=request.video_id,
        )
        return ChatResponse(answer=answer, timestamp_refs=refs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
