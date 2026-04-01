"use client";

import { useEffect, useState } from "react";
import { C, clay, R } from "@/lib/constants";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      setIsDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    if (next) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  return (
    <button
      onClick={toggle}
      className="clay-btn"
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        background: C.bg,
        boxShadow: clay("sm"),
        color: isDark ? C.gold : C.primary,
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
    >
      <div style={{ transform: isDark ? "rotate(0deg)" : "rotate(-180deg)", transition: "transform 0.4s ease" }}>
        {isDark ? "🌙" : "☀️"}
      </div>
    </button>
  );
}
