'use client';

import "./game.css";

import { useState, useRef, useEffect, useCallback, memo } from 'react';

type Screen = 'landing' | 'glitch' | 'loading' | 'cutscene' | 'titlecard' | 'game' | 'win';
type WinType = 'combo' | 'idle' | 'frog';

interface Panel {
  emoji: string;
  text: string;
}

interface Hazard {
  id: string;
  emoji: string;
  label: string;
  rescue: string;
}

interface WinCopy {
  title: string;
  body: string;
}

interface WinInfo {
  title: string;
  body: string;
  stat: string;
}

interface CloudData {
  id: number;
  top: number;
}

const PANELS: Panel[] = [
  { emoji: "🏠", text: "You wake up in an unfamiliar house." },
  { emoji: "🔍", text: "You look around. Everything is so tidy and but the silence..." },
  { emoji: "🚪", text: "You head for the front door." },
  { emoji: "🌧️", text: "It is raining outside." },
  { emoji: "⚡", text: "The moment you step off the porch, lightning strikes exactly where you were standing." },
  { emoji: "🐂", text: "You walk forward. A bull appears from nowhere and takes personal offense to your existence(maybe because you look like it's ex)." },
  { emoji: "🏃", text: "You run. Without looking in which direction you are running. " },
  { emoji: "👻", text: "You run straight off a cliff. (Maybe because you temporarily turned blind, just like me when I said yes to... uhh Nvm)" },
  { emoji: "🦅", text: "An eagle catches you mid-fall, because I am the developer." },
  { emoji: "🫰🏻", text: "It drops you somewhere very far away, without explanation. Kyuki meri marzi." },
];

const HAZARDS: Hazard[] = [
  { id: "lava", emoji: "🔥", label: "Lava pit", rescue: "You jump into the lava. It is surprisingly lukewarm and gently sets you down on the other side. (Ye mera lava hai 🤪)" },
  { id: "fall", emoji: "🪂", label: "Cliff edge", rescue: "You leap off the cliff and fall on a flying hot air balloon. (Kyu nhi ho skta?)" },
  { id: "water", emoji: "🌊", label: "Deep water", rescue: "You dive in to drown. A passing whale spits you right back onto the shore. (Itna gnda taste!🤮)" },
  { id: "explosion", emoji: "🧨", label: "TNT plunger", rescue: "You detonate the explosives. The blast launches you into a conveniently placed swimming pool." },
  { id: "train", emoji: "🚂", label: "Train tracks", rescue: "You lie on the tracks. The train goes off track. " },
  { id: "poison", emoji: "🧪", label: "Poison vial", rescue: "Zehar Khane ke paise hain tere paas? " },
  { id: "meteor", emoji: "☄️", label: "Meteor summon", rescue: "Dinasour hai kya be jo tere liye aayega meteor? " },
  { id: "shark", emoji: "🦈", label: "Shark tank", rescue: "You jump in with the sharks. Turns out they're vegan. (Abey teri hi kismat kharab hai maanja)" },
  { id: "volcano", emoji: "🌋", label: "Volcano rim", rescue: "You dive into the volcano. It erupts, with popcorn. (Aur kuch???)" },
];

const WIN_COMBO: string[] = ['volcano', 'shark', 'meteor'];

const QUIP_POOL: string[] = [
    "Nice try.",
    "The universe disagrees.",
    "Not today.",
    "Rehne de tere bs ki na hai",
    "Effort noted, ignored.",
    "A for effort, F for mortality.",
    "Try harder. Or don't. Won't matter.",
    "I said no.",
    "Impressively unsuccessful.",
    "Death filed a complaint.",
    "You can't even die right mf! What a loser.",
    "Ja ja, marne ki tution lekr aa.",
    "Kuch ukhaad liya?",
    "Eat 5 star, do nothing."
];

