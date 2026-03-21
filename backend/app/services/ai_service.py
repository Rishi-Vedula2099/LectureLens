"""
AI Service — handles all OpenAI GPT-4o interactions.
Generates structured notes from transcripts and answers questions.
"""
import os
import json
from typing import Tuple


MASTER_PROMPT = """You are an expert learning assistant. Convert this educational video transcript into structured learning notes.

Output ONLY valid JSON with this exact structure:
{
  "summary": "2-3 sentence overview",
  "topics": [
    {
      "title": "Topic Name",
      "time": "MM:SS",
      "emoji": "emoji",
      "desc": "1-2 sentence description",
      "bullets": ["point 1", "point 2", "point 3", "point 4"]
    }
  ],
  "key_takeaways": ["takeaway 1", "takeaway 2", "takeaway 3"],
  "flashcards": [
    {"q": "Question?", "a": "Answer"}
  ],
  "quiz": [
    {"q": "Question?", "options": ["A","B","C","D"], "correct": 0}
  ],
  "knowledge_graph": {
    "nodes": [{"id": "concept", "label": "Concept"}],
    "edges": [["concept1", "concept2"]]
  }
}

Transcript:
"""


async def generate_notes(transcript: str) -> dict:
    """
    Send transcript to OpenAI GPT-4o and get structured notes back.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        # Return mock for demo
        return _mock_notes()
    
    try:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=api_key)
        
        # Chunk transcript if too long
        max_chars = 12000
        if len(transcript) > max_chars:
            transcript = transcript[0:max_chars] + "\n[transcript truncated]"
        
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert educator. Always respond with valid JSON only.",
                },
                {
                    "role": "user",
                    "content": MASTER_PROMPT + transcript,
                },
            ],
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
        
    except Exception as e:
        print(f"OpenAI error: {e}")
        return _mock_notes()


async def answer_question(question: str, transcript: str, video_id: str) -> Tuple[str, list[str]]:
    """
    Answer a user question using transcript as context.
    Returns (answer_text, list_of_timestamp_references).
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return (
            f"Based on the video content, {question.lower()} is an important concept. "
            "The instructor explains this as a core pattern in modern systems. "
            "Would you like me to elaborate on any specific aspect?",
            ["~15:00"]
        )
    
    try:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=api_key)
        
        system_prompt = (
            "You are an AI tutor answering questions about a video lecture. "
            "Use the transcript to give accurate, concise answers. "
            "Reference timestamps where relevant using [MM:SS] format. "
            "Keep answers under 150 words."
        )
        
        user_prompt = f"Transcript:\n{transcript[0:8000]}\n\nQuestion: {question}"
        
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.4,
        )
        
        answer = response.choices[0].message.content
        
        # Extract timestamp refs from answer
        import re
        refs = re.findall(r"\[\d+:\d+\]", answer)
        
        return answer, refs
        
    except Exception as e:
        return f"Error: {str(e)}", []


def _mock_notes() -> dict:
    return {
        "summary": "Comprehensive lecture on backend architecture covering REST APIs, database optimization, caching strategies, and microservice patterns.",
        "topics": [
            {"title": "REST API Architecture", "time": "2:14", "emoji": "🔌", "desc": "Client-server communication via HTTP and stateless requests.", "bullets": ["Stateless protocol", "CRUD operations", "JSON responses", "Auth headers"]},
            {"title": "Database Indexing", "time": "7:20", "emoji": "🗃️", "desc": "Improve query performance through structured index data.", "bullets": ["B-tree structures", "Query optimization", "Write overhead", "Composite indexes"]},
            {"title": "Caching Strategies", "time": "12:05", "emoji": "⚡", "desc": "Store frequently-accessed data in memory to reduce DB load.", "bullets": ["Redis in-memory", "Cache invalidation", "TTL policies", "Cache-aside pattern"]},
            {"title": "Microservices", "time": "18:30", "emoji": "🧩", "desc": "Independently deployable services with clear boundaries.", "bullets": ["Service isolation", "API gateway", "Service discovery", "Circuit breaker"]},
        ],
        "key_takeaways": ["API separates frontend and business logic cleanly", "DB scaling requires proper indexing", "Caching reduces DB load by up to 90%"],
        "flashcards": [
            {"q": "What is idempotency in REST?", "a": "Same request multiple times = same result. PUT/DELETE are idempotent; POST is not."},
            {"q": "Explain CAP theorem", "a": "Can only guarantee 2 of 3: Consistency, Availability, Partition Tolerance."},
        ],
        "quiz": [
            {"q": "Which HTTP method is NOT idempotent?", "options": ["GET","PUT","DELETE","POST"], "correct": 3},
            {"q": "Redis is primarily used as a:", "options": ["Relational DB","In-memory cache","Message queue","Load balancer"], "correct": 1},
        ],
        "knowledge_graph": {
            "nodes": [{"id":"api","label":"API"},{"id":"rest","label":"REST"},{"id":"db","label":"Database"},{"id":"cache","label":"Cache"}],
            "edges": [["api","rest"],["api","db"],["db","cache"]],
        },
    }
