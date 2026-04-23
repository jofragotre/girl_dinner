import Link from "next/link";
import cocktails from "@/data/cocktails.json";
import type { Cocktail } from "@/lib/types";
import JunglePlants from "../components/JunglePlants";

const allCocktails = cocktails as Cocktail[];

const moodColors: Record<string, string> = {
  soft: "bg-[#FF3D8B]/10 text-[#FF3D8B] border-[#FF3D8B]/40",
  feral: "bg-[#5EEAD4]/10 text-[#5EEAD4] border-[#5EEAD4]/40",
  fancy: "bg-[#FF3D8B]/10 text-[#FF3D8B] border-[#FF3D8B]/40",
  hungover: "bg-[#5EEAD4]/10 text-[#5EEAD4] border-[#5EEAD4]/40",
};

export const metadata = {
  title: "all cocktails — girl dinner™",
  description: "every sip this bar has to offer",
};

export default function CocktailsPage() {
  return (
    <main className="interior-bg relative min-h-screen flex flex-col items-center px-6 py-16 font-sans overflow-hidden">
      <JunglePlants />

      <header className="relative z-10 text-center mb-12">
        <Link
          href="/"
          className="neon-cyan-text text-[11px] tracking-[0.28em] uppercase font-semibold mb-6 inline-block hover:opacity-80 transition-opacity"
        >
          ← back to dinner
        </Link>
        <h1
          className="neon-title font-sans font-black uppercase text-5xl sm:text-6xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          all cocktails
        </h1>
        <p className="mt-4 text-[12px] neon-cyan-text tracking-[0.24em] uppercase">
          {allCocktails.length} drinks for every kind of evening
        </p>
      </header>

      <div className="relative z-10 w-full max-w-2xl grid gap-4">
        {allCocktails.map((cocktail) => (
          <section
            key={cocktail.id}
            className="neon-card neon-card--cyan rounded-2xl p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2
                  className="neon-cyan-text font-sans font-bold uppercase text-[22px] leading-tight"
                  style={{ letterSpacing: "0.04em" }}
                >
                  {cocktail.name}
                </h2>
                {cocktail.vibe && (
                  <p className="text-[#C49AB0] italic mt-2 text-sm">&ldquo;{cocktail.vibe}&rdquo;</p>
                )}
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
                  {cocktail.ingredients.map((ing, idx) => (
                    <li key={ing} className="flex items-baseline gap-2 text-[#F5E6F0]/80 text-[14px]">
                      <span className="text-[10px] font-bold tabular-nums text-[#5EEAD4] tracking-[0.1em]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
              {cocktail.moods && cocktail.moods.length > 0 && (
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  {cocktail.moods.map((mood) => (
                    <span
                      key={mood}
                      className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold tracking-[0.15em] uppercase ${moodColors[mood] ?? "bg-[#5EEAD4]/10 text-[#5EEAD4] border-[#5EEAD4]/40"}`}
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

      <footer className="relative z-10 mt-auto pt-14 pb-6 text-center flex flex-col items-center gap-3">
        <Link
          href="/dishes"
          className="neon-cyan-text text-[11px] tracking-[0.24em] uppercase font-semibold hover:opacity-80 transition-opacity"
        >
          ← see all dishes
        </Link>
        <Link
          href="/"
          className="neon-cyan-text text-[11px] tracking-[0.24em] uppercase font-semibold hover:opacity-80 transition-opacity"
        >
          back home →
        </Link>
      </footer>
    </main>
  );
}