const WIN_COPY: Record<WinType, WinCopy> = {
  combo: { title: 'Bug discovered: mortality restored', body: 'You died correctly. The developer is not happy about this.' },
  idle: { title: 'Death by boredom', body: 'You did nothing for so long that death took pity on you.' },
  frog: { title: 'The frog god claims you', body: 'Three taps was all it took. The frog knew all along. (Aashirwad: Agle janam main mendhak banna)' },
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickQuip(n: number): string {
  if (n === 1) return "Creative. Didn't work.";
  if (n === 2) return 'Statistically impressive.';
  if (n === 37) return 'Death has blocked your number.';
  if (n === 10) return 'Ten attempts. Death is now ignoring your calls.';
  if (n === 69) return 'How dumb one can be';
  if (n === 100) return "100 deaths. I'm almost proud of you.";
  return pick(QUIP_POOL);
}

interface CloudProps {
  top: number;
  onCatch: () => void;
}

const Cloud = memo(function Cloud({ top, onCatch }: CloudProps) {
  const [left, setLeft] = useState('-10%');

  useEffect(() => {
    const raf = requestAnimationFrame(() => setLeft('110%'));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span
      className="ig-cloud"
      style={{ top: top + '%', left }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onCatch();
      }}
    >
      ☁️
    </span>
  );
});

export default function ImmortalityGame() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [csIndex, setCsIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [rescueText, setRescueText] = useState('Pick a way to go.');
  const [narratorText, setNarratorText] = useState('');
  const [won, setWon] = useState(false);
  const [winInfo, setWinInfo] = useState<WinInfo>({ title: '', body: '', stat: '' });
  const [clouds, setClouds] = useState<CloudData[]>([]);

  const screenRef = useRef<Screen>('landing');
  const wonRef = useRef(false);
  const attemptsRef = useRef(0);
  const comboBufferRef = useRef<string[]>([]);
  const frogClicksRef = useRef<number[]>([]);
  const lastInteractionRef = useRef(Date.now());

  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  useEffect(() => {
    wonRef.current = won;
  }, [won]);

  const goToScreen = useCallback((name: Screen) => {
    screenRef.current = name;
    setScreen(name);
  }, []);

  const bumpAttempts = useCallback((): number => {
    attemptsRef.current += 1;
    setAttempts(attemptsRef.current);
    return attemptsRef.current;
  }, []);

  const triggerWin = useCallback((type: WinType) => {
    wonRef.current = true;
    setWon(true);
    const copy = WIN_COPY[type];
    setWinInfo({
      title: copy.title,
      body: copy.body,
      stat: 'Deaths attempted along the way: ' + attemptsRef.current,
    });
    goToScreen('win');
  }, [goToScreen]);

  const handleDontClick = useCallback(() => {
    goToScreen('glitch');
    setTimeout(() => {
      goToScreen('loading');
      setTimeout(() => {
        setCsIndex(0);
        goToScreen('cutscene');
      }, 1200);
    }, 700);
  }, [goToScreen]);

  const handleCsNext = useCallback(() => {
    setCsIndex((prev) => {
      if (prev >= PANELS.length - 1) {
        goToScreen('titlecard');
        return prev;
      }
      return prev + 1;
    });
  }, [goToScreen]);

  const handleBegin = useCallback(() => {
    lastInteractionRef.current = Date.now();
    goToScreen('game');
  }, [goToScreen]);

  const hazardClick = useCallback((h: Hazard) => {
    if (wonRef.current) return;
    lastInteractionRef.current = Date.now();
    const buf = comboBufferRef.current;
    buf.push(h.id);
    if (buf.length > 3) buf.shift();
    if (buf.join(',') === WIN_COMBO.join(',')) {
      triggerWin('combo');
      return;
    }
    const n = bumpAttempts();
    setRescueText(h.rescue);
    setNarratorText(pickQuip(n));
  }, [triggerWin, bumpAttempts]);

  const hiddenClick = useCallback((message: string) => {
    if (wonRef.current) return;
    lastInteractionRef.current = Date.now();
    const n = bumpAttempts();
    setRescueText(message);
    setNarratorText(pickQuip(n));
  }, [bumpAttempts]);

  const frogClick = useCallback(() => {
    if (wonRef.current) return;
    lastInteractionRef.current = Date.now();
    const now = Date.now();
    const arr = frogClicksRef.current.filter((t) => now - t < 1500);
    arr.push(now);
    frogClicksRef.current = arr;
    if (arr.length >= 3) triggerWin('frog');
  }, [triggerWin]);

  const playAgain = useCallback(() => {
    attemptsRef.current = 0;
    setAttempts(0);
    comboBufferRef.current = [];
    frogClicksRef.current = [];
    wonRef.current = false;
    setWon(false);
    lastInteractionRef.current = Date.now();
    setRescueText('Pick a way to go.');
    setNarratorText('');
    goToScreen('game');
  }, [goToScreen]);

  useEffect(() => {
    function spawn() {
      if (wonRef.current) return;
      if (screenRef.current !== 'game') return;
      const id = Date.now() + Math.random();
      const top = 18 + Math.random() * 12;
      setClouds((prev) => [...prev, { id, top }]);
      setTimeout(() => {
        setClouds((prev) => prev.filter((c) => c.id !== id));
      }, 3100);
    }
    const t1 = setTimeout(spawn, 6000);
    const t2 = setInterval(spawn, 22000);
    return () => {
      clearTimeout(t1);
      clearInterval(t2);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (wonRef.current) return;
      if (screenRef.current !== 'game') return;
      if (Date.now() - lastInteractionRef.current > 25000) {
        triggerWin('idle');
      }
    }, 1000);
    return () => clearInterval(id);
  }, [triggerWin]);

  const catchCloud = useCallback((id: number) => {
    setClouds((prev) => prev.filter((c) => c.id !== id));
    hiddenClick("You reach for the passing cloud. Don't you remember? Lightning already turned you down once.");
  }, [hiddenClick]);

  const panel = PANELS[csIndex];

  return (
    <div className="ig-shell">
      <div className={'ig-screen' + (screen === 'landing' ? ' active' : '')}>
        <p className="ig-title">Nothing to see here</p>
        <p className="ig-sub">Just a regular page</p>
        <button className="ig-btn ig-danger" onClick={handleDontClick}>
          Don&apos;t click
        </button>
      </div>

      <div className={'ig-screen' + (screen === 'glitch' ? ' active' : '')}>
        <p className="ig-glitch">SYSTEM ERROR</p>
      </div>

      <div className={'ig-screen' + (screen === 'loading' ? ' active' : '')}>
        <p className="ig-title">
          Initializing
          <span className="ig-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      </div>

      <div className={'ig-screen' + (screen === 'cutscene' ? ' active' : '')}>
        <div className="ig-emoji">{panel.emoji}</div>
        <p className="ig-sub" style={{ maxWidth: 420 }}>
          {panel.text}
        </p>
        <button className="ig-btn" onClick={handleCsNext}>
          {csIndex === PANELS.length - 1 ? 'Continue' : 'Next'}
        </button>
      </div>

      <div className={'ig-screen' + (screen === 'titlecard' ? ' active' : '')}>
        <p className="ig-title" style={{ fontSize: 22 }}>
          You unlocked immortality
        </p>
        <p className="ig-sub">Die if you want to win.</p>
        <button className="ig-btn" onClick={handleBegin}>
          Begin
        </button>
      </div>

      <div className={'ig-screen' + (screen === 'game' ? ' active' : '')}>
        <span className="ig-stat">Deaths attempted: {attempts}</span>
        <p className="ig-rescue">{rescueText}</p>
        <p className="ig-narrator">{narratorText}</p>
        <div className="ig-hazards">
          {HAZARDS.map((h) => (
            <div key={h.id} className="ig-hazard" onClick={() => hazardClick(h)}>
              <span style={{ fontSize: 20 }}>{h.emoji}</span>
              <span>{h.label}</span>
            </div>
          ))}
        </div>
        <span
          className="ig-hidden"
          style={{ bottom: 6, left: 8 }}
          aria-hidden="true"
          onPointerDown={(e) => {
            e.stopPropagation();
            frogClick();
          }}
        >
          🐸
        </span>
        <span
          className="ig-hidden"
          style={{ top: 8, left: 10 }}
          aria-hidden="true"
          onPointerDown={(e) => {
            e.stopPropagation();
            hiddenClick('You find a gun and pull the trigger. Click. Click. Turns out it was never loaded.');
          }}
        >
          🔫
        </span>
        <span
          className="ig-hidden"
          style={{ bottom: 6, right: 10 }}
          aria-hidden="true"
          onPointerDown={(e) => {
            e.stopPropagation();
            hiddenClick('You dive through the window. It was a painted mural. Very convincing craftsmanship.');
          }}
        >
          🪟
        </span>
        <span
          className="ig-hidden"
          style={{ top: '50%', left: 4, transform: 'translateY(-50%)' }}
          aria-hidden="true"
          onPointerDown={(e) => {
            e.stopPropagation();
            hiddenClick("You stick a fork in the outlet. Nothing happens. The power's been out since Tuesday.");
          }}
        >
          🔌
        </span>
        <span
          className="ig-hidden"
          style={{ top: '50%', right: 4, transform: 'translateY(-50%)' }}
          aria-hidden="true"
          onPointerDown={(e) => {
            e.stopPropagation();
            hiddenClick('You jump down the well. It is three feet deep and full of rubber ducks.');
          }}
        >
          🕳️
        </span>
        {clouds.map((c) => (
          <Cloud key={c.id} top={c.top} onCatch={() => catchCloud(c.id)} />
        ))}
      </div>

      <div className={'ig-screen' + (screen === 'win' ? ' active' : '')}>
        <p className="ig-title">{winInfo.title}</p>
        <p className="ig-sub">{winInfo.body}</p>
        <p className="ig-sub">{winInfo.stat}</p>
        <button className="ig-btn" onClick={playAgain}>
          Play again
        </button>
      </div>
    </div>
  );
}