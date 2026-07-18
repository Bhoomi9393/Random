"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  onClick: () => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HubCard({ onClick }: Props) {
  const reduceMotion = useReducedMotion();
  
  

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label="Open Things I like"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="like-card float absolute top-1/2 left-1/2 flex h-[340px] w-[200px] -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-yellow-500/20 bg-neutral-900 text-center shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70 sm:h-[400px] sm:w-[260px]"
      style={{
        backgroundImage: "url('/images/money.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-neutral-900/80" />

      {/* stacked-file icon: three offset cards behind a front one */}
      <div className="relative z-10 mb-6 h-16 w-16">
        <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl border border-yellow-500/30 bg-neutral-800" />
        <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-xl border border-yellow-500/40 bg-neutral-800" />
        <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-yellow-500/60 bg-neutral-900">
          <span className="font-mono text-lg font-bold text-yellow-400">4</span>
        </div>
      </div>

      <h2 className="relative z-10 mt-1 text-3xl font-bold text-white">Things I like</h2>
      <p className="relative z-10 mt-3 text-sm text-neutral-500">click to open</p>
    </motion.div>
  );
}