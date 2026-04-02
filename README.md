# 🔭 LectureLens AI

**Transform Any Video into Structured Knowledge.**

LectureLens is a state-of-the-art AI learning platform that converts passive video watching into an active, immersive, and structured learning experience. Driven by a sophisticated "Claymorphism" design language, it bridges the gap between raw information and deep mastery.

---

## 🚀 Key Features

### 🖋️ Smart Learning Suite
- **Hierarchical Notes**: AI-generated structured notes that segment videos into logical topics with key bullets and summaries.
- **Interactive Mind Maps**: Visual SVG concept trees that allow you to collapse and expand relationships between ideas.
- **Concept Knowledge Graphs**: Navigate through interconnected ideas via a directed force-graph visualization.

### 🧠 Active Recall & Mastery
- **SM-2 Flashcards**: A fully implemented SuperMemo-2 Spaced Repetition system that calculates optimal review intervals using a 0-5 quality scale.
- **AI-Generated Practice Exams**: Dynamic tests encompassing Multiple Choice, Fill-in-the-Blanks, and Short Answers, graded instantly with AI feedback.
- **Auto-Quizzes**: Instant comprehension checks available after every video processing session.

### 💬 Intelligent Interaction
- **AI Tutor (RAG)**: Chat with your lecture using Retrieval-Augmented Generation. The AI "reads" the transcript using ChromaDB to answer with timestamped precision.
- **Voice Q&A**: Hands-free learning with built-in Speech-to-Text (Whisper) and Text-to-Speech interaction.
- **Deep Research Mode**: One-click deep dives that synthesize external documentation, papers, and sources for concepts mentioned in the video.

### 📤 Study Everywhere
- **Export Suite**: Export your entire study guide as a structured Markdown/Obsidian ZIP archive.
- **Focus Mode**: A dedicated fullscreen Pomodoro study timer (25/5 cycles) with immersive animated ring visuals and a "Break Buddy" AI.

---

## 🎨 Design Philosophy: "Midnight Glass" Claymorphism

LectureLens isn't just a tool; it's a sensory experience.
- **Fluid UI**: Rich gradients, glassmorphism, and soft-shadow "clay" elements.
- **Micro-interactions**: Particle backgrounds, pipeline processing animations, and 3D card flips.
- **Adaptive Themes**: Seamless transition between "Light Clay" and the "Midnight Glass" dark mode.

---

## 🛠️ Technical Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Vanilla CSS with Design Tokens + Tailwind Utilities
- **Animation**: Framer Motion + Web Animations API
- **Persistence**: LocalStorage (SM-2 Data) + SessionStorage (Session State)
- **Auth**: Auth.js v5 (Google & GitHub OAuth)

### Backend
- **Core**: FastAPI (Python 3.10+)
- **AI Orchestration**: OpenAI (GPT-4o, Whisper-1, TTS-1)
- **Vector Database**: ChromaDB (Transcripts/RAG)
- **Transcript Extraction**: `youtube-transcript-api` + `yt-dlp`

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- OpenAI API Key

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Rishi-Vedula2099/LectureLens.git
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

---

## 🗺️ Roadmap
- [ ] **Multi-Video Playlists**: Merge entire courses into a single Knowledge Wiki.
- [ ] **Interactive Video HUD**: Floating AI insights appearing directly on the video player.
- [ ] **Anki Export**: Direct `.apkg` file generation.
- [ ] **Shared Notebooks**: Public read-only URLs for sharing your study guides.

---


