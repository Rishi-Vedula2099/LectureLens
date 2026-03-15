"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import ParticleBg from "@/components/ParticleBg";
import ThemeToggle from "@/components/ThemeToggle";
import { C, clay, R } from "@/lib/constants";

const FEATURES = [
  { icon: "📝", title: "Smart Notes", desc: "AI structures your video into hierarchical, beautifully formatted notes with key insights highlighted automatically." },
  { icon: "🧠", title: "Mind Maps", desc: "Visual concept graphs show relationships between ideas, making complex topics intuitive to understand." },
  { icon: "🃏", title: "Flashcards", desc: "Spaced repetition cards generated from key concepts. Study smarter, retain knowledge longer." },
  { icon: "❓", title: "Auto Quiz", desc: "Test your comprehension with AI-generated quizzes tailored to the video content and difficulty level." },
  { icon: "💬", title: "AI Chat", desc: "Ask any question about the video. The AI answers with timestamp references and contextual explanations." },
  { icon: "🗺️", title: "Knowledge Graph", desc: "Explore interconnected concepts as an interactive graph. Navigate through ideas like a knowledge map." },
];

const STEPS = [
  { n: "01", icon: "🎥", title: "Paste or Upload", desc: "Drop any YouTube, Coursera, or Udemy URL — or upload your own video file." },
  { n: "02", icon: "⚙️", title: "AI Processing", desc: "Our pipeline extracts transcript, segments topics, and generates structured learning materials." },
  { n: "03", icon: "🚀", title: "Learn Smarter", desc: "Explore notes, quiz yourself, chat with the AI, and export to any format you need." },
];

const STEP_COLORS = [C.primary, C.teal, C.accent];

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [hovered, setHovered] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const router = useRouter();

  const handleStart = () => {
    if (url.trim()) {
      sessionStorage.setItem("videoUrl", url.trim());
    }
    router.push("/processing");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, position: "relative", overflow: "hidden" }}>
      <ParticleBg />

      {/* Gradient blobs */}
      <div style={{ position: "absolute", top: -200, left: -100, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.primaryGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 200, right: -150, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 100, left: "30%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(67,198,172,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Navbar */}
      <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: R.md, background: `linear-gradient(135deg, ${C.primary}, #9b87ff)`, boxShadow: clay("sm"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            🔭
          </div>
          <span className="syne" style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>
            <span className="gradient-text">Lecture</span>
            <span style={{ color: C.text }}>Lens</span>
            <span style={{ fontSize: 12, color: C.primary, fontWeight: 700, background: C.primaryGlow, borderRadius: 6, padding: "2px 8px", marginLeft: 6 }}>AI</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {["Features", "Demo", "Pricing"].map((l) => (
            <button key={l} className="clay-btn" style={{ padding: "8px 18px", fontSize: 14, color: C.sub }}>
              {l}
            </button>
          ))}
          <ThemeToggle />
          <button 
            className="clay-btn clay-btn-primary" 
            style={{ padding: "8px 22px", fontSize: 14 }}
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 20px 100px", textAlign: "center" }}>
        <div className="tag" style={{ marginBottom: 24, color: C.primary }}>
          <span>✨</span> AI-Powered Learning Platform
        </div>

        <h1 className="syne" style={{ fontSize: "clamp(40px,6vw,76px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 20, maxWidth: 800 }}>
          Transform Any Video Into{" "}
          <span className="gradient-text">Structured Knowledge</span>
        </h1>

        <p style={{ fontSize: 18, color: C.sub, maxWidth: 560, lineHeight: 1.7, marginBottom: 60 }}>
          Paste a URL, let AI do the heavy lifting. Get structured notes, flashcards, quizzes, mind maps, and an AI tutor — all from a single video.
        </p>

        {/* Hero Card */}
        <div
          className={`float-card${hovered ? " glow-pulse" : ""}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: C.bg,
            boxShadow: hovered ? `${clay("lg")}, 0 0 60px ${C.primaryGlow}` : clay("lg"),
            borderRadius: R.xl,
            padding: "44px 48px",
            width: "min(580px, 92vw)",
            transition: "box-shadow 0.4s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>🎬</span>
            <span className="syne" style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Paste Video URL</span>
          </div>
          <p style={{ fontSize: 13, color: C.light, marginBottom: 28 }}>YouTube · Coursera · Udemy · Loom · Any public video</p>

          <input
            className="clay-input"
            placeholder="🔗  https://youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            style={{ marginBottom: 16, fontSize: 14 }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C.sd})` }} />
            <span style={{ fontSize: 12, color: C.light }}>or drop a video file</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.sd}, transparent)` }} />
          </div>

          <div className="clay-inset" style={{ height: 90, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 24, cursor: "pointer" }}>
            <span style={{ fontSize: 28 }}>📁</span>
            <span style={{ fontSize: 13, color: C.light }}>Drop .mp4 / .mov / .webm here</span>
          </div>

          <button
            className="clay-btn clay-btn-primary"
            style={{ width: "100%", padding: "16px", fontSize: 16 }}
            onClick={handleStart}
          >
            ✨ Generate Learning Notes
          </button>

          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20 }}>
            {["🎓 No signup needed", "⚡ 30s processing", "📤 Free export"].map((t) => (
              <span key={t} style={{ fontSize: 12, color: C.light }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ position: "relative", zIndex: 5, padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="tag" style={{ marginBottom: 16, color: C.teal }}>
            <span>⚙️</span> How It Works
          </div>
          <h2 className="syne" style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 800, letterSpacing: "-1px" }}>
            Three steps to <span className="gradient-text-teal">mastery</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {STEPS.map((s, i) => (
            <div key={i} className="clay-card slide-up" style={{ padding: "36px 28px", animationDelay: `${i * 0.15}s` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span className="syne" style={{ fontSize: 13, fontWeight: 800, color: C.primary, opacity: 0.5 }}>{s.n}</span>
                <div style={{ width: 52, height: 52, borderRadius: R.md, background: `linear-gradient(135deg, ${STEP_COLORS[i]}22, ${STEP_COLORS[i]}44)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: clay("sm") }}>
                  {s.icon}
                </div>
              </div>
              <h3 className="syne" style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: "relative", zIndex: 5, padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="tag" style={{ marginBottom: 16, color: C.accent }}>
            <span>🚀</span> Features
          </div>
          <h2 className="syne" style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 800, letterSpacing: "-1px" }}>
            Everything you need to <span className="gradient-text">learn faster</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="clay-card slide-up"
              onMouseEnter={() => setActiveFeature(i)}
              style={{
                padding: "28px 24px",
                borderTop: activeFeature === i ? `3px solid ${C.primary}` : "3px solid transparent",
                animationDelay: `${i * 0.08}s`,
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: R.md, background: `${C.primary}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16, boxShadow: clay("sm") }}>
                {f.icon}
              </div>
              <h3 className="syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", zIndex: 5, padding: "60px 40px 120px", textAlign: "center" }}>
        <div className="clay-card" style={{ maxWidth: 660, margin: "0 auto", padding: "60px 48px" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 20 }}>🧠</span>
          <h2 className="syne" style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>
            Start learning smarter <span className="gradient-text">today</span>
          </h2>
          <p style={{ color: C.sub, marginBottom: 32, lineHeight: 1.7 }}>
            Join thousands of students turning passive video watching into active, structured learning.
          </p>
          <button className="clay-btn clay-btn-primary" style={{ padding: "16px 40px", fontSize: 16 }} onClick={handleStart}>
            🚀 Try Free — No Signup Required
          </button>
        </div>
      </section>
    </div>
  );
}
