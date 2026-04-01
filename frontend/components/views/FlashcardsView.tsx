"use client";
import { useState, useEffect } from "react";
import { C, clay, R, FLASHCARDS } from "@/lib/constants";
import { calculateSM2, INITIAL_SM2, SM2Data, SM2_GRADES } from "@/lib/sm2";

export default function FlashcardsView() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sm2Data, setSm2Data] = useState<Record<number, SM2Data>>({});

  // Initialize data on component mount
  useEffect(() => {
    const stored = localStorage.getItem("lecturelens_sm2");
    if (stored) {
      setSm2Data(JSON.parse(stored));
    } else {
      const init: Record<number, SM2Data> = {};
      FLASHCARDS.forEach((_, i) => { init[i] = { ...INITIAL_SM2 }; });
      setSm2Data(init);
    }
  }, []);

  const card = FLASHCARDS[idx];
  const currentData = sm2Data[idx] || INITIAL_SM2;

  const handleGrade = (quality: number) => {
    const newStats = calculateSM2(quality, currentData);
    const updated = { ...sm2Data, [idx]: newStats };
    setSm2Data(updated);
    localStorage.setItem("lecturelens_sm2", JSON.stringify(updated));
    
    setFlipped(false);
    setTimeout(() => {
      // Find next card due for review (or just next card if none due)
      const now = new Date();
      const dueIndices = Object.keys(updated)
        .map(Number)
        .filter(i => new Date(updated[i].nextReviewDate) <= now && i !== idx);
      
      if (dueIndices.length > 0) {
        setIdx(dueIndices[0]);
      } else {
        setIdx((i) => (i + 1) % FLASHCARDS.length);
      }
    }, 250);
  };

  if (Object.keys(sm2Data).length === 0) return null; // Loading

  // Calculate stats
  const now = new Date();
  const dueCount = Object.values(sm2Data).filter(d => new Date(d.nextReviewDate) <= now).length;
  const masteredCount = Object.values(sm2Data).filter(d => d.interval > 21).length;

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      {/* Progress Header */}
      <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 500, overflowX: "auto" }}>
        {FLASHCARDS.map((_, i) => {
          const d = sm2Data[i];
          const isDue = new Date(d.nextReviewDate) <= now;
          let color = C.sd;
          if (d.interval > 21) color = C.primary;      // Mastered
          else if (d.interval > 3) color = C.teal;     // Learning
          else if (d.repetitions > 0 && isDue) color = C.accent; // Due for review
          else color = C.sd;                           // New

          return (
            <div
              key={i}
              style={{
                flex: "1 0 20px", height: 6, borderRadius: 4,
                background: i === idx ? C.text : color,
                transition: "all 0.3s ease",
                boxShadow: i === idx ? clay("sm") : "none",
                cursor: "pointer",
                opacity: i === idx ? 1 : 0.6
              }}
              onClick={() => { setIdx(i); setFlipped(false); }}
              title={`Card ${i+1}: Interval ${d.interval} days`}
            />
          );
        })}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <span className="tag" style={{ color: C.primary, fontSize: 11 }}>🎓 {masteredCount} Mastered</span>
        <span style={{ fontSize: 13, color: C.text, fontWeight: 700 }}>Card {idx + 1} of {FLASHCARDS.length}</span>
        <span className="tag" style={{ color: C.accent, fontSize: 11 }}>⏰ {dueCount} Due Now</span>
      </div>

      {/* Interval display */}
      {currentData.repetitions > 0 && (
        <span style={{ fontSize: 11, color: C.sub }}>
          Current interval: {currentData.interval} days (Easiness: {currentData.easiness.toFixed(2)})
        </span>
      )}

      {/* Card */}
      <div className="flashcard-scene" style={{ width: "100%", maxWidth: 500, height: 280 }} onClick={() => setFlipped(true)}>
        <div className={`flashcard-inner${flipped ? " flipped" : ""}`}>
          {/* Front */}
          <div className="flashcard-face">
            <span style={{ fontSize: 11, fontWeight: 800, color: C.primary, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 24 }}>Question</span>
            <p className="syne" style={{ fontSize: 20, fontWeight: 700, textAlign: "center", lineHeight: 1.45 }}>{card.q}</p>
            <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary, animation: "pulse 1.5s ease infinite" }} />
              <span style={{ fontSize: 12, color: C.light, fontWeight: 600 }}>Tap to reveal answer</span>
            </div>
          </div>
          {/* Back */}
          <div className="flashcard-face flashcard-back" style={{ background: `linear-gradient(135deg, ${C.primary}12, ${C.teal}12)`, border: `1px solid ${C.primary}30` }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: C.teal, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 20 }}>Answer</span>
            <p style={{ fontSize: 15, color: C.text, textAlign: "center", lineHeight: 1.75, fontWeight: 500 }}>{card.a}</p>
          </div>
        </div>
      </div>

      {/* SM-2 Action buttons — only show when flipped */}
      {flipped ? (
        <div style={{ animation: "slideUp 0.3s ease", width: "100%", maxWidth: 500 }}>
          <p style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: C.sub, marginBottom: 12 }}>How well did you know this?</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
            {SM2_GRADES.map((g) => (
              <button
                key={g.val}
                className="clay-btn"
                style={{ 
                  padding: "12px 0", display: "flex", flexDirection: "column", 
                  alignItems: "center", gap: 4, background: C.bg
                }}
                onClick={(e) => { e.stopPropagation(); handleGrade(g.val); }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 4px 15px ${g.color}40`}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = clay("sm")}
              >
                <span style={{ fontSize: 16, fontWeight: 800, color: g.color }}>{g.label}</span>
                <span style={{ fontSize: 9, color: C.sub, textTransform: "uppercase" }}>{g.sub}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ height: 80 }} /> // Spacer to prevent layout shift
      )}
    </div>
  );
}
