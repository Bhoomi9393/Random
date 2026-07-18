"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Card from "./card";
import HubCard from "./hubCard";
import { cards } from "./data";
import "./like.css";

const SPACING_BREAKPOINTS: [number, number][] = [
  [1024, 280],
  [640, 190],
  [0, 95],
];

function getSpacing(width: number) {
  for (const [minWidth, spacing] of SPACING_BREAKPOINTS) {
    if (width >= minWidth) return spacing;
  }
  return 95;
}

export default function LikePage() {
  const [stage, setStage] = useState<"hub" | "fan">("hub");
  const [active, setActive] = useState<number | null>(null);
  const [spacing, setSpacing] = useState(280);

  useEffect(() => {
    const update = () => setSpacing(getSpacing(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const closeDetail = useCallback(() => setActive(null), []);
  const collapseToHub = useCallback(() => {
    setActive(null);
    setStage("hub");
  }, []);

  const step = useCallback((dir: 1 | -1) => {
    setActive((current) => {
      if (current === null) return current;
      const idx = cards.findIndex((c) => c.id === current);
      return cards[(idx + dir + cards.length) % cards.length].id;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
        return;
      }
      if (active !== null) closeDetail();
      else if (stage === "fan") collapseToHub();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, stage, closeDetail, collapseToHub, step]);

  const center = (cards.length - 1) / 2;
  const activeCard = cards.find((c) => c.id === active) ?? null;

  return (
    <div className="desktop min-h-screen bg-neutral-950">
      <AnimatePresence>
        {stage === "fan" && (
          <motion.button
            key="back"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onClick={collapseToHub}
            className="fixed left-6 top-6 z-40 font-mono text-xs uppercase tracking-widest text-neutral-500 transition hover:text-yellow-400"
          >
            ← things i like
          </motion.button>
        )}
      </AnimatePresence>

      <div
        className="desktop relative mx-auto mt-24 h-[440px] w-full max-w-6xl sm:h-[520px]"
        onClick={(e) => {
          if (e.target === e.currentTarget && stage === "fan" && active === null) {
            collapseToHub();
          }
        }}
      >
        <AnimatePresence mode="wait">
          {stage === "hub" ? (
            <HubCard key="hub" onClick={() => setStage("fan")} />
          ) : (
            <div key="fan">
              {cards.map((card, index) => {
                const offset = index - center;
                const baseX = offset * spacing;
                const baseRotate = Math.max(-26, Math.min(26, offset * 16));
                return (
                  <Card
                    key={card.id}
                    card={card}
                    index={index}
                    inactive={active !== null && active !== card.id}
                    hidden={active === card.id}
                    baseX={baseX}
                    baseRotate={baseRotate}
                    onClick={() => setActive(card.id)}
                  />
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeCard && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
            onClick={closeDetail}
          >
            <motion.div
              layoutId={`card-${activeCard.id}`}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="like-card relative flex w-full max-w-3xl min-h-[380px] flex-col overflow-hidden rounded-3xl border border-yellow-500/40 bg-neutral-900 shadow-2xl sm:min-h-[540px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 w-full sm:h-80">
                <Image
                  src={activeCard.image}
                  alt=""
                  fill
                  sizes="768px"
                  className="object-cover"
                  priority
                />
                <div className="card-overlay absolute inset-0" />
                <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.06]" />

                

                <div className="absolute bottom-5 left-6 right-6">
                  <h2 className="text-4xl font-bold text-white sm:text-5xl">
                    {activeCard.title}
                  </h2>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-8 p-8">
                <p className="max-h-[30vh] overflow-y-auto text-lg leading-relaxed text-neutral-300">
                  {activeCard.description}
                </p>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => step(-1)}
                    className="font-mono text-sm text-neutral-500 transition hover:text-yellow-400"
                    aria-label="Previous card"
                  >
                    ← prev
                  </button>
                  <button
                    onClick={closeDetail}
                    className="rounded-xl border border-yellow-500 px-6 py-3 font-semibold text-yellow-400 transition hover:bg-yellow-500 hover:text-black"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => step(1)}
                    className="font-mono text-sm text-neutral-500 transition hover:text-yellow-400"
                    aria-label="Next card"
                  >
                    next →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}