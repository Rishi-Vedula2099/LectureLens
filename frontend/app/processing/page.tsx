"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ParticleBg from "@/components/ParticleBg";
import Waveform from "@/components/Waveform";
import { C, clay, R } from "@/lib/constants";

const STEPS = [
  { label: "Fetching video metadata", icon: "🔍", color: C.primary, duration: 1200 },
  { label: "Extracting transcript", icon: "📄", color: C.teal, duration: 1800 },
  { label: "Segmenting topics", icon: "🧩", color: C.gold, duration: 1500 },
  { label: "Generating notes & cards", icon: "✍️", color: C.accent, duration: 2000 },
  { label: "Building knowledge graph", icon: "🗺️", color: "#9b87ff", duration: 1000 },
];

const NODES = [
  { cx: 300, cy: 120, r: 32, label: "Video", color: C.primary },
  { cx: 150, cy: 240, r: 26, label: "Transcript", color: C.teal },
  { cx: 300, cy: 260, r: 26, label: "Chunks", color: C.gold },
  { cx: 450, cy: 240, r: 26, label: "Embeddings", color: "#9b87ff" },
  { cx: 150, cy: 370, r: 22, label: "Notes", color: C.accent },
  { cx: 300, cy: 380, r: 22, label: "Flashcards", color: C.teal },
  { cx: 450, cy: 370, r: 22, label: "Quiz", color: C.gold },
  { cx: 300, cy: 470, r: 28, label: "Dashboard", color: C.primary },
];
const EDGES: [number, number][] = [[0,1],[0,2],[0,3],[1,4],[2,5],[3,6],[4,7],[5,7],[6,7]];

export default function ProcessingPage() {
  const [progress, setProgress] = useState([0, 0, 0, 0, 0]);
  const [activeStep, setActiveStep] = useState(0);
  const [done, setDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let step = 0;
    const runStep = () => {
      if (step >= STEPS.length) {
        setTimeout(() => setDone(true), 500);
        return;
      }
      setActiveStep(step);
      const start = Date.now();
      const dur = STEPS[step].duration;
      const tick = setInterval(() => {
        const p = Math.min(100, ((Date.now() - start) / dur) * 100);
        setProgress((prev) => { const n = [...prev]; n[step] = p; return n; });
        if (p >= 100) { clearInterval(tick); step++; setTimeout(runStep, 200); }
      }, 30);
    };
    runStep();
  }, []);

  useEffect(() => {
    if (done) setTimeout(() => router.push("/dashboard"), 1200);
  }, [done, router]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <ParticleBg />
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C.primaryGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 5, display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: 960 }}>
        {/* Pipeline Steps */}
        <div className="clay-card" style={{ padding: "44px 40px", flex: "1 1 380px", maxWidth: 420 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: R.md, background: `linear-gradient(135deg,${C.primary},#9b87ff)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: clay("sm") }}>
              🧠
            </div>
            <div>
              <h2 className="syne" style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>AI Processing</h2>
              <p style={{ fontSize: 13, color: C.sub }}>Analyzing your video…</p>
            </div>
          </div>

          <div style={{ margin: "28px 0" }}>
            <Waveform bars={28} color={C.primary} height={40} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ opacity: i > activeStep ? 0.4 : 1, transition: "opacity 0.4s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: i === activeStep ? s.color : C.text }}>
                    {s.label}
                  </span>
                  {i < activeStep && <span style={{ marginLeft: "auto", fontSize: 14, color: C.teal }}>✓</span>}
                  {i === activeStep && <span style={{ marginLeft: "auto", fontSize: 11, color: C.sub }}>{Math.round(progress[i])}%</span>}
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${progress[i]}%`, background: `linear-gradient(90deg, ${s.color}, ${C.teal})` }} />
                </div>
              </div>
            ))}
          </div>

          {done && (
            <div style={{ marginTop: 28, padding: "16px 20px", borderRadius: R.md, background: `linear-gradient(135deg,${C.teal}22,${C.teal}44)`, border: `1px solid ${C.teal}55`, display: "flex", alignItems: "center", gap: 12, animation: "slideUp 0.4s ease" }}>
              <span style={{ fontSize: 22 }}>🎉</span>
              <div>
                <p style={{ fontWeight: 700, color: C.teal, fontSize: 14 }}>Processing Complete!</p>
                <p style={{ fontSize: 12, color: C.sub }}>Opening your dashboard…</p>
              </div>
            </div>
          )}
        </div>

        {/* Neural Network Viz */}
        <div className="clay-card" style={{ padding: "36px 28px", flex: "1 1 440px", maxWidth: 500 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 16, textAlign: "center" }}>AI Pipeline Visualization</p>
          <svg width="100%" viewBox="0 0 600 540" style={{ overflow: "visible" }}>
            <defs>
              {NODES.map((n, i) => (
                <radialGradient key={i} id={`ng${i}`} cx="35%" cy="35%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                  <stop offset="100%" stopColor={n.color} stopOpacity="0.9" />
                </radialGradient>
              ))}
            </defs>
            {EDGES.map(([a, b], i) => {
              const na = NODES[a], nb = NODES[b];
              const aIdx = Math.min(a, b);
              return (
                <line key={i} x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
                  stroke={aIdx <= activeStep ? NODES[a].color : C.sd}
                  strokeWidth="2"
                  strokeOpacity={aIdx <= activeStep ? 0.5 : 0.2}
                  strokeDasharray={aIdx <= activeStep ? undefined : "4 4"}
                  style={{ transition: "all 0.6s ease" }}
                />
              );
            })}
            {NODES.map((n, i) => (
              <g key={i} style={{ opacity: i <= activeStep + 1 ? 1 : 0.3, transition: "opacity 0.5s ease" }}>
                <circle cx={n.cx} cy={n.cy} r={n.r + 8} fill={n.color} opacity={i === activeStep ? 0.15 : 0.05} />
                <circle cx={n.cx} cy={n.cy} r={n.r} fill={`url(#ng${i})`} />
                <circle cx={n.cx} cy={n.cy} r={n.r} fill="none" stroke={n.color} strokeWidth="2" opacity={i <= activeStep ? 0.8 : 0.2} />
                <text x={n.cx} y={n.cy + 4} textAnchor="middle" fontSize="11" fontFamily="DM Sans" fontWeight="600" fill={i <= activeStep ? C.text : C.light}>
                  {n.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
