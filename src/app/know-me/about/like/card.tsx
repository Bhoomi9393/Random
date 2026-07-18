"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { LikeCardData } from "./data";

type Props = {
  card: LikeCardData;
  index: number;
  inactive: boolean;
  hidden?: boolean;
  baseX: number;
  baseRotate: number;
  onClick: () => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Card({
  card,
  index,
  inactive,
  hidden = false,
  baseX,
  baseRotate,
  onClick,
}: Props) {
  const reduceMotion = useReducedMotion();
  const settled = inactive || hidden;

  return (
    <motion.div
      layoutId={`card-${card.id}`}
      role="button"
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden}
      aria-label={`Open ${card.title}`}
      onClick={hidden ? undefined : onClick}
      onKeyDown={(e) => {
        if (hidden) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="like-card absolute top-1/2 left-1/2 h-[380px] w-[110px] -translate-y-1/2 cursor-pointer overflow-hidden rounded-3xl border border-yellow-500/20 bg-neutral-900 shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70 sm:h-[420px] sm:w-[140px]"
      style={{
        transformStyle: "preserve-3d",
        pointerEvents: hidden ? "none" : "auto",
      }}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { x: baseX, y: 0, rotateY: 180, scale: 0.7, opacity: 0 }
      }
      whileHover={hidden ? {} : { scale: 1.04, y: -6 }}
      animate={
        reduceMotion
          ? { opacity: hidden ? 0 : inactive ? 0.35 : 1 }
          : {
              x: baseX,
              y: settled ? 0 : [0, -10, 0],
              rotateY: baseRotate,
              scale: inactive ? 0.85 : 1,
              opacity: hidden ? 0 : inactive ? 0.35 : 1,
              filter: inactive ? "blur(5px)" : "blur(0px)",
              zIndex: hidden ? 0 : 10,
            }
      }
      transition={{
        x: { duration: 0.9, ease: EASE, delay: index * 0.12 },
        rotateY: { duration: 0.9, ease: EASE, delay: index * 0.12 },
        scale: { duration: 0.9, ease: EASE, delay: index * 0.12 },
        opacity: { duration: 0.9, ease: EASE, delay: index * 0.12 },
        filter: { duration: 0.9, ease: EASE, delay: index * 0.12 },
        y: settled
          ? { duration: 0.4, ease: EASE }
          : { duration: 5, ease: "easeInOut", repeat: Infinity, delay: index * 0.4 },
      }}
    >
      <Image
        src={card.image}
        alt=""
        fill
        sizes="150px"
        className="card-image object-cover"
        style={{ animationDelay: `${index * 3}s` }}
        priority={index < 2}
      />
      <div className="card-overlay absolute inset-0" />

      <div className="absolute left-0 right-0 top-0 flex items-center gap-1.5 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h2 className="mt-1 text-2xl font-bold leading-tight text-white">
          {card.title}
        </h2>
      </div>
    </motion.div>
  );
}