"use client";

import { C, clay, R } from "@/lib/constants";
import { exportToMarkdownZip } from "@/lib/export";

interface ExportPanelProps {
  isOpen: boolean;
  onCloseAction: () => void;
  videoTitle: string;
}

export default function ExportPanel({ isOpen, onCloseAction, videoTitle }: ExportPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)", zIndex: 100 }}
        onClick={onCloseAction}
      />
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: "min(400px, 100vw)",
          background: C.bg, boxShadow: "-10px 0 30px rgba(0,0,0,0.1)", zIndex: 101,
          padding: 24, animation: "slideIn 0.3s ease", display: "flex", flexDirection: "column"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <h2 className="syne" style={{ fontSize: 20, fontWeight: 700 }}>Export Notes</h2>
          <button className="clay-btn" style={{ padding: "6px 14px", fontSize: 18, color: C.sub }} onClick={onCloseAction}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Markdown / Obsidian */}
          <div className="clay-card" style={{ padding: 20, cursor: "pointer", transition: "all 0.3s ease" }}
            onClick={() => exportToMarkdownZip(videoTitle, "This comprehensive lecture covers modern backend architecture...")}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: R.sm, background: `${C.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                Ⓜ️
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700 }}>Markdown / Obsidian</h4>
                <p style={{ fontSize: 12, color: C.teal, fontWeight: 600 }}>Instant Download (.zip)</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>Exports a perfectly formatted .md file with all topics, flashcards, Q&A, and image assets.</p>
          </div>

          {/* Notion Sync (Mock for now) */}
          <div className="clay-card" style={{ padding: 20, opacity: 0.6, cursor: "not-allowed" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: R.sm, background: `${C.sub}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                📓
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700 }}>Notion Sync</h4>
                <p style={{ fontSize: 12, color: C.teal, fontWeight: 600 }}>OAuth Required</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>Creates a parent page with sub-pages per topic and a linked flashcard database.</p>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
              <span className="tag" style={{ fontSize: 10 }}>Coming Soon</span>
            </div>
          </div>

          {/* Anki Export (Mock for now) */}
          <div className="clay-card" style={{ padding: 20, opacity: 0.6, cursor: "not-allowed" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: R.sm, background: `${C.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                🧠
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700 }}>Anki Flashcards</h4>
                <p style={{ fontSize: 12, color: C.teal, fontWeight: 600 }}>Download (.apkg)</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>Export all AI-generated flashcards directly into your existing Anki decks.</p>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
              <span className="tag" style={{ fontSize: 10 }}>Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
