"use client";

import { useState, useEffect } from "react";
import { C, clay, R } from "@/lib/constants";

interface FocusModeProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function FocusMode({ isOpen, onCloseAction }: FocusModeProps) {
  const [mins, setMins] = useState(25);
  const [secs, setSecs] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        if (secs === 0) {
          if (mins === 0) {
            // Timer complete
            setIsActive(false);
            if (mode === "focus") {
              setMode("break");
              setMins(5);
            } else {
              setMode("focus");
              setMins(25);
            }
          } else {
            setMins(m => m - 1);
            setSecs(59);
          }
        } else {
          setSecs(s => s - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, mins, secs, mode]);

  if (!isOpen) return null;

  const totalSecs = mode === "focus" ? 25 * 60 : 5 * 60;
  const currentSecs = mins * 60 + secs;
  const pct = 100 - (currentSecs / totalSecs) * 100;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: C.bg, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: 20,
        animation: "slideUp 0.4s ease"
      }}
    >
      <div style={{ position: "absolute", top: 30, right: 30 }}>
        <button className="clay-btn" style={{ padding: "10px 20px", fontSize: 16 }} onClick={onCloseAction}>
          Exit Focus Mode
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <span className="tag" style={{ color: mode === "focus" ? C.primary : C.teal, marginBottom: 16 }}>
          {mode === "focus" ? "🎯 Deep Work" : "☕ Short Break"}
        </span>
        <h1 className="syne" style={{ fontSize: 48, fontWeight: 800 }}>
          {mode === "focus" ? "Stay focused." : "Take a breather."}
        </h1>
      </div>

      {/* Timer Ring */}
      <div
        className="clay-inset"
        style={{
          width: 320, height: 320, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", marginBottom: 60
        }}
      >
        <svg width="300" height="300" style={{ transform: "rotate(-90deg)", position: "absolute" }}>
          <circle
            cx="150" cy="150" r="140" fill="none"
            stroke={mode === "focus" ? C.primary : C.teal}
            strokeWidth="12" strokeLinecap="round"
            strokeDasharray="879" strokeDashoffset={879 - (879 * pct) / 100}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        <div className="clay-card" style={{ width: 240, height: 240, borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span className="syne" style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-2px", color: C.text, lineHeight: 1 }}>
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
          <span style={{ fontSize: 14, color: C.sub, marginTop: 12 }}>
            {mode === "focus" ? "Until Break" : "Until Focus"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 16 }}>
        <button
          className="clay-btn"
          style={{ width: 64, height: 64, borderRadius: "50%", fontSize: 24 }}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? "⏸" : "▶️"}
        </button>
        <button
          className="clay-btn"
          style={{ width: 64, height: 64, borderRadius: "50%", fontSize: 24, color: C.sub }}
          onClick={() => {
            setIsActive(false);
            setMins(mode === "focus" ? 25 : 5);
            setSecs(0);
          }}
        >
          🔄
        </button>
      </div>

      {/* Motivation */}
      <p style={{ marginTop: 60, fontSize: 16, color: C.sub, maxWidth: 400, textAlign: "center", lineHeight: 1.6 }}>
        {mode === "focus"
          ? "Close other tabs. Put your phone away. You are building knowledge."
          : "Stand up, stretch, grab some water. Do not look at screens during your break!"}
      </p>
    </div>
  );
}
