import os
import hashlib
from typing import cast, Any
from fastapi import APIRouter, HTTPException, BackgroundTasks # type: ignore
from pydantic import BaseModel # type: ignore
from app.services.transcript_service import extract_transcript # type: ignore
from app.services.ai_service import generate_notes # type: ignore
from app.services.vector_service import retrieve_context # type: ignore

router = APIRouter()

class VideoRequest(BaseModel):
    video_url: str
    user_id: str | None = None

class VideoResponse(BaseModel):
    video_id: str
    title: str
    status: str
    notes: dict | None = None
    transcript: str | None = None

class ChatRequest(BaseModel):
    message: str

# In-memory store for demo (replace with DB in production)
video_store: dict = {}

@router.post("/", response_model=VideoResponse)
async def process_video(request: VideoRequest, background_tasks: BackgroundTasks):
    """
    Main endpoint — extracts transcript and generates AI notes.
    For demo uses mock data; in production connects to YouTube Transcript API + OpenAI.
    """
    url_hash = hashlib.md5(request.video_url.encode()).hexdigest()
    video_id = cast(str, url_hash)[:12]  # type: ignore
    
    # Return immediately with processing status for responsive UX
    video_store[video_id] = {"status": "processing", "url": request.video_url}
    
    # In production: background_tasks.add_task(process_in_background, video_id, request.video_url)
    # For demo, return mock structured response
    mock_notes = _get_mock_notes()
    video_store[video_id] = {"status": "complete", "notes": mock_notes}
    
    response_data = {
        "video_id": video_id,
        "title": "Backend Architecture: A Complete Guide",
        "status": "complete",
        "notes": mock_notes,
    }
    return VideoResponse(**response_data)

@router.post("/{video_id}/chat")
async def chat_with_video(video_id: str, request: ChatRequest):
    """
    Uses RAG (Vector Search) to fetch relevant chunks of the transcript,
    then answers the user's question.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {"reply": "Mock AI Response: Context retrieved via RAG. This is a placeholder since no valid OPENAI_API_KEY was found."}

    # 1. Retrieve relevant context chunks using ChromaDB
    context = await retrieve_context(video_id, request.message)
    
    # If no context found, fallback to graceful message
    if not context:
        context = "No specific context found in the video for this query."

    try:
        from openai import AsyncOpenAI # type: ignore
        client = AsyncOpenAI(api_key=api_key) # type: ignore
        
        system_prompt = f"""You are an expert tutor answering questions based ONLY on the provided video context.
        If the answer is not in the context, politely say that the video doesn't cover it.
        Format your response cleanly using Markdown.
        
        VIDEO CONTEXT SNIPPETS:
        {context}
        """
        
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ]
        )
        
        return {"reply": response.choices[0].message.content}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{video_id}")
async def get_video_status(video_id: str):
    if video_id not in video_store:
        raise HTTPException(status_code=404, detail="Video not found")
    return video_store[video_id]

def _get_mock_notes() -> dict:
    """Returns structured mock notes — replace with real AI output."""
    return {
        "summary": "This comprehensive lecture covers modern backend architecture patterns, exploring REST API design, database optimization, caching strategies, and microservice patterns.",
        "topics": [
            {"title": "REST API Architecture",  "time": "2:14",  "emoji": "🔌", "desc": "Defines client-server communication using HTTP and stateless requests.", "bullets": ["Stateless protocol", "CRUD operations", "JSON responses", "Auth headers"]},
            {"title": "Database Indexing",       "time": "7:20",  "emoji": "🗃️", "desc": "Speeds up query performance via separate index data structures.",      "bullets": ["B-tree structures", "Query optimization", "Write overhead", "Composite indexes"]},
            {"title": "Caching Strategies",      "time": "12:05", "emoji": "⚡", "desc": "Stores frequently-accessed data near the app to reduce DB load.",       "bullets": ["Redis in-memory", "Cache invalidation", "TTL policies", "Cache-aside"]},
            {"title": "Microservices Pattern",   "time": "18:30", "emoji": "🧩", "desc": "Small independently-deployable services with clear boundaries.",        "bullets": ["Service isolation", "API gateway", "Service discovery", "Circuit breaker"]},
        ],
        "flashcards": [
            {"q": "What is idempotency in REST APIs?",  "a": "Making the same request multiple times produces the same result. PUT and DELETE are idempotent; POST is not."},
            {"q": "Explain the CAP theorem",            "a": "Distributed systems guarantee only 2 of: Consistency, Availability, Partition Tolerance."},
        ],
        "quiz": [
            {"q": "Which HTTP method is NOT idempotent?",  "options": ["GET","PUT","DELETE","POST"],          "correct": 3},
            {"q": "Redis is primarily used as a:",         "options": ["Relational DB","In-memory cache","Message queue","Load balancer"], "correct": 1},
        ],
        "key_takeaways": [
            "API separates frontend and business logic cleanly",
            "DB scaling requires proper indexing strategies",
            "Caching can reduce DB load by up to 90%",
        ],
        "knowledge_graph": {
            "nodes": [{"id":"api","label":"API"},{"id":"rest","label":"REST"},{"id":"db","label":"Database"}],
            "edges": [["api","rest"],["api","db"]],
        },
    }
