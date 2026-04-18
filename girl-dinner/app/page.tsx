"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import recipes from "@/data/recipes.json";
import cocktails from "@/data/cocktails.json";
import subtitles from "@/data/subtitles.json";
import { pick, pickFiltered } from "@/lib/random";
import { getGreeting } from "@/lib/greeting";
import type { Recipe, Cocktail, Mood } from "@/lib/types";
import RecipeCard from "./components/RecipeCard";
import MoodChips from "./components/MoodChips";

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

export default function Home() {
  const [dinner, setDinner] = useState<Recipe>(allRecipes[0]);
  const [drink, setDrink] = useState<Cocktail>(allCocktails[0]);
  const [subtitle, setSubtitle] = useState("");
  const [greeting, setGreeting] = useState("");
  const [moods, setMoods] = useState<Mood[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [noMatch, setNoMatch] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Client-only init to avoid hydration mismatch
  useEffect(() => {
    setMoods(loadMoods());
    setGreeting(getGreeting());
    setSubtitle(pick(subtitles));
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
      } else {
        setNoMatch(true);
      }
      setIsShuffling(false);
    }, SHUFFLE_DURATION);
  }, [isShuffling, moods, fireConfetti]);

  const handleMoodChange = useCallback((newMoods: Mood[]) => {
    setMoods(newMoods);
    setNoMatch(false);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12 font-sans">
      {/* Header */}
      <header className="text-center mb-10">
        {mounted && greeting && (
          <p className="font-hand text-lg text-dusty mb-2 tracking-wide">
            {greeting}
          </p>
        )}
        <h1 className="font-serif text-6xl sm:text-7xl italic text-wine tracking-tight">
          girl dinner&trade;
        </h1>
        {mounted && subtitle && (
          <p className="mt-3 font-hand text-xl text-dusty/70 tracking-wide">
            {subtitle}
          </p>
        )}
        <div className="mt-4 text-rose/50 text-sm tracking-[0.3em]">
          ~ &#10045; ~
        </div>
      </header>

      {/* Mood filter chips */}
      <div className="mb-8 w-full max-w-lg">
        <MoodChips selected={moods} onChange={handleMoodChange} />
      </div>

      {/* Cards or fallback */}
      {noMatch ? (
        <div className="w-full max-w-lg text-center py-16">
          <p className="font-hand text-2xl text-dusty">
            no girl dinner matches this energy.
          </p>
          <p className="font-hand text-xl text-dusty/60 mt-2">
            try another vibe.
          </p>
        </div>
      ) : (
        <div
          key={animKey}
          className="animate-fade-in w-full max-w-lg flex flex-col gap-8"
        >
          <RecipeCard
            item={dinner}
            label="tonight's dinner"
            emoji="&#127869;"
            dotColor="bg-rose"
            borderColor="border-rose/30"
            isShuffling={isShuffling}
          />
          <RecipeCard
            item={drink}
            label="pair with"
            emoji="&#127864;"
            dotColor="bg-mauve"
            borderColor="border-mauve/30"
            isShuffling={isShuffling}
          />
        </div>
      )}

      {/* Randomize button */}
      <button
        ref={buttonRef}
        onClick={randomize}
        disabled={isShuffling}
        className="btn-shimmer mt-10 px-8 py-3.5 rounded-full font-semibold text-white
                   bg-gradient-to-r from-rose via-mauve to-rose
                   shadow-md hover:shadow-lg hover:scale-105
                   active:scale-95 transition-all duration-200 cursor-pointer
                   disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isShuffling ? "shuffling..." : "randomize \u2728"}
      </button>

      {/* Footer */}
      <footer className="mt-auto pt-16 pb-6 text-center text-dusty/60 text-xs tracking-wide">
        made with &#10084;&#65039;
      </footer>
    </main>
  );
}
