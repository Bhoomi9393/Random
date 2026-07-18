"use client";

import { useEffect, useState, useRef } from "react";
import React from "react";

type ScanningProps = { setStep: React.Dispatch<React.SetStateAction<number>> };

const DURATION = 3500;

const STATUS_MESSAGES = [
  { at: 0,    msg: "Initializing..." },
  { at: 0.12, msg: "Running Deep Scan..." },
  { at: 0.3,  msg: "Verifying Integrity..." },
  { at: 0.55, msg: "Cross-referencing database..." },
  { at: 0.75, msg: "Analyzing threat vectors..." },
  { at: 0.92, msg: "Finalizing report..." },
];

// Concentric ring config: [radius, speed (deg/frame), direction, opacity, dash]
const RINGS = [
  { r: 110, speed: 0.18,  dir:  1, opacity: 0.12, dash: 0   },
  { r: 95,  speed: 0.25,  dir: -1, opacity: 0.20, dash: 8   },
  { r: 78,  speed: 0.15,  dir:  1, opacity: 0.30, dash: 0   },
  { r: 60,  speed: 0.35,  dir: -1, opacity: 0.18, dash: 12  },
  { r: 44,  speed: 0.22,  dir:  1, opacity: 0.35, dash: 0   },
  { r: 28,  speed: 0.40,  dir: -1, opacity: 0.25, dash: 5   },
];

export default function Scanning({ setStep }: ScanningProps) {
  const [progress, setProgress] = useState(0);
  const [statusLine, setStatusLine] = useState(STATUS_MESSAGES[0].msg);
  const [ringAngles, setRingAngles] = useState(RINGS.map(() => 0));

  const startRef  = useRef<number | null>(null);
  const rafRef    = useRef<number | null>(null);
  const angleRef  = useRef<number[]>(RINGS.map(() => 0));

  useEffect(() => {
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min(elapsed / DURATION, 1);

      setProgress(p);

      const active = [...STATUS_MESSAGES].reverse().find((s) => p >= s.at);
      if (active) setStatusLine(active.msg);

      // Rotate rings
      angleRef.current = angleRef.current.map((a, i) =>
        a + RINGS[i].speed * RINGS[i].dir
      );
      setRingAngles([...angleRef.current]);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setStep(3);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [setStep]);

  const sweepAngle = progress * 360;
  const cx = 120;
  const cy = 120;
  const viewSize = 240;

  // Polar to cartesian
  const polar = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  // SVG arc path for sweep arm
  const buildSweepPath = (r: number, deg: number) => {
    if (deg <= 0) return "";
    if (deg >= 360) return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
    const large = deg > 180 ? 1 : 0;
    const end = polar(deg, r);
    return `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;
  };

  const pct = Math.round(progress * 100).toString().padStart(3, "0");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#080808",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');`}</style>

      {/* Scanlines overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 2px)",
      }} />

      {/* Iris scanner SVG */}
      <div style={{ position: "relative", marginBottom: 36 }}>
        <svg
          width={viewSize}
          height={viewSize}
          viewBox={`0 0 ${viewSize} ${viewSize}`}
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Radial gradient for sweep fill */}
            <radialGradient id="sweepGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#00e5ff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.02" />
            </radialGradient>
            {/* Glow filter */}
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            {/* Clip to circle */}
            <clipPath id="iris-clip">
              <circle cx={cx} cy={cy} r={RINGS[0].r + 4} />
            </clipPath>
          </defs>

          {/* Rotating concentric rings */}
          {RINGS.map((ring, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={ring.r}
              fill="none"
              stroke="#00e5ff"
              strokeOpacity={ring.opacity}
              strokeWidth={ring.dash ? 1 : 1.5}
              strokeDasharray={ring.dash ? `${ring.dash} ${ring.dash}` : undefined}
              transform={`rotate(${ringAngles[i]}, ${cx}, ${cy})`}
            />
          ))}

          {/* Sweep fill */}
          <path
            d={buildSweepPath(RINGS[0].r, sweepAngle)}
            fill="url(#sweepGrad)"
            clipPath="url(#iris-clip)"
          />

          {/* Sweep leading edge */}
          {sweepAngle > 0 && sweepAngle < 360 && (() => {
            const tip = polar(sweepAngle, RINGS[0].r);
            return (
              <line
                x1={cx} y1={cy}
                x2={tip.x} y2={tip.y}
                stroke="#00e5ff"
                strokeWidth={1.5}
                strokeOpacity={0.9}
                filter="url(#glow)"
              />
            );
          })()}

          {/* Outer tick marks */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = i * 10;
            const inner = polar(angle, RINGS[0].r + 6);
            const outer = polar(angle, RINGS[0].r + (i % 3 === 0 ? 14 : 10));
            return (
              <line
                key={i}
                x1={inner.x} y1={inner.y}
                x2={outer.x} y2={outer.y}
                stroke="#00e5ff"
                strokeOpacity={i % 3 === 0 ? 0.4 : 0.15}
                strokeWidth={i % 3 === 0 ? 1.5 : 0.8}
              />
            );
          })}

          {/* Centre pupil */}
          <circle cx={cx} cy={cy} r={10} fill="#080808" stroke="#00e5ff" strokeOpacity={0.5} strokeWidth={1} />
          <circle cx={cx} cy={cy} r={3}  fill="#00e5ff" fillOpacity={0.8} filter="url(#glow)" />

          {/* Crosshair */}
          {[0, 90, 180, 270].map((angle) => {
            const start = polar(angle, 16);
            const end   = polar(angle, 22);
            return (
              <line
                key={angle}
                x1={start.x} y1={start.y}
                x2={end.x}   y2={end.y}
                stroke="#00e5ff"
                strokeOpacity={0.6}
                strokeWidth={1}
              />
            );
          })}
        </svg>

        {/* Corner brackets */}
        {[
          { top: -10, left: -10,  rotate: "0deg"   },
          { top: -10, right: -10, rotate: "90deg"  },
          { bottom: -10, right: -10, rotate: "180deg" },
          { bottom: -10, left: -10,  rotate: "270deg" },
        ].map((pos, i) => (
          <svg
            key={i}
            width="18" height="18" viewBox="0 0 18 18"
            style={{ position: "absolute", transform: `rotate(${pos.rotate})`, ...pos as React.CSSProperties }}
          >
            <polyline points="0,14 0,0 14,0" fill="none" stroke="#00e5ff" strokeWidth="1.5" strokeOpacity="0.7" />
          </svg>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{
        width: 240, height: 1,
        background: "rgba(0,229,255,0.1)",
        marginBottom: 18,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          width: `${progress * 100}%`,
          background: "linear-gradient(90deg, rgba(0,229,255,0.4), #00e5ff)",
          boxShadow: "0 0 8px rgba(0,229,255,0.8)",
          transition: "width 0.016s linear",
        }} />
      </div>

      {/* Status */}
      <div style={{
        fontSize: 10,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "rgba(0,229,255,0.4)",
        marginBottom: 8,
        minWidth: 240,
        textAlign: "center",
      }}>
        {statusLine}
      </div>

      {/* Percentage */}
      <div style={{
        fontSize: 22,
        fontWeight: 700,
        color: "#00e5ff",
        letterSpacing: "0.12em",
        textShadow: "0 0 16px rgba(0,229,255,0.5)",
      }}>
        {pct}<span style={{ fontSize: 12, fontWeight: 400, opacity: 0.5 }}>%</span>
      </div>
    </div>
  );
}