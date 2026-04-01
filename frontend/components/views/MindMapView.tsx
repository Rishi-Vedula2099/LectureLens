"use client";
import { useState } from "react";
import { C, clay, R } from "@/lib/constants";

const MM_NODES = [
  { id: "root", x: 300, y: 60, label: "Backend Architecture", color: C.primary, r: 38, parent: null },
  { id: "api", x: 130, y: 180, label: "API Layer", color: C.teal, r: 30, parent: "root" },
  { id: "db", x: 470, y: 180, label: "Database", color: C.gold, r: 30, parent: "root" },
  { id: "cache", x: 300, y: 195, label: "Caching", color: C.accent, r: 28, parent: "root" },
  { id: "rest", x: 50, y: 300, label: "REST", color: C.teal, r: 22, parent: "api" },
  { id: "gql", x: 185, y: 310, label: "GraphQL", color: C.teal, r: 22, parent: "api" },
  { id: "pg", x: 400, y: 310, label: "PostgreSQL", color: C.gold, r: 22, parent: "db" },
  { id: "mongo", x: 530, y: 310, label: "MongoDB", color: C.gold, r: 22, parent: "db" },
  { id: "redis", x: 280, y: 330, label: "Redis", color: C.accent, r: 20, parent: "cache" },
];

type MMNode = typeof MM_NODES[0];

export default function MindMapView() {
  const [expanded, setExpanded] = useState<string[]>(["root"]);

  const toggle = (id: string) =>
    setExpanded((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const isVisible = (n: MMNode) => !n.parent || expanded.includes(n.parent);

  return (
    <div style={{ padding: 20 }}>
      <p style={{ fontSize: 13, color: C.sub, marginBottom: 16, textAlign: "center" }}>
        Click nodes to expand / collapse
      </p>
      <div className="clay-inset" style={{ borderRadius: R.lg, padding: 12, minHeight: 400 }}>
        <svg width="100%" viewBox="0 0 600 390" style={{ overflow: "visible" }}>
          <defs>
            {MM_NODES.map((n) => (
              <radialGradient key={n.id} id={`mm-${n.id}`} cx="30%" cy="30%">
                <stop offset="0%" stopColor="white" stopOpacity="0.7" />
                <stop offset="100%" stopColor={n.color} stopOpacity="0.85" />
              </radialGradient>
            ))}
          </defs>

          {/* Edges */}
          {MM_NODES.filter((n) => n.parent && isVisible(n) && expanded.includes(n.parent)).map((n) => {
            const par = MM_NODES.find((p) => p.id === n.parent)!;
            return (
              <line
                key={`e-${n.id}`}
                x1={par.x} y1={par.y} x2={n.x} y2={n.y}
                stroke={n.color} strokeWidth="2" strokeOpacity="0.4" strokeDasharray="5 3"
              />
            );
          })}

          {/* Nodes */}
          {MM_NODES.filter(isVisible).map((n) => (
            <g key={n.id} className="mind-node" onClick={() => toggle(n.id)}>
              <circle cx={n.x} cy={n.y} r={n.r + 10} fill={n.color} opacity={expanded.includes(n.id) ? 0.12 : 0.04} />
              <circle cx={n.x} cy={n.y} r={n.r} fill={`url(#mm-${n.id})`} />
              <circle cx={n.x} cy={n.y} r={n.r} fill="none" stroke={n.color} strokeWidth="2.5" />
              <text
                x={n.x} y={n.y + 4}
                textAnchor="middle"
                fontSize={n.r > 25 ? "11" : "9"}
                fontFamily="DM Sans" fontWeight="700" fill={C.text}
              >
                {n.label.length > 10 ? n.label.slice(0, 10) + "…" : n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
        {[
          { color: C.primary, label: "Architecture" },
          { color: C.teal, label: "API" },
          { color: C.gold, label: "Database" },
          { color: C.accent, label: "Caching" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color }} />
            <span style={{ fontSize: 12, color: C.sub }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
