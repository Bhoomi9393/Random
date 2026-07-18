"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const PLACEHOLDER_CYCLE = [
  "I was just curious...",
  "My friend dared me...",
  "I thought it was a menu...",
  "Boredom, mostly...",
  "I regret nothing.",
];

export default function Arrogant() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Cycle placeholder text
  useEffect(() => {
    if (focused) return;
    const id = setInterval(
      () => setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_CYCLE.length),
      2400
    );
    return () => clearInterval(id);
  }, [focused]);

  function handleSubmit() {
    if (!value.trim()) return;
    setSubmitted(true);
    setTimeout(() => router.push("/submitted-arrogance"), 800);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scanlines */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(480px, 100%)",
          textAlign: "center",
        }}
      >
        {/* Evidence badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(37,99,235,0.08)",
            border: "1px solid rgba(37,99,235,0.3)",
            borderRadius: 99,
            padding: "4px 14px",
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "#60a5fa",
            textTransform: "uppercase",
            marginBottom: 24,
            fontFamily: "'Courier New', monospace",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#60a5fa",
              boxShadow: "0 0 6px #60a5fa",
              display: "inline-block",
            }}
          />
          Collecting evidence
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontSize: "clamp(26px, 6vw, 40px)",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: 10,
            letterSpacing: "-0.02em",
          }}
        >
          Then why did you scan it?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            fontSize: 13,
            color: "#555",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "0.04em",
            marginBottom: 36,
          }}
        >
          Your response will be logged and judged.
        </motion.p>

        {/* Input area */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          style={{ position: "relative" }}
        >
          {/* Terminal prompt */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 16,
              fontFamily: "'Courier New', monospace",
              fontSize: 14,
              color: "#3b82f6",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            &gt;
          </div>

          <textarea
            rows={3}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={PLACEHOLDER_CYCLE[placeholderIdx]}
            style={{
              width: "100%",
              background: "#111",
              border: `1px solid ${focused ? "#3b82f6" : "#2a2a2a"}`,
              borderRadius: 4,
              padding: "14px 16px 14px 34px",
              color: "#e5e5e5",
              fontSize: 14,
              fontFamily: "'Courier New', monospace",
              resize: "none",
              outline: "none",
              boxShadow: focused
                ? "0 0 0 3px rgba(59,130,246,0.12)"
                : "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
              lineHeight: 1.6,
              boxSizing: "border-box",
            }}
          />

          {/* Character counter */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 12,
              fontSize: 10,
              color: value.length > 120 ? "#f59e0b" : "#444",
              fontFamily: "'Courier New', monospace",
              transition: "color 0.2s",
            }}
          >
            {value.length}/140
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.5 }}
          style={{ marginTop: 12 }}
        >
          <motion.button
            onClick={handleSubmit}
            whileHover={value.trim() ? { scale: 1.03 } : {}}
            whileTap={value.trim() ? { scale: 0.96 } : {}}
            style={{
              width: "100%",
              background: submitted
                ? "#166534"
                : value.trim()
                ? "linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)"
                : "#1a1a1a",
              color: value.trim() ? "#fff" : "#444",
              border: `1px solid ${value.trim() ? "transparent" : "#2a2a2a"}`,
              padding: "12px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: 4,
              cursor: value.trim() ? "pointer" : "not-allowed",
              boxShadow:
                value.trim() && !submitted
                  ? "0 2px 0 #1e3a8a"
                  : "none",
              transition:
                "background 0.2s, color 0.2s, box-shadow 0.2s, border-color 0.2s",
            }}
          >
            Submit excuse
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}