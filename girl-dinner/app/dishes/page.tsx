import Link from "next/link";
import recipes from "@/data/recipes.json";
import type { Recipe } from "@/lib/types";

const allRecipes = recipes as Recipe[];

const moodColors: Record<string, string> = {
  soft: "bg-rose/10 text-rose border-rose/20",
  feral: "bg-gold/10 text-gold border-gold/20",
  fancy: "bg-mauve/10 text-mauve border-mauve/20",
  hungover: "bg-dusty/10 text-dusty border-dusty/20",
};

export const metadata = {
  title: "all dishes — girl dinner™",
  description: "every meal this kitchen has to offer",
};

export default function DishesPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12 font-sans">
      <header className="text-center mb-10">
        <Link
          href="/"
          className="text-sm text-wine/60 hover:text-wine transition-colors tracking-wide mb-4 inline-block font-medium"
        >
          ← back to dinner
        </Link>
        <h1 className="font-serif text-5xl sm:text-6xl italic font-bold text-wine tracking-tight">
          all dishes 🍽️
        </h1>
        <p className="mt-3 text-base text-wine/65">
          {allRecipes.length} ways to eat like a girl
        </p>
      </header>

      <div className="w-full max-w-2xl grid gap-4">
        {allRecipes.map((recipe) => (
          <section
            key={recipe.id}
            className="card-lift bg-[#FDF8F5]/90 backdrop-blur-sm rounded-3xl p-6 border border-[rgba(128,0,64,0.08)] shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="font-serif italic font-semibold text-[28px] leading-tight text-wine">
                  {recipe.name}
                </h2>
                {recipe.vibe && (
                  <p className="text-dusty italic mt-1.5 text-sm">&ldquo;{recipe.vibe}&rdquo;</p>
                )}
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {recipe.ingredients.map((ing) => (
                    <li key={ing} className="flex items-center gap-1.5 text-deep/75 text-base">
                      <span className="w-[6px] h-[6px] rounded-full bg-rose inline-block flex-shrink-0" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
              {recipe.moods && recipe.moods.length > 0 && (
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  {recipe.moods.map((mood) => (
                    <span
                      key={mood}
                      className={`text-xs px-2.5 py-0.5 rounded-full border font-medium tracking-wide ${moodColors[mood] ?? "bg-dusty/10 text-dusty border-dusty/20"}`}
                    >
                      {mood}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-auto pt-12 pb-6 text-center flex flex-col items-center gap-3">
        <Link
          href="/"
          className="text-wine/70 hover:text-wine transition-colors text-sm font-medium tracking-wide"
        >
          ← back home
        </Link>
        <Link
          href="/cocktails"
          className="text-wine/70 hover:text-wine transition-colors text-sm font-medium tracking-wide"
        >
          see all cocktails →
        </Link>
      </footer>
    </main>
  );
}
