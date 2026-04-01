"use client";
import { useState } from "react";
import { C, clay, R, TOPICS, Topic } from "@/lib/constants";

function TopicCard({ t, onClick }: { t: Topic; onClick: () => void }) {
  return (
    <div className="topic-card" onClick={onClick} style={{ padding: "22px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: R.sm, background: `${t.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: clay("sm") }}>
          {t.emoji}
        </div>
        <h4 className="syne" style={{ fontSize: 14, fontWeight: 700 }}>{t.title}</h4>
      </div>
      <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.6, marginBottom: 14 }}>{t.desc}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="tag" style={{ fontSize: 11, color: t.color }}>⏱ {t.time}</span>
        <span style={{ fontSize: 12, color: C.primary, fontWeight: 600 }}>Expand →</span>
      </div>
    </div>
  );
}

function TopicModal({ topic, onClose }: { topic: Topic; onClose: () => void }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(34,34,74,0.45)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}
    >
      <div className="clay-card" style={{ width: "min(520px, 95vw)", padding: "36px 32px", animation: "slideUp 0.3s ease" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ width: 52, height: 52, borderRadius: R.md, background: `${topic.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: clay("sm") }}>
            {topic.emoji}
          </div>
          <div>
            <h2 className="syne" style={{ fontSize: 20, fontWeight: 800 }}>{topic.title}</h2>
            <span className="tag" style={{ color: topic.color, fontSize: 11, marginTop: 4 }}>⏱ {topic.time}</span>
          </div>
          <button className="clay-btn" style={{ marginLeft: "auto", padding: "8px 14px", fontSize: 18, color: C.sub }} onClick={onClose}>×</button>
        </div>
        <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.75, marginBottom: 20 }}>{topic.desc}</p>
        <h4 className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Key Points</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {topic.bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: R.sm, background: C.bg, boxShadow: clay("sm") }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: topic.color, flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: C.text }}>{b}</span>
            </div>
          ))}
        </div>
        <button className="clay-btn clay-btn-primary" style={{ width: "100%", marginTop: 24, padding: "13px" }}>
          ⏱ Jump to {topic.time} in Video
        </button>
      </div>
    </div>
  );
}

export default function NotesView() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  return (
    <div style={{ padding: 20 }}>
      {/* Summary */}
      <div className="clay-card" style={{ padding: 24, marginBottom: 24, borderLeft: `4px solid ${C.primary}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>📋</span>
          <h3 className="syne" style={{ fontSize: 16, fontWeight: 700 }}>AI Summary</h3>
        </div>
        <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.75 }}>
          This comprehensive lecture covers modern <strong>backend architecture</strong> patterns, exploring REST API design principles, database optimization strategies including indexing and caching, and microservice communication patterns. The instructor demonstrates real-world implementations using PostgreSQL, Redis, and containerized deployments.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          {["Backend", "APIs", "Databases", "Caching", "Microservices"].map((tag) => (
            <span key={tag} className="tag" style={{ color: C.primary, fontSize: 11 }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="clay-card" style={{ padding: 24, marginBottom: 24, borderLeft: `4px solid ${C.teal}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>🎯</span>
          <h3 className="syne" style={{ fontSize: 16, fontWeight: 700 }}>Key Takeaways</h3>
        </div>
        {["API separates frontend and business logic cleanly", "DB scaling requires proper indexing strategies", "Caching reduces database load by up to 90%", "Microservices enable independent deployment and scaling"].map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
            <span style={{ color: C.teal, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>→</span>
            <span style={{ fontSize: 14, color: C.sub, lineHeight: 1.6 }}>{t}</span>
          </div>
        ))}
      </div>

      {/* Topic Cards */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <h3 className="syne" style={{ fontSize: 16, fontWeight: 700 }}>Topic Breakdown</h3>
        <span className="tag" style={{ color: C.primary, fontSize: 11 }}>{TOPICS.length} topics</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {TOPICS.map((t) => (
          <TopicCard key={t.id} t={t} onClick={() => setSelectedTopic(t)} />
        ))}
      </div>

      {selectedTopic && <TopicModal topic={selectedTopic} onClose={() => setSelectedTopic(null)} />}
    </div>
  );
}
