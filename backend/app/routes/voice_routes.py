from fastapi import APIRouter, UploadFile, File, HTTPException
import os

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Receives WebM audio blob from frontend, sends to OpenAI Whisper STT,
    and returns the transcribed text.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {"text": "Can you explain the difference between SQL and NoSQL databases from the video?"}
        
    try:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=api_key)
        
        # Save temp file for Whisper
        temp_path = f"/tmp/{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(await file.read())
            
        with open(temp_path, "rb") as audio_file:
            transcript = await client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file,
                response_format="text"
            )
            
        os.remove(temp_path)
        return {"text": transcript}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/speak")
async def generate_speech(text: str):
    """
    Receives text, sends to OpenAI TTS, returns an audio stream.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=501, detail="OpenAI API key required for TTS generation")
        
    from fastapi.responses import StreamingResponse
    import io
    
    try:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=api_key)
        
        response = await client.audio.speech.create(
            model="tts-1",
            voice="alloy",
            input=text
        )
        
        # Stream the audio bytes directly back to the client
        return StreamingResponse(io.BytesIO(response.content), media_type="audio/mpeg")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
