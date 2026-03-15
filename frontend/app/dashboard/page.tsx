"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Waveform from "@/components/Waveform";
import NotesView from "@/components/views/NotesView";
import FlashcardsView from "@/components/views/FlashcardsView";
import MindMapView from "@/components/views/MindMapView";
import KnowledgeGraph from "@/components/views/KnowledgeGraph";
import QuizView from "@/components/views/QuizView";
import AIChatView from "@/components/views/AIChatView";
import ThemeToggle from "@/components/ThemeToggle";
import ExportPanel from "@/components/ExportPanel";
import FocusMode from "@/components/FocusMode";
import ExamView from "@/components/views/ExamView";
import ResearchView from "@/components/views/ResearchView";
import { C, clay, R } from "@/lib/constants";

type DashTab = "notes" | "flashcards" | "mindmap" | "graph" | "quiz" | "exam" | "research" | "chat";

const TABS: { id: DashTab; label: string; icon: string }[] = [
  { id: "notes",      label: "Notes",      icon: "📝" },
  { id: "flashcards", label: "Flashcards", icon: "🃏" },
  { id: "mindmap",    label: "Mind Map",   icon: "🧠" },
  { id: "graph",      label: "Graph",      icon: "🗺️" },
  { id: "quiz",       label: "Quiz",       icon: "❓" },
  { id: "exam",       label: "Exam",       icon: "📄" },
  { id: "research",   label: "Research",   icon: "🔬" },
  { id: "chat",       label: "AI Chat",    icon: "💬" },
];

