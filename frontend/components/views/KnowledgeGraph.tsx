"use client";
import { useState } from "react";
import { C, clay, R } from "@/lib/constants";

const KG_NODES = [
  { id: "api",     x: 90,  y: 90,  label: "API",     color: C.primary },
  { id: "rest",    x: 220, y: 50,  label: "REST",    color: C.teal },
  { id: "http",    x: 360, y: 90,  label: "HTTP",    color: C.teal },
  { id: "backend", x: 470, y: 170, label: "Backend", color: C.primary },
  { id: "db",      x: 90,  y: 220, label: "Database",color: C.gold },
  { id: "sql",     x: 200, y: 295, label: "SQL",     color: C.gold },
  { id: "index",   x: 340, y: 315, label: "Indexing",color: C.accent },
  { id: "cache",   x: 460, y: 280, label: "Cache",   color: C.accent },
  { id: "auth",    x: 170, y: 180, label: "Auth",    color: "#9b87ff" },
  { id: "jwt",     x: 90,  y: 310, label: "JWT",     color: "#9b87ff" },
];

const KG_EDGES: [string, string][] = [
  ["api", "rest"], ["rest", "http"], ["http", "backend"],
  ["api", "db"], ["db", "sql"], ["sql", "index"],
  ["backend", "cache"], ["api", "auth"], ["auth", "jwt"],
  ["backend", "db"],
];

export default function KnowledgeGraph() {
  const [selected, setSelected] = useState<string | null>(null);

  const connectedIds = selected
    ? KG_EDGES.filter(([a, b]) => a === selected || b === selected).map(([a, b]) => (a === selected ? b : a))
    : [];

  return (
    <div style={{ padding: 20 }}>
      <p style={{ fontSize: 13, color: C.sub, marginBottom: 16, textAlign: "center" }}>
        Click nodes to highlight relationships
      </p>
      <div className="clay-inset" style={{ borderRadius: R.lg, padding: 16, minHeight: 380 }}>
        <svg width="100%" viewBox="0 0 560 370">
          <defs>
            <marker id="kg-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={C.sd} />
            </marker>
          </defs>

          {/* Edges */}
          {KG_EDGES.map(([a, b], i) => {
            const na = KG_NODES.find((n) => n.id === a)!;
            const nb = KG_NODES.find((n) => n.id === b)!;
            const active = selected === a || selected === b;
            return (
              <line key={i}
                x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={active ? C.primary : C.sd}
                strokeWidth={active ? 2.5 : 1.5}
                strokeOpacity={active ? 0.8 : 0.35}
                style={{ transition: "all 0.3s ease" }}
                markerEnd="url(#kg-arrow)"
              />
            );
          })}

          {/* Nodes */}
          {KG_NODES.map((n) => {
            const active = selected === n.id;
            const connected = connectedIds.includes(n.id);
            return (
              <g key={n.id} className="node-graph-node" onClick={() => setSelected(selected === n.id ? null : n.id)}>
                <circle cx={n.x} cy={n.y} r={active ? 32 : connected ? 26 : 22}
                  fill={n.color}
                  opacity={active ? 0.95 : connected ? 0.8 : 0.7}
                  style={{ transition: "all 0.3s ease", filter: active ? `drop-shadow(0 0 14px ${n.color})` : "none" }}
                />
                <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={n.label.length > 6 ? "9" : "11"}
                  fontFamily="DM Sans" fontWeight="700" fill="white">
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selected && (
        <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: R.md, background: `${C.primary}12`, border: `1px solid ${C.primary}30`, animation: "slideIn 0.3s ease" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>
            {KG_NODES.find((n) => n.id === selected)?.label} connects to:{" "}
          </span>
          <span style={{ fontSize: 13, color: C.text }}>
            {connectedIds.map((id) => KG_NODES.find((n) => n.id === id)?.label).join(" · ")}
          </span>
        </div>
      )}
    </div>
  );
}
