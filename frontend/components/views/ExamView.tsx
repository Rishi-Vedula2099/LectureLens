"use client";

import { useState } from "react";
import { C, clay, R } from "@/lib/constants";

type QuestionType = "mcq" | "short" | "fill";

interface ExamQuestion {
  id: string;
  type: QuestionType;
  q: string;
  options?: string[]; // for mcq
}

export default function ExamView() {
  const [status, setStatus] = useState<"idle" | "generating" | "taking" | "grading" | "results">("idle");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any>(null); // graded AI response

  const startExam = async () => {
    setStatus("generating");
    // Mocking the AI generation delay for demo purposes (real app calls backend)
    setTimeout(() => {
      setQuestions([
        { id: "1", type: "mcq", q: "Which HTTP method is typically NOT idempotent?", options: ["GET", "PUT", "DELETE", "POST"] },
        { id: "2", type: "fill", q: "Distributed systems can only guarantee 2 out of 3 properties in the ___ theorem." },
        { id: "3", type: "short", q: "Explain the main difference between an API Gateway and a Load Balancer." }
      ]);
      setStatus("taking");
    }, 2000);
  };

  const submitExam = async () => {
    setStatus("grading");
    // Mocking the AI grading process
    setTimeout(() => {
      setResults({
        score: 85,
        feedback: [
          { id: "1", correct: answers["1"] === "POST", message: answers["1"] === "POST" ? "Correct. POST creates new resources." : "Incorrect. POST is not idempotent." },
          { id: "2", correct: answers["2"]?.toLowerCase().includes("cap"), message: "The CAP theorem (Consistency, Availability, Partition Tolerance)." },
          { id: "3", correct: answers["3"]?.length > 20, message: "Good explanation. API Gateway handles routing/auth, Load Balancer just distributes traffic." }
        ]
      });
      setStatus("results");
    }, 2500);
  };

  if (status === "idle") {
    return (
      <div style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: R.md, background: `${C.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, marginBottom: 24 }}>📄</div>
        <h2 className="syne" style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>AI Practice Exam</h2>
        <p style={{ color: C.sub, maxWidth: 400, lineHeight: 1.6, marginBottom: 32 }}>
          Generate a comprehensive test combining multiple choice, fill-in-the-blank, and short answer questions entirely based on the video context.
        </p>
        <button className="clay-btn clay-btn-primary" style={{ padding: "12px 32px", fontSize: 16 }} onClick={startExam}>
          Generate Exam
        </button>
      </div>
    );
  }

  if (status === "generating" || status === "grading") {
    return (
      <div style={{ padding: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", border: `4px solid ${C.sd}`, borderTopColor: C.primary, animation: "spin 1s linear infinite", marginBottom: 24 }} />
        <h3 className="syne" style={{ fontSize: 20, fontWeight: 700 }}>
          {status === "generating" ? "AI is writing your test..." : "AI is grading your answers..."}
        </h3>
        <p style={{ color: C.sub, marginTop: 8 }}>{status === "generating" ? "Analyzing transcript for key concepts" : "Evaluating short text responses"}</p>
      </div>
    );
  }

  // Common wrapper for taking/results
  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h2 className="syne" style={{ fontSize: 24, fontWeight: 700 }}>Practice Exam</h2>
        {status === "results" && (
          <div className="tag" style={{ background: results.score >= 80 ? `${C.teal}20` : `${C.accent}20`, color: results.score >= 80 ? C.teal : C.accent, fontSize: 16 }}>
            Score: {results.score}%
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {questions.map((q, i) => {
          const feedback = status === "results" ? results.feedback.find((f: any) => f.id === q.id) : null;
          
          return (
            <div key={q.id} className="clay-card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, border: feedback ? `1px solid ${feedback.correct ? C.teal : C.accent}40` : "none" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>{i + 1}.</span>
                <p style={{ fontSize: 16, fontWeight: 600, color: C.text, lineHeight: 1.5 }}>{q.q}</p>
              </div>

              {q.type === "mcq" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 24 }}>
                  {q.options?.map(opt => (
                    <label key={opt} style={{ display: "flex", alignItems: "center", gap: 12, cursor: status === "results" ? "default" : "pointer" }}>
                      <input 
                        type="radio" 
                        name={q.id} 
                        value={opt} 
                        style={{ accentColor: C.primary, width: 16, height: 16 }}
                        checked={answers[q.id] === opt}
                        onChange={(e) => setAnswers(prev => ({...prev, [q.id]: e.target.value}))}
                        disabled={status === "results"}
                      />
                      <span style={{ fontSize: 14, color: C.sub }}>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === "fill" && (
                <div style={{ paddingLeft: 24 }}>
                  <input 
                    type="text" 
                    className="clay-input" 
                    placeholder="Type your answer..."
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers(prev => ({...prev, [q.id]: e.target.value}))}
                    disabled={status === "results"}
                    style={{ width: "100%", maxWidth: 300 }}
                  />
                </div>
              )}

              {q.type === "short" && (
                <div style={{ paddingLeft: 24 }}>
                  <textarea 
                    className="clay-input" 
                    placeholder="Write a brief explanation..."
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers(prev => ({...prev, [q.id]: e.target.value}))}
                    disabled={status === "results"}
                    style={{ width: "100%", minHeight: 100, resize: "vertical" }}
                  />
                </div>
              )}

              {/* Feedback Banner */}
              {status === "results" && feedback && (
                <div style={{ 
                  marginTop: 12, padding: "12px 16px", borderRadius: R.sm, 
                  background: feedback.correct ? `${C.teal}15` : `${C.accent}15`,
                  display: "flex", alignItems: "flex-start", gap: 12
                }}>
                  <span style={{ fontSize: 18 }}>{feedback.correct ? "✅" : "❌"}</span>
                  <p style={{ fontSize: 14, color: C.text, lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 700, color: feedback.correct ? C.teal : C.accent }}>
                      {feedback.correct ? "AI Grader (Correct): " : "AI Grader (Needs Work): "}
                    </span>
                    {feedback.message}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {status === "taking" && (
        <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
          <button 
            className="clay-btn clay-btn-primary" 
            style={{ padding: "12px 32px", fontSize: 16 }}
            onClick={submitExam}
            disabled={Object.keys(answers).length < questions.length}
          >
            Submit for AI Grading
          </button>
        </div>
      )}

      {status === "results" && (
        <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
          <button className="clay-btn" style={{ padding: "12px 32px", fontSize: 16 }} onClick={() => setStatus("idle")}>
            Try another exam
          </button>
        </div>
      )}
    </div>
  );
}
