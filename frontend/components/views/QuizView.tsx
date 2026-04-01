"use client";
import { useState } from "react";
import { C, clay, R, QUIZ } from "@/lib/constants";

export default function QuizView() {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUIZ[qIdx];

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIdx + 1 >= QUIZ.length) setDone(true);
      else { setQIdx((q) => q + 1); setSelected(null); }
    }, 1200);
  };

  const reset = () => { setQIdx(0); setSelected(null); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score / QUIZ.length) * 100);
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <span style={{ fontSize: 64, display: "block", marginBottom: 16 }}>
          {score === QUIZ.length ? "🏆" : score >= QUIZ.length / 2 ? "🎯" : "📚"}
        </span>
        <h3 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Quiz Complete!</h3>
        <p style={{ color: C.sub, marginBottom: 8 }}>
          You scored <strong style={{ color: C.primary }}>{score}/{QUIZ.length}</strong>
        </p>
        {/* Score ring */}
        <div style={{ margin: "24px auto 32px", width: 120, height: 120, borderRadius: "50%", background: `conic-gradient(${C.primary} ${pct * 3.6}deg, ${C.sd} 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: clay("lg") }}>
          <div style={{ width: 90, height: 90, borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="syne" style={{ fontSize: 22, fontWeight: 800, color: C.primary }}>{pct}%</span>
          </div>
        </div>
        <button className="clay-btn clay-btn-primary" style={{ padding: "14px 36px", fontSize: 15 }} onClick={reset}>
          🔄 Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <span style={{ fontSize: 12, color: C.sub, fontWeight: 600 }}>Question {qIdx + 1}/{QUIZ.length}</span>
        <div style={{ flex: 1 }}>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${(qIdx / QUIZ.length) * 100}%` }} />
          </div>
        </div>
        <span className="tag" style={{ color: C.teal, fontSize: 11 }}>Score: {score}</span>
      </div>

      <h3 className="syne" style={{ fontSize: 19, fontWeight: 700, marginBottom: 28, lineHeight: 1.4 }}>{q.q}</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {q.options.map((opt, i) => {
          let className = "quiz-option";
          if (selected !== null) {
            if (i === q.correct) className += " correct";
            else if (selected === i) className += " wrong";
          }
          return (
            <div key={i} className={className} onClick={() => handleAnswer(i)}>
              <span style={{ color: C.primary, fontWeight: 700, marginRight: 10 }}>{String.fromCharCode(65 + i)}.</span>
              {opt}
              {selected !== null && i === q.correct && <span style={{ float: "right" }}>✅</span>}
              {selected === i && i !== q.correct && <span style={{ float: "right" }}>❌</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
