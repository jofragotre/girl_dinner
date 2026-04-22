"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import recipes from "@/data/recipes.json";
import cocktails from "@/data/cocktails.json";
import subtitles from "@/data/subtitles.json";
import { pick, pickFiltered } from "@/lib/random";
import { getGreeting } from "@/lib/greeting";
import type { Recipe, Cocktail, Mood } from "@/lib/types";
import RecipeCard from "./components/RecipeCard";
import MoodChips from "./components/MoodChips";
import ShareCard from "./components/ShareCard";

const allRecipes = recipes as Recipe[];
const allCocktails = cocktails as Cocktail[];

const SHUFFLE_DURATION = 600;
const SHUFFLE_INTERVAL = 80;

function loadMoods(): Mood[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("girl-dinner-moods");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function loadSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("girl-dinner-sound") === "true";
  } catch {
    return false;
  }
}

export default function Home() {
  const [dinner, setDinner] = useState<Recipe>(allRecipes[0]);
  const [drink, setDrink] = useState<Cocktail>(allCocktails[0]);
  const [subtitle, setSubtitle] = useState("");
  const [subtitleKey, setSubtitleKey] = useState(0);
  const [greeting, setGreeting] = useState("");
  const [moods, setMoods] = useState<Mood[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [noMatch, setNoMatch] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [girlCount, setGirlCount] = useState(0);
  const [isFriday, setIsFriday] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [btnGrad, setBtnGrad] = useState({ x: 50, y: 50 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Client-only init to avoid hydration mismatch
  useEffect(() => {
    setMoods(loadMoods());
    setGreeting(getGreeting());
    setSubtitle(pick(subtitles));
    setSoundEnabled(loadSoundEnabled());
    setGirlCount(Math.floor(Math.random() * 50000) + 45000);
    setIsFriday(new Date().getDay() === 5);
    setMounted(true);
  }, []);

  // Initial randomize once moods are loaded
  useEffect(() => {
    if (!mounted) return;
    const d = pickFiltered(allRecipes, moods);
    const c = pickFiltered(allCocktails, moods);
    if (d && c) {
      setDinner(d);
      setDrink(c);
      setNoMatch(false);
    } else {
      setNoMatch(true);
    }
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist moods
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("girl-dinner-moods", JSON.stringify(moods));
  }, [moods, mounted]);

  // Persist sound preference
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("girl-dinner-sound", String(soundEnabled));
  }, [soundEnabled, mounted]);

  // Subtitle auto-rotation every 5 seconds
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setSubtitle(pick(subtitles));
      setSubtitleKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Girl count oscillation
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setGirlCount((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 2500);
    return () => clearInterval(interval);
  }, [mounted]);

  const playDing = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // AudioContext not supported — silent fail
    }
  }, [soundEnabled]);

  const fireConfetti = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { x, y },
      colors: ["#ff4d8f", "#c9184a", "#f7cad0", "#fff"],
      disableForReducedMotion: true,
    });
  }, []);

  const randomize = useCallback(() => {
    if (isShuffling) return;

    setIsShuffling(true);
    setNoMatch(false);
    setSubtitle(pick(subtitles));
    setSubtitleKey((k) => k + 1);
    setGreeting(getGreeting());

    // Rapid cycle through random names
    const interval = setInterval(() => {
      setDinner(pick(allRecipes));
      setDrink(pick(allCocktails));
    }, SHUFFLE_INTERVAL);

    // Settle on final filtered pick
    setTimeout(() => {
      clearInterval(interval);
      const d = pickFiltered(allRecipes, moods);
      const c = pickFiltered(allCocktails, moods);
      if (d && c) {
        setDinner(d);
        setDrink(c);
        setNoMatch(false);
        setAnimKey((k) => k + 1);
        fireConfetti();
        playDing();
      } else {
        setNoMatch(true);
      }
      setIsShuffling(false);
    }, SHUFFLE_DURATION);
  }, [isShuffling, moods, fireConfetti, playDing]);

  const handleMoodChange = useCallback((newMoods: Mood[]) => {
    setMoods(newMoods);
    setNoMatch(false);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12 font-sans">
      {/* Header */}
      <header className="text-center mb-8">
        {mounted && greeting && (
          <p className="text-sm text-wine/70 mb-3 tracking-wide uppercase">
            {greeting}
          </p>
        )}
        <h1 className="font-serif italic font-bold text-wine tracking-tight text-[72px] leading-none">
          girl dinner&trade;
        </h1>
        {mounted && subtitle && (
          <p
            key={subtitleKey}
            className="animate-fade-in mt-4 font-hand text-xl text-wine/70 tracking-wide"
          >
            {subtitle}
          </p>
        )}
      </header>

      {/* Friday mode banner */}
      {mounted && isFriday && (
        <div className="mb-6 px-6 py-2 rounded-full bg-gradient-to-r from-gold/20 via-rose/20 to-mauve/20 border border-gold/30 text-center">
          <p className="text-sm text-wine tracking-wide font-medium">
            ✨ it&apos;s friday. double everything. that&apos;s the rule. ✨
          </p>
        </div>
      )}

      {/* Mood filter chips */}
      <div className="mb-6 w-full max-w-lg">
        <MoodChips selected={moods} onChange={handleMoodChange} />
      </div>

      {/* Cards or fallback */}
      {noMatch ? (
        <div className="w-full max-w-lg text-center py-16">
          <p className="font-serif italic text-2xl text-dusty">
            no girl dinner matches this energy.
          </p>
          <p className="text-base text-dusty/70 mt-2">
            try another vibe.
          </p>
        </div>
      ) : (
        <>
          <div
            key={animKey}
            className="animate-fade-in w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <RecipeCard
              item={dinner}
              label="tonight's dinner"
              emoji="&#127869;"
              dotColor="bg-rose"
              isShuffling={isShuffling}
            />
            <RecipeCard
              item={drink}
              label="pair with"
              emoji="&#127864;"
              dotColor="bg-mauve"
              isShuffling={isShuffling}
              fridayMode={isFriday}
            />
          </div>
        </>
      )}

      {/* Randomize button */}
      <button
        ref={buttonRef}
        onClick={randomize}
        disabled={isShuffling}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setBtnGrad({
            x: ((e.clientX - r.left) / r.width) * 100,
            y: ((e.clientY - r.top) / r.height) * 100,
          });
        }}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={btnHovered ? {
          background: `radial-gradient(circle at ${btnGrad.x}% ${btnGrad.y}%, #FFE4EE 0%, #EEE0F5 55%, transparent 100%)`,
        } : undefined}
        className="mt-8 px-10 py-3 rounded-full text-base font-medium tracking-wide
                   text-wine border border-wine/30 bg-petal/50
                   hover:border-wine/50 active:scale-95
                   transition-all duration-200 cursor-pointer
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isShuffling ? "shuffling..." : "randomize ✨"}
      </button>

      {/* Footer */}
      <footer className="mt-auto pt-10 pb-6 text-center flex flex-col items-center gap-4">
        <nav className="flex items-center gap-5 text-sm text-wine/70 font-medium tracking-wide">
          <Link href="/dishes" className="hover:text-wine transition-colors">
            all dishes
          </Link>
          <span className="text-wine/25">·</span>
          <Link href="/cocktails" className="hover:text-wine transition-colors">
            all cocktails
          </Link>
        </nav>
        {mounted && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-petal/60 border border-rose/20 text-sm text-wine/75">
            🍽️ {girlCount.toLocaleString()} girls currently eating
          </span>
        )}
        {mounted && !noMatch && <ShareCard dinner={dinner} drink={drink} />}
        {mounted && (
          <button
            onClick={() => setSoundEnabled((v) => !v)}
            className="text-wine/40 hover:text-wine/70 transition-colors cursor-pointer text-base"
            title={soundEnabled ? "mute randomize ding" : "enable randomize ding"}
          >
            {soundEnabled ? "🔔" : "🔕"}
          </button>
        )}
      </footer>
    </main>
  );
}
