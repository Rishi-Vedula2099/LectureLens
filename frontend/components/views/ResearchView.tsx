"use client";

import { useState } from "react";
import { C, clay, R, TOPICS } from "@/lib/constants";

interface ResearchResult {
  concept: string;
  explanation: string;
  sources: { title: string; url: string; domain: string }[];
}

export default function ResearchView() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "searching" | "done">("idle");
  const [result, setResult] = useState<ResearchResult | null>(null);

  const concepts = TOPICS.map(t => t.title);

  const runResearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setStatus("searching");
    
    // Mock API call to backend /research endpoint
    // In production, this calls OpenAI with web browsing tools
    setTimeout(() => {
      setResult({
        concept: searchQuery,
        explanation: `${searchQuery} is a critical component in modern software engineering. It involves understanding the tradeoffs between performance, consistency, and availability. Recent developments in this area focus on distributed consensus, zero-trust architectures, and optimizing for high-throughput concurrent workloads. This pattern is extensively used by companies like Netflix, Uber, and Meta to handle billions of requests per second.`,
        sources: [
          { title: `${searchQuery} - Official Documentation`, url: "#", domain: "docs.example.com" },
          { title: "Understanding tradeoffs in distributed systems", url: "#", domain: "engineering.blog" },
          { title: "Research Paper: A new approach to scale", url: "#", domain: "arxiv.org" }
        ]
      });
      setStatus("done");
    }, 2500);
  };

  return (
    <div style={{ padding: "24px 40px", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ width: 64, height: 64, borderRadius: R.md, background: `${C.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px" }}>🔬</div>
        <h2 className="syne" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Deep Research</h2>
        <p style={{ color: C.sub, fontSize: 16 }}>Go beyond the video. The AI will browse the web to find extensive documentation, whitepapers, and real-world examples.</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What concept do you want to deeply research?"
          className="clay-input"
          style={{ flex: 1, fontSize: 16 }}
          onKeyDown={(e) => e.key === "Enter" && query && runResearch(query)}
        />
        <button 
          className="clay-btn clay-btn-primary" 
          style={{ padding: "0 24px", fontWeight: 700 }}
          onClick={() => query && runResearch(query)}
          disabled={!query || status === "searching"}
        >
          {status === "searching" ? "Searching the web..." : "Research"}
        </button>
      </div>

      {status === "idle" && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>Suggested Concepts from Video</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {concepts.map(c => (
              <button 
                key={c}
                className="clay-btn" 
                style={{ padding: "8px 16px", fontSize: 14, color: C.primary, background: `${C.primary}10`, border: `1px solid ${C.primary}30` }}
                onClick={() => runResearch(c)}
              >
                {c}
              </button>
            ))}
            <button 
                className="clay-btn" 
                style={{ padding: "8px 16px", fontSize: 14, color: C.teal, background: `${C.teal}10`, border: `1px solid ${C.teal}30` }}
                onClick={() => runResearch("B-Tree Indexing Algorithms")}
              >
                B-Tree Indexing Algorithms
              </button>
          </div>
        </div>
      )}

      {status === "searching" && (
        <div className="clay-card" style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${C.sd}`, borderTopColor: C.primary, animation: "spin 1s linear infinite" }} />
          <div style={{ textAlign: "center" }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Compiling Research Report...</h4>
            <p style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>Reading documentation, finding real-world examples, and synthesizing concepts.</p>
          </div>
        </div>
      )}

      {status === "done" && result && (
        <div style={{ animation: "slideUp 0.4s ease" }}>
          <div className="clay-card" style={{ padding: 32, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 24 }}>📖</span>
              <h3 className="syne" style={{ fontSize: 22, fontWeight: 700 }}>AI Synthesis: {result.concept}</h3>
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: C.text }}>{result.explanation}</p>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>Verified Sources</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {result.sources.map((src, i) => (
              <a 
                key={i} 
                href={src.url} 
                className="clay-card" 
                style={{ padding: 20, display: "flex", flexDirection: "column", gap: 8, textDecoration: "none", transition: "transform 0.2s ease" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.sd, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🌐</div>
                  <span style={{ fontSize: 12, color: C.teal, fontWeight: 600 }}>{src.domain}</span>
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.4 }}>{src.title}</h4>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
