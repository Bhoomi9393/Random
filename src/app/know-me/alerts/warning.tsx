"use client";

import React, { useEffect, useState } from "react";

type WarningProps = { setStep: React.Dispatch<React.SetStateAction<number>> };

const THREATS = [
  { code: "THR-001", label: "Suspicious activity detected", severity: "HIGH" },
  { code: "THR-002", label: "QR code scanned without supervision", severity: "CRITICAL" },
  { code: "THR-003", label: "Attempt to know about the developer", severity: "HIGH" },
  { code: "THR-004", label: "Entity appears to be... learning things", severity: "EXTREME" },
];

export default function Warning({ setStep }: WarningProps) {
  const [visible, setVisible] = useState<number[]>([]);
  const [blink, setBlink] = useState(true);

  // Stagger threat rows appearing
  useEffect(() => {
    THREATS.forEach((_, i) => {
      setTimeout(() => setVisible((v) => [...v, i]), 300 + i * 220);
    });
  }, []);

  // Blink the alert badge
  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 600);
    return () => clearInterval(id);
  }, []);

  const severityColor: Record<string, string> = {
    HIGH: "#f59e0b",
    CRITICAL: "#ef4444",
    EXTREME: "#ff0000",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
          zIndex: 0,
        }}
      />

      {/* Dialog */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(520px, 100%)",
          background: "#111",
          border: "2px solid #444",
          borderRadius: 4,
          boxShadow: "4px 4px 0 #000, 0 0 60px rgba(200,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: "linear-gradient(90deg, #8b0000, #cc0000)",
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>
            SecurityCore.exe — Threat Detection Module
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 24px 20px" }}>

          {/* Blinking badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 12, height: 12, borderRadius: "50%",
                background: blink ? "#ff0000" : "#600",
                boxShadow: blink ? "0 0 8px #f00" : "none",
                transition: "background 0.1s, box-shadow 0.1s",
                flexShrink: 0,
              }}
            />
            <div style={{ fontSize: 18, fontWeight: 800, color: "#ff3333", letterSpacing: "0.06em" }}>
              ⚠ SECURITY ALERT
            </div>
          </div>

          <p style={{ fontSize: 13, color: "#aaa", marginBottom: 18, lineHeight: 1.6 }}>
            This website has detected a potential threat on the network.
            Immediate action is required to protect system integrity.
          </p>

          {/* Threat log */}
          <div
            style={{
              background: "#0a0a0a",
              border: "1px solid #2a2a2a",
              borderRadius: 3,
              padding: "12px 14px",
              fontFamily: "'Courier New', monospace",
              fontSize: 12,
              marginBottom: 18,
            }}
          >
            {THREATS.map((t, i) => (
              <div
                key={t.code}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  padding: "5px 0",
                  borderTop: i > 0 ? "1px solid #1a1a1a" : "none",
                  opacity: visible.includes(i) ? 1 : 0,
                  transform: visible.includes(i) ? "translateX(0)" : "translateX(-8px)",
                  transition: "opacity 0.3s, transform 0.3s",
                }}
              >
                <span style={{ color: "#555", flexShrink: 0 }}>{t.code}</span>
                <span style={{ color: "#ccc", flex: 1 }}>{t.label}</span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: severityColor[t.severity],
                    letterSpacing: "0.08em",
                    flexShrink: 0,
                  }}
                >
                  {t.severity}
                </span>
              </div>
            ))}
          </div>

          {/* Analysis */}
          <div
            style={{
              background: "rgba(234,179,8,0.07)",
              border: "1px solid rgba(234,179,8,0.25)",
              borderRadius: 3,
              padding: "10px 14px",
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: "#ca8a04", letterSpacing: "0.1em", marginBottom: 4 }}>
              ▸ THREAT ANALYSIS
            </div>
            <p style={{ fontSize: 12, color: "#d4a", lineHeight: 1.6, margin: 0, fontFamily: "'Courier New', monospace" }}>
              The entity is actively <span style={{ color: "#fbbf24", fontWeight: 700 }}>attempting to learn things</span>.
              Behaviour flagged as highly anomalous. Recommend immediate containment via emergency scan.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => setStep(2)}
            style={{
              width: "100%",
              background: "linear-gradient(180deg, #dc2626 0%, #991b1b 100%)",
              color: "#fff",
              border: "none",
              padding: "12px",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: 3,
              cursor: "pointer",
              boxShadow: "0 2px 0 #5a0a0a, 0 0 20px rgba(220,38,38,0.4)",
              transition: "filter 0.15s, transform 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.filter = "brightness(1.15)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.filter = "brightness(1)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
            onMouseDown={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(0.97)")}
            onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.02)")}
          >
             Run Emergency Scan
          </button>
        </div>
      </div>
    </div>
  );
}