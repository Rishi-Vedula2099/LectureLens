"use client";

interface WaveformProps {
  bars?: number;
  color?: string;
  height?: number;
}

export default function Waveform({ bars = 24, color = "#6C63FF", height = 40 }: WaveformProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{
            background: `linear-gradient(to top, ${color}, #43C6AC)`,
            animationDuration: `${0.4 + (i % 5) * 0.12}s`,
            animationDelay: `${(i * 0.05) % 0.5}s`,
            height: `${20 + (i % 7) * 6}px`,
          }}
        />
      ))}
    </div>
  );
}