const SIDEBAR_ITEMS = [
  { id: "video",    icon: "🎬", label: "Current Video" },
  { id: "library",  icon: "📚", label: "Library" },
  { id: "history",  icon: "🕐", label: "History" },
  { id: "saved",    icon: "🔖", label: "Saved" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

const TIMELINE_SEGMENTS = [
  { label: "Intro",   pct: 0 },
  { label: "REST API",pct: 15 },
  { label: "Database",pct: 37 },
  { label: "Caching", pct: 55 },
  { label: "Deploy",  pct: 80 },
];
const SEG_COLORS = [C.primary, C.teal, C.gold, C.accent, "#9b87ff"];

const HIGHLIGHTS = [
  { concept: "Stateless REST",      time: "8:42",  color: C.primary },
  { concept: "N+1 Query Problem",   time: "19:15", color: C.accent },
  { concept: "Cache Invalidation",  time: "31:07", color: C.teal },
];

export default function DashboardPage() {
  const [tab,          setTab]          = useState<DashTab>("notes");
  const [sideItem,     setSideItem]     = useState("video");
  const [timelinePos,  setTimelinePos]  = useState(35);
  const [playing,      setPlaying]      = useState(false);
  const [showExport,   setShowExport]   = useState(false);
  const [showFocus,    setShowFocus]    = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
      <ExportPanel isOpen={showExport} onClose={() => setShowExport(false)} videoTitle="Backend Architecture" />
      <FocusMode isOpen={showFocus} onClose={() => setShowFocus(false)} />

      {/* ── Top Nav ─────────────────────────────────────────────── */}
      <header style={{
        display: "flex", alignItems: "center", padding: "14px 20px", gap: 16,
        background: C.bg, boxShadow: `0 4px 20px ${C.sd}55`,
        zIndex: 20, position: "sticky", top: 0,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => router.push("/")}>
          <div style={{ width: 36, height: 36, borderRadius: R.sm, background: `linear-gradient(135deg,${C.primary},#9b87ff)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: clay("sm") }}>🔭</div>
          <span className="syne" style={{ fontSize: 17, fontWeight: 800 }}>
            <span className="gradient-text">Lecture</span>
            <span style={{ color: C.text }}>Lens</span>
          </span>
        </div>

        {/* Video title pill */}
        <div className="clay-inset" style={{ flex: 1, maxWidth: 440, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, borderRadius: R.md }}>
          <span style={{ fontSize: 14 }}>🎥</span>
          <span style={{ fontSize: 13, color: C.sub, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            Backend Architecture: A Complete Guide (1hr 02min)
          </span>
        </div>

        {/* Actions & Profile */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginLeft: "auto" }}>
          <ThemeToggle />
          <button className="clay-btn" style={{ padding: "8px 16px", fontSize: 13, color: C.teal }} onClick={() => setShowExport(true)}>📤 Export</button>
          
          {session?.user ? (
            <div 
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", background: `${C.sd}10`, padding: "4px 12px 4px 4px", borderRadius: 20 }}
              onClick={() => signOut({ callbackUrl: "/" })}
              title="Sign Out"
            >
              <img 
                src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} 
                alt="Avatar" 
                style={{ width: 32, height: 32, borderRadius: "50%" }} 
              />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{session.user.name?.split(" ")[0]}</span>
            </div>
          ) : (
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${C.primary},${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: clay("sm"), cursor: "pointer", color: "white", fontWeight: 700, fontSize: 15 }}>A</div>
          )}
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="dashboard-layout" style={{ display: "flex", flex: 1, height: "calc(100vh - 66px)", overflow: "hidden" }}>

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="sidebar-desktop" style={{ width: 200, padding: "20px 12px", borderRight: `1px solid ${C.sd}40`, display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.light, textTransform: "uppercase", letterSpacing: "1px", padding: "4px 16px", marginBottom: 8 }}>Navigation</p>
          {SIDEBAR_ITEMS.map((s) => (
            <div key={s.id} className={`sidebar-item${sideItem === s.id ? " active" : ""}`} onClick={() => setSideItem(s.id)}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span>{s.label}</span>
            </div>
          ))}
          
          <div 
            className="sidebar-item" 
            style={{ color: C.accent, marginTop: 8, background: `${C.accent}15`, border: `1px solid ${C.accent}40`, boxShadow: clay("sm") }}
            onClick={() => setShowFocus(true)}
          >
            <span style={{ fontSize: 16 }}>🎯</span>
            <span style={{ fontWeight: 700 }}>Focus Mode</span>
          </div>

          <div style={{ flex: 1 }} />
          {/* Progress card */}
          <div className="clay-card" style={{ padding: "16px 14px", marginTop: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.primary, marginBottom: 6 }}>📊 Progress</p>
            <div className="progress-bar-track" style={{ marginBottom: 6 }}>
              <div className="progress-bar-fill" style={{ width: "68%" }} />
            </div>
            <p style={{ fontSize: 11, color: C.sub }}>68% complete</p>
          </div>
        </aside>

        {/* ── Video Panel ─────────────────────────────────────── */}
        <div className="video-panel" style={{ width: 380, borderRight: `1px solid ${C.sd}40`, display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto", padding: 16, gap: 14 }}>

          {/* Video Player Card */}
          <div className="clay-card" style={{ borderRadius: R.lg, overflow: "hidden" }}>
            <div style={{ width: "100%", aspectRatio: "16/9", background: `linear-gradient(135deg, ${C.text}, #3a3a6a, ${C.primary}55)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 40px)" }} />

              {/* Play button */}
              <div
                style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s ease", border: "2px solid rgba(255,255,255,0.3)", fontSize: 24 }}
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? "⏸" : "▶️"}
              </div>

              {/* Bottom controls */}
              <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                <Waveform bars={16} color="rgba(255,255,255,0.7)" height={24} />
                <div style={{ height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 4, overflow: "hidden", cursor: "pointer" }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTimelinePos(Math.round(((e.clientX - rect.left) / rect.width) * 100));
                  }}>
                  <div style={{ height: "100%", width: `${timelinePos}%`, background: "linear-gradient(90deg, white, rgba(255,255,255,0.8))", transition: "width 0.3s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{Math.floor(timelinePos * 0.6227)}:{String(Math.floor((timelinePos * 0.6227 % 1) * 60)).padStart(2,"0")}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>1:02:18</span>
                </div>
              </div>

              {/* AI badge */}
              <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,107,107,0.9)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6, animation: "pulse 2s ease infinite" }}>
                <span style={{ fontSize: 11 }}>⚡</span>
                <span style={{ fontSize: 10, color: "white", fontWeight: 700 }}>Key concept</span>
              </div>
            </div>

            {/* Timeline sections */}
            <div style={{ padding: "10px 14px 12px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.light, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Concept Timeline</p>
              <div style={{ height: 36, display: "flex", gap: 2, borderRadius: R.sm, overflow: "hidden" }}>
                {TIMELINE_SEGMENTS.map((seg, i) => (
                  <div
                    key={i}
                    className="timeline-segment"
                    style={{ background: SEG_COLORS[i] + (i === 1 ? "33" : "18"), color: SEG_COLORS[i] }}
                    onClick={() => setTimelinePos(seg.pct + 5)}
                  >
                    {seg.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Highlights */}
          <div className="clay-card" style={{ padding: "16px 18px" }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>⚡ AI Highlights</p>
            {HIGHLIGHTS.map((h, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: R.sm, cursor: "pointer", transition: "background 0.2s ease", marginBottom: 4 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = `${h.color}15`)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: h.color, boxShadow: `0 0 6px ${h.color}`, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{h.concept}</span>
                <span className="tag" style={{ color: h.color, fontSize: 10 }}>⏱ {h.time}</span>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="clay-btn" style={{ flex: 1, padding: "10px", fontSize: 12 }} onClick={() => setTimelinePos((p) => Math.max(0, p-2))}>⏮ -10s</button>
            <button className="clay-btn clay-btn-primary" style={{ flex: 1, padding: "10px", fontSize: 14 }} onClick={() => setPlaying((p) => !p)}>
              {playing ? "⏸" : "▶️"}
            </button>
            <button className="clay-btn" style={{ flex: 1, padding: "10px", fontSize: 12 }} onClick={() => setTimelinePos((p) => Math.min(100, p+2))}>+10s ⏭</button>
          </div>
        </div>

        {/* ── Notes Panel ─────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Tab Bar */}
          <div style={{ display: "flex", gap: 6, padding: "14px 20px", borderBottom: `1px solid ${C.sd}40`, overflowX: "auto", flexShrink: 0 }}>
            {TABS.map((t) => (
              <button key={t.id} className={`nav-pill${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {tab === "notes"      && <NotesView />}
            {tab === "flashcards" && <FlashcardsView />}
            {tab === "mindmap"    && <MindMapView />}
            {tab === "graph"      && <KnowledgeGraph />}
            {tab === "quiz"       && <QuizView />}
            {tab === "exam"       && <ExamView />}
            {tab === "research"   && <ResearchView />}
            {tab === "chat"       && <AIChatView />}
          </div>
        </div>
      </div>
    </div>
  );
}
