"use client";
import React, { useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  dx: number;
  dy: number;
  delay: number;
  duration: number;
}

const COLORS = ["#6C63FF", "#FF6B6B", "#43C6AC", "#FFB347", "#9b87ff"];

export default function ParticleBg({ count = 18 }: { count?: number }) {
  const particles: Particle[] = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 4 + Math.random() * 12,
        color: COLORS[i % COLORS.length],
        dx: (Math.random() - 0.5) * 80,
        dy: -(Math.random() * 60 + 20),
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 4,
      })),
    [count]
  );

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              opacity: 0.35,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
