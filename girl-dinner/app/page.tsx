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
import JunglePlants from "./components/JunglePlants";

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
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMoods(loadMoods());
    setGreeting(getGreeting());
    setSubtitle(pick(subtitles));
    setSoundEnabled(loadSoundEnabled());
    setGirlCount(Math.floor(Math.random() * 50000) + 45000);
    setIsFriday(new Date().getDay() === 5);
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("girl-dinner-moods", JSON.stringify(moods));
  }, [moods, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("girl-dinner-sound", String(soundEnabled));
  }, [soundEnabled, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setSubtitle(pick(subtitles));
      setSubtitleKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [mounted]);

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
      colors: ["#FF3D8B", "#D91E6F", "#5EEAD4", "#F5E6F0"],
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

    const interval = setInterval(() => {
      setDinner(pick(allRecipes));
      setDrink(pick(allCocktails));
    }, SHUFFLE_INTERVAL);

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
    <main className="two-zone-bg relative min-h-screen flex flex-col items-center px-6 pt-20 pb-20 sm:pb-12 font-sans overflow-hidden">

      {/* Jungle overgrowth — 3-layer depth composition */}
      <JunglePlants />

      {/* Header / storefront sign */}
      <header className="relative text-center mb-10 z-10">
        {mounted && greeting && (
          <p className="neon-cyan-text text-[11px] mb-5 tracking-[0.32em] uppercase font-medium">
            {greeting}
          </p>
        )}
        <h1
          className="neon-title font-sans font-black uppercase text-[52px] sm:text-[96px] leading-[0.95] whitespace-nowrap"
          style={{ letterSpacing: "-0.03em" }}
        >
          <span className="light-sweep whitespace-nowrap">
            girl di<span className="neon-flicker">n</span>ner
          </span>
          <span className="neon-tm text-[40px] sm:text-[52px] align-top ml-1">™</span>
        </h1>
        {mounted && subtitle && (
          <p
            key={subtitleKey}
            className="animate-fade-in mt-6 font-hand text-2xl text-[#FFD5E5] tracking-wide"
            style={{ textShadow: "0 0 12px rgba(255, 61, 139, 0.35)" }}
          >
            {subtitle}
          </p>
        )}
      </header>

      {/* Friday mode banner */}
      {mounted && isFriday && (
        <div className="relative z-10 mb-8 px-6 py-2 rounded-full bg-black/40 border border-[#5EEAD4]/50 text-center"
             style={{ boxShadow: "0 0 18px rgba(94, 234, 212, 0.25)" }}>
          <p className="text-[12px] neon-cyan-text tracking-[0.2em] uppercase font-semibold">
            ✦ it&apos;s friday. double everything. that&apos;s the rule. ✦
          </p>
        </div>
      )}

      {/* Filter pills — between zones */}
      <div className="relative z-10 mb-10 w-full max-w-lg">
        <MoodChips selected={moods} onChange={handleMoodChange} />
      </div>

      {/* Cards — mirrored interior */}
      {noMatch ? (
        <div className="relative z-10 w-full max-w-lg text-center py-16">
          <p className="neon-pink-text font-sans font-black uppercase text-2xl tracking-wider">
            no girl dinner matches this energy.
          </p>
          <p className="text-base text-[#F5E6F0]/50 mt-3">
            try another vibe.
          </p>
        </div>
      ) : (
        <div
          key={animKey}
          className="animate-fade-in relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <RecipeCard
            item={dinner}
            label="tonight's dinner"
            emoji="&#127869;"
            accent="pink"
            isShuffling={isShuffling}
          />
          <RecipeCard
            item={drink}
            label="pair with"
            emoji="&#127864;"
            accent="cyan"
            isShuffling={isShuffling}
            fridayMode={isFriday}
          />
        </div>
      )}

      {/* Action bar + social proof + footer nav, grouped into a single anchored stack */}
      <div className="relative z-10 mt-auto w-full max-w-[600px] flex flex-col items-center pt-14">
        {/* GROUP A — primary actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            ref={buttonRef}
            onClick={randomize}
            disabled={isShuffling}
            className="neon-button px-10 py-3.5 rounded-full text-[13px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isShuffling ? "shuffling…" : "randomize ✦"}
          </button>
        </div>


        {/* GROUP C — footer nav */}
        <footer
          className="mt-16 pt-6 pb-6 w-full flex flex-col items-center gap-3 border-t"
          style={{ borderColor: "rgba(94, 234, 212, 0.15)" }}
        >
          <nav className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-[12px] tracking-[0.2em] uppercase font-semibold">
            <Link href="/dishes" className="neon-cyan-text hover:opacity-80 transition-opacity text-right">
              all recipes
            </Link>
            <span className="text-[#5EEAD4]/30">✦</span>
            <Link href="/cocktails" className="neon-cyan-text hover:opacity-80 transition-opacity text-left">
              all cocktails
            </Link>
          </nav>

          <p
            className="text-[11px] tracking-[0.2em] uppercase"
            style={{ color: "rgba(94, 234, 212, 0.4)" }}
          >
            girl dinner™ · est. whenever
          </p>

          {mounted && (
            <div className="w-full flex items-center justify-between pt-2">
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] tracking-wide
                           bg-black/25 border border-[#FF3D8B]/20 text-[#F5E6F0]/55"
              >
                <span
                  className="w-1 h-1 rounded-full bg-[#FF3D8B]"
                  style={{ boxShadow: "0 0 6px rgba(255, 61, 139, 0.7)" }}
                />
                {girlCount.toLocaleString()} girls currently eating
              </span>
              <div className="flex items-center gap-3">
                {!noMatch && <ShareCard dinner={dinner} drink={drink} compact />}
                <button
                  onClick={() => setSoundEnabled((v) => !v)}
                  className="text-[#F5E6F0]/35 hover:text-[#F5E6F0]/70 transition-colors cursor-pointer text-xl"
                  title={soundEnabled ? "mute randomize ding" : "enable randomize ding"}
                >
                  {soundEnabled ? "🔔" : "🔕"}
                </button>
              </div>
            </div>
          )}
        </footer>
      </div>
    </main>
  );
}
