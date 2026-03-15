from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import video_routes, notes_routes, chat_routes

app = FastAPI(
    title="LectureLens AI API",
    description="AI-powered video-to-notes backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(video_routes.router, prefix="/process-video", tags=["Video"])
app.include_router(notes_routes.router, prefix="/notes",         tags=["Notes"])
app.include_router(chat_routes.router,  prefix="/chat",          tags=["Chat"])

@app.get("/")
async def root():
    return {"message": "LectureLens AI API is running 🚀"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
