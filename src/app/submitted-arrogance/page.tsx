"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Submitted() {

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
          }}>
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

        {/* Result card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={ { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: "#111",
            border: "2px solid #2a2a2a",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(0,255,136,0.06)",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              background: "linear-gradient(90deg, #052e16, #14532d)",
              padding: "6px 10px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
          </div>

          <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
            {/* Check icon */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "rgba(0,255,136,0.08)",
                border: "2px solid rgba(0,255,136,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                margin: "0 auto 16px",
              }}
            >
              ✓
            </div>

            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
              Excuse submitted.
            </div>

            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, marginBottom: 20 }}>
              You always have the choice to <em>not</em> scan every QR you see.😇
            </p>

            {/* The punchline */}
            <div
              style={{
                background: "#0a0a0a",
                border: "1px solid #1f2937",
                borderRadius: 3,
                padding: "10px 16px",
                fontFamily: "'Courier New', monospace",
                fontSize: 12,
                color: "#ef4444",
                letterSpacing: "0.04em",
              }}
            >
              <span style={{ color: "#555" }}>[RESULT]</span>{" "}
              Your explanation has been ignored. 🤪
            </div>

            
          </div>
        </motion.div>


      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </main>
  );
}