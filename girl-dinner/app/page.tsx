"use client";
import { useState, useEffect } from "react";
import recipes from "@/data/recipes.json";
import cocktails from "@/data/cocktails.json";

const pick = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

export default function Home() {
  const [dinner, setDinner] = useState(recipes[0]);
  const [drink, setDrink] = useState(cocktails[0]);

  useEffect(() => {
    setDinner(pick(recipes));
    setDrink(pick(cocktails));
  }, []);

  return (
    <main className="min-h-screen bg-black text-pink-200 p-8 font-serif">
      <h1 className="text-5xl italic mb-8">girl dinner™</h1>

      <section className="mb-12">
        <h2 className="text-2xl text-pink-400">{dinner.name}</h2>
        <p className="italic opacity-70">{dinner.vibe}</p>
        <ul className="list-disc ml-6 mt-2">
          {dinner.ingredients.map((i: string) => <li key={i}>{i}</li>)}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl text-pink-400">pair with: {drink.name}</h2>
        <ul className="list-disc ml-6 mt-2">
          {drink.ingredients.map((i: string) => <li key={i}>{i}</li>)}
        </ul>
      </section>

      <button
        onClick={() => { setDinner(pick(recipes)); setDrink(pick(cocktails)); }}
        className="bg-pink-500 text-black px-6 py-3 rounded-full hover:bg-pink-300"
      >
        randomize ✨
      </button>
    </main>
  );
}