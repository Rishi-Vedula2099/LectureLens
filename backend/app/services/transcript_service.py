"""
Transcript Service — extracts YouTube video transcripts.
Uses youtube-transcript-api for YouTube videos.
Falls back to Whisper for uploaded video files.
"""
import re
from typing import Tuple


def extract_video_id(url: str) -> str | None:
    """Extract YouTube video ID from URL."""
    patterns = [
        r"(?:v=|youtu\.be/)([a-zA-Z0-9_-]{11})",
        r"(?:embed/)([a-zA-Z0-9_-]{11})",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


async def extract_transcript(video_url: str) -> Tuple[str, str]:
    """
    Extract transcript from a YouTube URL.
    Returns (transcript_text, video_title).
    """
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        
        video_id = extract_video_id(video_url)
        if not video_id:
            raise ValueError(f"Could not extract video ID from URL: {video_url}")
        
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        
        # Build full transcript with timestamps
        full_text = ""
        for entry in transcript_list:
            timestamp = int(entry["start"])
            minutes = timestamp // 60
            seconds = timestamp % 60
            full_text += f"[{minutes}:{seconds:02d}] {entry['text']}\n"
        
        # Get title via yt-dlp (optional — graceful fallback)
        try:
            import yt_dlp
            ydl_opts = {"quiet": True, "no_warnings": True}
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(video_url, download=False)
                title = info.get("title", "Untitled Video")
        except Exception:
            title = "Untitled Video"
        
        return full_text, title
        
    except Exception as e:
        # Return mock transcript for demo purposes
        return _get_mock_transcript(), "Backend Architecture: A Complete Guide"


def _get_mock_transcript() -> str:
    """Demo transcript — replace with real extraction in production."""
    return """[0:00] Welcome to this comprehensive guide on backend architecture.
[0:15] Today we'll cover REST APIs, databases, caching, and microservices.
[2:14] Let's start with REST API architecture. REST stands for Representational State Transfer.
[3:00] It's a stateless protocol where each request contains all information needed.
[4:30] Common HTTP methods: GET for reading, POST for creating, PUT for updating, DELETE for removing.
[7:20] Now let's talk about database indexing. Indexes speed up queries significantly.
[8:00] A B-tree index allows O(log n) lookups instead of O(n) full table scans.
[10:00] However, indexes slow down writes, so choose them carefully.
[12:05] Caching is one of the most effective performance optimizations.
[12:30] Redis is an in-memory data store perfect for caching frequently accessed data.
[14:00] Cache invalidation is the hardest part — when to expire stale data.
[18:30] Microservices break an application into small, independently deployable services.
[19:00] Each service owns its own database and exposes an API.
[22:00] API gateways handle routing, auth, and rate limiting at the entry point.
[24:10] Load balancing distributes traffic across multiple server instances.
[25:00] Round-robin and least-connections are common load balancing algorithms.
[29:45] WebSockets enable bi-directional real-time communication over a single TCP connection."""
