"use client";
import { useState, useRef, useEffect } from "react";
import { C, clay, R } from "@/lib/constants";

interface Msg {
  role: "user" | "ai";
  content: string;
  isAudio?: boolean;
}
export default function AIChatView() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", content: "Hi! I'm your LectureLens AI tutor. What would you like to know about this video?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const endRef = useRef<HTMLDivElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
      
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        await handleAudioSubmit(audioBlob);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied", err);
      alert("Please allow microphone access to use Voice Q&A.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioSubmit = async (audioBlob: Blob) => {
    // 1. Show audio pulse message
    setMsgs((m) => [...m, { role: "user", content: "🎙️ Audio Message", isAudio: true }]);
    setLoading(true);

    // 2. Mock STT request (in production: send blob to backend Whisper route)
    setTimeout(() => {
      const transcribedText = "Can you explain the difference between SQL and NoSQL databases from the video?";
      
      // Replace audio pulse with transcribed text
      setMsgs((m) => {
        const newM = [...m];
        newM[newM.length - 1] = { role: "user", content: transcribedText };
        return newM;
      });

      // 3. Mock AI response + TTS
      setTimeout(() => {
        setMsgs((m) => [...m, { 
          role: "ai", 
          content: "In the video, the instructor explains that **SQL** databases use structured schemas and are great for relational data, while **NoSQL** databases are schema-less and optimize for flexible, high-throughput unstructured data [10:45]." 
        }]);
        setLoading(false);
        // (In production: Create a blob URL from the backend TTS response and play it via Audio API)
      }, 1500);
    }, 1500);
  };

  const handleSubmit = (e?: React.FormEvent, overrideTxt?: string) => {
    e?.preventDefault();
    const userMsg = overrideTxt || input.trim();
    if (!userMsg || loading) return;

    setMsgs((m) => [...m, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          content: `Great question about **"${userMsg}"**! Based on the video transcript, this concept is discussed around the 15-minute mark.\n\nThe instructor explains it as a core pattern in modern backend systems, emphasizing both **scalability** and **maintainability** principles. The key insight is that proper abstraction at each layer allows independent evolution of each component.\n\nWould you like me to dig deeper into any specific aspect?`,
        },
      ]);
      setLoading(false);
    }, 1400);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 420 }}>
      {/* Header */}
      <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.sd}40`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${C.primary},#9b87ff)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: clay("sm") }}>
          🧠
        </div>
        <div>
          <p className="syne" style={{ fontSize: 13, fontWeight: 700 }}>AI Tutor</p>
          <p style={{ fontSize: 11, color: C.teal }}>● Active · Transcript loaded</p>
        </div>
        <span className="tag" style={{ marginLeft: "auto", color: C.primary, fontSize: 11 }}>💬 Ask anything</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {msgs.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-end" }}>
              {!isUser && (
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.primary},#9b87ff)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, boxShadow: clay("sm") }}>
                  🧠
                </div>
              )}
              <div
                className={isUser ? "user-bubble" : "ai-bubble"}
              >
                {msg.isAudio ? (
                  <div style={{ display: "flex", gap: 4, alignItems: "center", height: 20 }}>
                    <div style={{ width: 4, height: 12, background: isUser ? "white" : C.primary, animation: "waveform 1s ease infinite" }} />
                    <div style={{ width: 4, height: 20, background: isUser ? "white" : C.primary, animation: "waveform 0.8s ease infinite 0.2s" }} />
                    <div style={{ width: 4, height: 16, background: isUser ? "white" : C.primary, animation: "waveform 1.2s ease infinite 0.4s" }} />
                    <div style={{ width: 4, height: 8, background: isUser ? "white" : C.primary, animation: "waveform 0.9s ease infinite 0.1s" }} />
                  </div>
                ) : (
                  msg.content.split("\n").map((line, i) => {
                    const parts = line.split(/(\[[\w\s:]+\]|\*\*.*?\*\*)/g);
                    return (
                      <p key={i} style={{ minHeight: i === 0 ? "auto" : 20 }}>
                        {parts.map((part, j) => {
                          if (part.startsWith("[") && part.endsWith("]")) {
                            return <span key={j} className="tag" style={{ background: isUser ? "rgba(255,255,255,0.2)" : `${C.accent}20`, color: isUser ? "white" : C.accent, padding: "2px 6px", fontSize: 11, cursor: "pointer", marginLeft: 4 }}>{part.slice(1, -1)}</span>;
                          }
                          if (part.startsWith("**") && part.endsWith("**")) {
                            return <strong key={j} style={{ fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        })}
                      </p>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}

        {/* Loading dots */}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.primary},#9b87ff)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: clay("sm") }}>🧠</div>
            <div className="ai-bubble" style={{ display: "flex", gap: 6, alignItems: "center", padding: "12px 16px" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary, animation: `pulse 1s ease ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: 24, borderTop: `1px solid ${C.sd}`, background: C.bg }}>
        {/* Quick Suggestions */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
          {["Explain caching", "What's a B-Tree?", "Summarize API layer"].map(s => (
            <button key={s} className="clay-btn" style={{ padding: "6px 12px", fontSize: 12, color: C.teal, flexShrink: 0 }} onClick={() => handleSubmit(undefined, s)}>
              {s}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <textarea
              className="clay-input"
              style={{ width: "100%", height: 50, padding: "14px 48px 14px 16px", resize: "none", fontSize: 14 }}
              placeholder={isRecording ? "Listening..." : "Ask a question..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={loading || isRecording}
            />
            {/* Mic Button */}
            <button 
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              style={{
                position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                width: 34, height: 34, borderRadius: "50%", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                background: isRecording ? `${C.accent}20` : "transparent",
                color: isRecording ? C.accent : C.sub,
                transition: "all 0.2s ease"
              }}
            >
              {isRecording ? "⏹" : "🎤"}
            </button>
          </div>
          <button
            type="submit"
            className="clay-btn clay-btn-primary"
            style={{ padding: "0 24px", height: 50, fontWeight: 700 }}
            disabled={(!input.trim() && !isRecording) || loading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
