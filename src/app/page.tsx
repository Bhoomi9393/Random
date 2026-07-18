"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [glitch, setGlitch] = useState(false);

  // Random glitch bursts on the heading
  useEffect(() => {
    const burst = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    };
    const schedule = () => {
      const id = setTimeout(() => { burst(); schedule(); }, 2500 + Math.random() * 3000);
      return id;
    };
    const id = schedule();
    return () => clearTimeout(id);
  }, []);

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

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 480 }}>

        {/* Main heading with glitch */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontSize: "clamp(48px, 10vw, 80px)",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1,
            marginBottom: 0,
            letterSpacing: "-0.02em",
            position: "relative",
            display: "inline-block",
            filter: glitch ? "hue-rotate(90deg) saturate(3)" : "none",
            transform: glitch ? `translate(${Math.random() > 0.5 ? 2 : -2}px, 0)` : "none",
            transition: "filter 0.05s, transform 0.05s",
          }}
        >
          WTF!!!
          {/* Glitch layers */}
          {glitch && (
            <>
              <span style={{ position: "absolute", inset: 0, color: "#f00", clipPath: "inset(30% 0 50% 0)", transform: "translateX(3px)", opacity: 0.7 }}>WTF!!!</span>
              <span style={{ position: "absolute", inset: 0, color: "#0ff", clipPath: "inset(60% 0 20% 0)", transform: "translateX(-3px)", opacity: 0.7 }}>WTF!!!</span>
            </>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            marginTop: 20,
            fontSize: 20,
            fontWeight: 700,
            color: "#e5e5e5",
            lineHeight: 1.4,
          }}
        >
          You actually scanned the QR.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          style={{
            marginTop: 10,
            fontSize: 14,
            color: "#666",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "0.04em",
          }}
        >
          Want to know Who am I??
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          style={{ marginTop: 40, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link href="/bored" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "transparent",
                color: "#aaa",
                border: "1px solid #333",
                padding: "11px 22px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 4,
                cursor: "pointer",
                letterSpacing: "0.03em",
                transition: "border-color 0.2s, color 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#555";
                (e.currentTarget as HTMLElement).style.color = "#fff";
                (e.currentTarget as HTMLElement).style.transform = "scale(1.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#333";
                (e.currentTarget as HTMLElement).style.color = "#aaa";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              No, just bored 🫠
            </button>
          </Link>

          <Link href="/not-interested" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "transparent",
                color: "#aaa",
                border: "1px solid #333",
                padding: "11px 22px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 4,
                cursor: "pointer",
                letterSpacing: "0.03em",
                transition: "border-color 0.2s, color 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#555";
                (e.currentTarget as HTMLElement).style.color = "#fff";
                (e.currentTarget as HTMLElement).style.transform = "scale(1.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#333";
                (e.currentTarget as HTMLElement).style.color = "#aaa";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              Not interested 🤪
            </button>
          </Link>
        </motion.div>

      </div>
    </main>
  );
}