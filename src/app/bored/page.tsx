"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const PLACEHOLDERS = [
  "Tell me tell me...",
  "Genuine curiosity?",
  "Stalking research?",
  "Someone told you to?",
  "You have no idea either?",
];

export default function Bored() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (focused) return;
    const id = setInterval(
      () => setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length),
      2000
    );
    return () => clearInterval(id);
  }, [focused]);

  function handleSubmit() {
    if (!value.trim()) return;
    setSubmitted(true);
    setTimeout(() => router.push("/know-me?from=bored"), 700);
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
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(6,182,212,0.08)",
            border: "1px solid rgba(6,182,212,0.25)",
            borderRadius: 99,
            padding: "4px 14px",
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "#22d3ee",
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
              background: "#22d3ee",
              boxShadow: "0 0 6px #22d3ee",
              display: "inline-block",
            }}
          />
          Interrogation mode
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          style={{
            fontSize: "clamp(28px, 6vw, 42px)",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            marginBottom: 10,
          }}
        >
          Now tell me...
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#94a3b8",
            marginBottom: 6,
          }}
        >
          Why do you want to know about me?
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          style={{
            fontSize: 12,
            color: "#444",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "0.04em",
            marginBottom: 32,
          }}
        >
          Think carefully. This is being recorded.
        </motion.p>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          style={{ position: "relative", marginBottom: 12 }}
        >
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 16,
              fontFamily: "'Courier New', monospace",
              fontSize: 14,
              color: "#06b6d4",
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
            placeholder={PLACEHOLDERS[placeholderIdx]}
            style={{
              width: "100%",
              background: "#111",
              border: `1px solid ${focused ? "#06b6d4" : "#2a2a2a"}`,
              borderRadius: 4,
              padding: "14px 16px 14px 34px",
              color: "#e5e5e5",
              fontSize: 14,
              fontFamily: "'Courier New', monospace",
              resize: "none",
              outline: "none",
              boxShadow: focused
                ? "0 0 0 3px rgba(6,182,212,0.1)"
                : "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
              lineHeight: 1.6,
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 12,
              fontSize: 10,
              color: value.length > 120 ? "#f59e0b" : "#333",
              fontFamily: "'Courier New', monospace",
              transition: "color 0.2s",
            }}
          >
            {value.length}/140
          </div>
        </motion.div>

        {/* Submit button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.5 }}
        >
          <motion.button
            onClick={handleSubmit}
            whileHover={value.trim() ? { scale: 1.03 } : {}}
            whileTap={value.trim() ? { scale: 0.96 } : {}}
            style={{
              width: "100%",
              background: submitted
                ? "#164e63"
                : value.trim()
                ? "linear-gradient(180deg, #0891b2 0%, #0e7490 100%)"
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
                value.trim() && !submitted ? "0 2px 0 #155e75" : "none",
              transition:
                "background 0.2s, color 0.2s, box-shadow 0.2s",
            }}
          >
            {submitted ? "✓ Noted" : "Btao →"}
          </motion.button>

          <p
            style={{
              marginTop: 8,
              fontSize: 10,
              color: "#333",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "0.06em",
            }}
          >
            {value.trim()
              ? "Enter to submit · Shift+Enter for new line"
              : "Type something."}
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          style={{
            marginTop: 48,
            fontSize: 10,
            color: "#2a2a2a",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "0.08em",
          }}
        >
           Interrogation session active · Lies detected automatically
        </motion.p>
      </div>
    </main>
  );
}