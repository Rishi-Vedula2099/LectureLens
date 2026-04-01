// Design tokens and shared types

export const C = {
  bg: "#e8e9f0",
  surface: "#eceff8",
  primary: "#6C63FF",
  primaryGlow: "rgba(108,99,255,0.35)",
  accent: "#FF6B6B",
  accentGlow: "rgba(255,107,107,0.3)",
  teal: "#43C6AC",
  gold: "#FFB347",
  text: "#22224a",
  sub: "#6b6b8a",
  light: "#9898b5",
  sd: "#c5c6cc",
  sl: "#ffffff",
};

export const clay = (size: "sm" | "md" | "lg" = "md"): string => {
  const s = { sm: "4px 4px 10px", md: "8px 8px 20px", lg: "14px 14px 30px" };
  const n = { sm: "-4px -4px 10px", md: "-8px -8px 20px", lg: "-14px -14px 30px" };
  return `${s[size]} ${C.sd}, ${n[size]} ${C.sl}`;
};

export const clayInset = `inset 4px 4px 10px ${C.sd}, inset -4px -4px 10px ${C.sl}`;

export const R = { sm: "14px", md: "22px", lg: "32px", xl: "40px" };

// Types
export interface Topic {
  id: number;
  title: string;
  time: string;
  color: string;
  emoji: string;
  desc: string;
  bullets: string[];
}

export interface Flashcard {
  q: string;
  a: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
}

export interface ChatMessage {
  role: "ai" | "user";
  msg: string;
}

// Mock Data
export const TOPICS: Topic[] = [
  {
    id: 1, title: "REST API Architecture", time: "2:14", color: C.primary, emoji: "🔌",
    desc: "Defines how client-server communication happens using HTTP methods and stateless requests across endpoints.",
    bullets: ["Stateless protocol", "CRUD operations", "JSON responses", "Authentication headers"],
  },
  {
    id: 2, title: "Database Indexing", time: "7:20", color: C.teal, emoji: "🗃️",
    desc: "Database indexes speed up query performance by creating a separate data structure that allows faster lookup.",
    bullets: ["B-tree structures", "Query optimization", "Write overhead tradeoff", "Composite indexes"],
  },
  {
    id: 3, title: "Caching Strategies", time: "12:05", color: C.accent, emoji: "⚡",
    desc: "Caching stores frequently accessed data closer to the application to reduce latency and database load.",
    bullets: ["Redis in-memory cache", "Cache invalidation", "TTL policies", "Cache-aside pattern"],
  },
  {
    id: 4, title: "Microservices Pattern", time: "18:30", color: C.gold, emoji: "🧩",
    desc: "Architectural style where an application is composed of small, independently deployable services.",
    bullets: ["Service isolation", "API gateway", "Service discovery", "Circuit breaker"],
  },
  {
    id: 5, title: "Load Balancing", time: "24:10", color: "#9b87ff", emoji: "⚖️",
    desc: "Distributes incoming network traffic across multiple servers to ensure no single server bears too much demand.",
    bullets: ["Round-robin", "Least connections", "Health checks", "Sticky sessions"],
  },
  {
    id: 6, title: "WebSocket Protocol", time: "29:45", color: "#FF6B6B", emoji: "🔄",
    desc: "Full-duplex communication protocol over a single TCP connection enabling real-time data exchange.",
    bullets: ["Bi-directional", "Low latency", "Event-driven", "Socket.IO integration"],
  },
];

export const FLASHCARDS: Flashcard[] = [
  {
    q: "What is idempotency in REST APIs?",
    a: "An operation is idempotent if making the same request multiple times produces the same result as making it once. PUT and DELETE are idempotent; POST is not.",
  },
  {
    q: "Explain the CAP theorem",
    a: "A distributed system can only guarantee two of three: Consistency (all nodes see same data), Availability (every request gets response), Partition Tolerance (system continues despite network splits).",
  },
  {
    q: "What is a database transaction?",
    a: "A sequence of operations performed as a single logical unit of work that must be ACID-compliant: Atomic, Consistent, Isolated, and Durable.",
  },
  {
    q: "Describe event-driven architecture",
    a: "A design pattern where components communicate through events. Producers emit events to a bus/queue; consumers subscribe and react. Enables loose coupling and scalability.",
  },
];

export const QUIZ: QuizQuestion[] = [
  { q: "Which HTTP method is NOT idempotent?", options: ["GET", "PUT", "DELETE", "POST"], correct: 3 },
  { q: "Redis is primarily used as a:", options: ["Relational database", "In-memory cache", "Message queue", "Load balancer"], correct: 1 },
  { q: "What does 'stateless' mean in REST?", options: ["No database", "Each request has all needed info", "No authentication", "No caching"], correct: 1 },
];

export const INITIAL_CHAT: ChatMessage[] = [
  { role: "ai", msg: "👋 Hello! I've analyzed the video on **Backend Architecture**. Ask me anything about REST APIs, databases, caching, or any topic covered in the video." },
  { role: "user", msg: "Explain the difference between SQL and NoSQL databases" },
  { role: "ai", msg: "Great question! At **12:45** in the video, the instructor covers this:\n\n**SQL databases** (PostgreSQL) use structured schemas with tables — ideal for complex queries and ACID compliance.\n\n**NoSQL databases** (MongoDB, Redis) sacrifice some consistency for flexibility and horizontal scalability — perfect for unstructured data." },
];
