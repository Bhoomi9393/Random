'use client';

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import SplitType from "split-type";
import gsap from "gsap";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const linePool = [
  "Most people never start.",
  "No guarantees from here.",
  "It gets unclear on purpose.",
  "Still moving counts.",
  "This is where most stop.",
  "It won't feel like progress.",
  "Keep going anyway. 😁",
  "Nothing here comes with instructions.",
  "You'll figure it out mid-way.",
  "That's normal, apparently.",
  "No one is ready for this.",
  "Yes, that's as unstable as it sounds.",
  "There's no final version.",
  "Momentum is doing most of the work.",
  "Confidence is optional.",
  "Confusion is expected.",
];

type Cell = {
  visited: boolean;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
};

function getRandomLine(): string {
  return linePool[Math.floor(Math.random() * linePool.length)];
}

function generateMaze(rows: number, cols: number): Cell[][] {
  const maze: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      visited: false,
      walls: {
        top: true,
        right: true,
        bottom: true,
        left: true,
      },
    }))
  );

  function shuffle<T>(array: T[]) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function carve(x: number, y: number) {
    maze[y][x].visited = true;

    const directions = shuffle([
      [0, -1, "top", "bottom"], // Up
      [1, 0, "right", "left"], // Right
      [0, 1, "bottom", "top"], // Down
      [-1, 0, "left", "right"], // Left
    ]);

    for (const [dx, dy, wall, opposite] of directions) {
      const nx = x + (dx as number);
      const ny = y + (dy as number);

      if (
        nx >= 0 && nx < cols &&
        ny >= 0 && ny < rows &&
        !maze[ny][nx].visited
      ) {
        maze[y][x].walls[wall as keyof Cell["walls"]] = false;
        maze[ny][nx].walls[opposite as keyof Cell["walls"]] = false;
        carve(nx, ny);
      }
    }
  }
  carve(0, 0);
  return maze;
}

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const line = useRef(getRandomLine()).current;
  const [displayLine, setDisplayLine] = useState("");
  const [lineDone, setLineDone] = useState(false);

  const ROWS = 20;
  const COLS = 30;
  const CELL = 40;

  const [maze] = useState(() => generateMaze(ROWS, COLS));

  useLayoutEffect(() => {
    if (!titleRef.current) return;

    const split = new SplitType(titleRef.current, { types: "chars" });

    gsap.set(split.chars, {
      y: 80,
      opacity: 0,
    });

    gsap.set(".wall", {
      strokeDasharray: 50,
      strokeDashoffset: 50,
      opacity: 0,
    });

    const tl = gsap.timeline();

    // Maze draws
    tl.to(".wall", {
      strokeDashoffset: 0,
      opacity: 0.25,
      duration: 0.5,
      stagger: {
        each: 0.002,
        from: "random",
      },
      ease: "power2.out",
    });

    // Title appears AFTER maze
    tl.to(split.chars, {
      y: 0,
      opacity: 1,
      stagger: 0.06,
      duration: 0.9,
      ease: "power4.out",
    });

    // Start typing AFTER title
    tl.call(() => {
      let charIndex = 0;

      intervalRef.current = setInterval(() => {
        charIndex++;

        setDisplayLine(line.slice(0, charIndex));

        if (charIndex >= line.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setLineDone(true);
        }
      }, 55);
    });

    // Maze glow can start whenever you want
    const glowTween = gsap.to(".wall", {
      stroke: "#fde047",
      repeat: -1,
      yoyo: true,
      duration: 2,
      stagger: {
        each: 0.005,
        from: "random",
      },
    });

    return () => {
      split.revert();

      if (intervalRef.current) clearInterval(intervalRef.current);

      tl.kill();
      glowTween.kill();
    };
  }, []);

  return (
    <div className={`relative min-h-screen flex flex-col justify-center items-center px-2 ${spaceGrotesk.className} overflow-hidden`}>

      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[-10]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.13) 0px, rgba(0,0,0,0.13) 1px, transparent 1px, transparent 2px)",
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      >
        {maze.map((row, y) =>
          row.map((cell, x) => {
            const px = x * CELL;
            const py = y * CELL;

            return (
              <g key={`${x}-${y}`}>
                {cell.walls.top && (
                  <line
                    className="wall"
                    x1={px}
                    y1={py}
                    x2={px + CELL}
                    y2={py}
                    stroke="#eab308"
                    strokeWidth="1"
                  />
                )}

                {cell.walls.right && (
                  <line
                    className="wall"
                    x1={px + CELL}
                    y1={py}
                    x2={px + CELL}
                    y2={py + CELL}
                    stroke="#eab308"
                    strokeWidth="1"
                  />
                )}

                {cell.walls.bottom && (
                  <line
                    className="wall"
                    x1={px}
                    y1={py + CELL}
                    x2={px + CELL}
                    y2={py + CELL}
                    stroke="#eab308"
                    strokeWidth="1"
                  />
                )}

                {cell.walls.left && (
                  <line
                    className="wall"
                    x1={px}
                    y1={py}
                    x2={px}
                    y2={py + CELL}
                    stroke="#eab308"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })
        )}
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 ref={titleRef} className="text-6xl font-bold outlined-text">
          Know me?
        </h1>

        <div className="mt-6 text-yellow-200">
          <span>
            {displayLine}
            {!lineDone && (
              <span
                ref={cursorRef}
                className="inline-block w-[2px] h-[1em] bg-white/70 ml-[2px] align-middle animate-pulse"
              />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}