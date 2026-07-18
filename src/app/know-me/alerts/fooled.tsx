"use client";

import React, { useState, useRef } from "react";

type FooledProps = { setStep: React.Dispatch<React.SetStateAction<number>> };

export default function Fooled({ setStep }: FooledProps) {
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const attempts = useRef(0);

  function evadeNo(e: React.MouseEvent) {
    attempts.current += 1;
    const btn = noRef.current;
    if (!btn) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bw = btn.offsetWidth;
    const bh = btn.offsetHeight;
    const mx = e.clientX;
    const my = e.clientY;

    // Pick a random spot far from the cursor
    let nx: number, ny: number;
    let tries = 0;
    do {
      nx = Math.random() * (vw - bw - 32) + 16;
      ny = Math.random() * (vh - bh - 32) + 16;
      tries++;
    } while (Math.hypot(nx - mx, ny - my) < 200 && tries < 20);

    setNoPos({ x: nx, y: ny });
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0d0d0d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Scanline overlay for atmosphere */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 2px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Dialog box */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(480px, calc(100vw - 32px))",
          background: "#1a1a1a",
          border: "2px solid #444",
          borderRadius: 4,
          boxShadow: "4px 4px 0 #000, 0 0 40px rgba(200,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: "linear-gradient(90deg, #a00 0%, #cc0000 100%)",
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            userSelect: "none",
          }}
        >
          {/* Icon */}
          <span style={{ fontSize: 14 }}></span>
          <span
            style={{
              flex: 1,
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.04em",
            }}
          >
            SYSTEM ALERT — SecurityCore.exe
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 24px 20px" }}>
          {/* Warning badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#ff0",
              color: "#000",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.12em",
              padding: "2px 8px",
              marginBottom: 14,
              borderRadius: 2,
            }}
          >
             CRITICAL THREAT DETECTED
          </div>

          {/* Main error text */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#ff4444",
              marginBottom: 4,
              lineHeight: 1.2,
            }}
          >
            VIRUS IDENTIFIED
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#888",
              letterSpacing: "0.06em",
              marginBottom: 18,
              textTransform: "uppercase",
            }}
          >
            Threat ID: PANOTI_MAXIMUS &nbsp;·&nbsp; Severity: Extreme
          </div>

          {/* Log-style lines */}
          <div
            style={{
              background: "#111",
              border: "1px solid #333",
              borderRadius: 3,
              padding: "10px 14px",
              fontFamily: "'Courier New', monospace",
              fontSize: 12,
              color: "#ccc",
              lineHeight: 1.8,
              marginBottom: 18,
            }}
          >
            <div>
              <span style={{ color: "#888" }}>[INFO]</span> Unknown entity detected
              on website
            </div>
            <div>
              <span style={{ color: "#f88" }}>[WARN]</span> Source identified:{" "}
              <span style={{ color: "#ff0" }}>Your decision-making process</span>
            </div>
            <div>
              <span style={{ color: "#f44" }}>[CRIT]</span> CommonSense.exe has
              stopped responding
            </div>
            <div>
              <span style={{ color: "#f44" }}>[CRIT]</span> PracticalThinking.dll not
              found
            </div>
          </div>

          {/* The question */}
          <div
            style={{
              fontSize: 15,
              color: "#f0f0f0",
              marginBottom: 22,
              lineHeight: 1.5,
            }}
          >
            Do you acknowledge that you are, in fact, an idiot?
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setStep(4)}
              style={{
                background: "#cc0000",
                color: "#fff",
                border: "none",
                padding: "9px 22px",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 3,
                cursor: "pointer",
                letterSpacing: "0.04em",
                boxShadow: "0 2px 0 #700",
                transition: "filter 0.1s",
              }}
              onMouseEnter={(e) => {
                ((e.currentTarget as HTMLElement).style.filter = "brightness(1.2)");
                ((e.currentTarget as HTMLElement).style.transform = "scale(1.02)");
              }}
              onMouseLeave={(e) =>{
                ((e.currentTarget as HTMLElement).style.filter = "brightness(1)");
                ((e.currentTarget as HTMLElement).style.transform = "scale(1)");
              }}
            >
              Yes, I accept
            </button>

            {/* The unreachable No button */}
            <button
              ref={noRef}
              onMouseEnter={evadeNo}
              style={{
                position: noPos ? "fixed" : "relative",
                left: noPos?.x,
                top: noPos?.y,
                background: "#222",
                color: "#aaa",
                border: "1px solid #555",
                padding: "9px 22px",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 3,
                cursor: "not-allowed",
                letterSpacing: "0.04em",
                transition: "left 0.08s ease, top 0.08s ease",
                zIndex: 9999,
              }}
            >
              No
              {attempts.current > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -18,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 9,
                    color: "#f88",
                    whiteSpace: "nowrap",
                    fontWeight: 400,
                    letterSpacing: "0.05em",
                  }}
                >
                  {attempts.current > 3 ? "Stop trying." : "Nice try."}
                </span>
              )}
            </button>
          </div>

          {/* Footer disclaimer */}
          <div
            style={{
              marginTop: 18,
              fontSize: 10,
              color: "#555",
              lineHeight: 1.6,
              borderTop: "1px solid #2a2a2a",
              paddingTop: 12,
            }}
          >
            This diagnosis is legally binding in 12 countries · Not responsible for loss of dignity
          </div>
        </div>
      </div>
    </div>
  );
}