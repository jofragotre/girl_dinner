import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { listItems, getUserVotes } from "@/db/queries";
import type { Recipe } from "@/lib/types";
import VoteButtons from "../components/VoteButtons";

const moodColors: Record<string, string> = {
  soft: "bg-[#FF3D8B]/10 text-[#FF3D8B] border-[#FF3D8B]/40",
  feral: "bg-[#5EEAD4]/10 text-[#5EEAD4] border-[#5EEAD4]/40",
  fancy: "bg-[#FF3D8B]/10 text-[#FF3D8B] border-[#FF3D8B]/40",
  hungover: "bg-[#5EEAD4]/10 text-[#5EEAD4] border-[#5EEAD4]/40",
};

const sortOptions = [
  { value: "score", label: "top rated" },
  { value: "new", label: "newest" },
  { value: "alpha", label: "a–z" },
] as const;

type Sort = (typeof sortOptions)[number]["value"];

export const metadata = {
  title: "all dishes — girl dinner™",
  description: "every meal this kitchen has to offer",
};

export default async function DishesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort: rawSort } = await searchParams;
  const sort: Sort = (rawSort as Sort) || "score";

  const { userId } = await auth();
  const [rows, userVotesMap] = await Promise.all([
    listItems("recipe", sort),
    userId ? getUserVotes(userId) : Promise.resolve(new Map<string, number>()),
  ]);

  const recipes = rows.map((r) => ({
    id: r.id,
    name: r.name,
    vibe: r.vibe ?? "",
    ingredients: r.ingredients as string[],
    moods: (r.moods ?? []) as Recipe["moods"],
    score: r.score,
  }));

  return (
    <main className="interior-bg relative min-h-screen flex flex-col items-center px-6 py-16 font-sans overflow-hidden">
      <header className="relative z-10 text-center mb-6">
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
          all dishes
        </h1>
        <p className="mt-4 text-[12px] neon-cyan-text tracking-[0.24em] uppercase">
          {recipes.length} ways to eat like a girl
        </p>
      </header>

      {/* Sort controls */}
      <div className="relative z-10 flex gap-3 mb-8">
        {sortOptions.map((opt) => (
          <Link
            key={opt.value}
            href={`/dishes?sort=${opt.value}`}
            className={`text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1.5 rounded-full border transition-all ${
              sort === opt.value
                ? "border-[#FF3D8B] text-[#FF3D8B] bg-[#FF3D8B]/10"
                : "border-[#F5E6F0]/15 text-[#F5E6F0]/40 hover:text-[#F5E6F0]/70"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl grid gap-4">
        {recipes.map((recipe) => (
          <section key={recipe.id} className="neon-card rounded-2xl p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h2
                    className="neon-pink-text font-sans font-bold uppercase text-[22px] leading-tight"
                    style={{ letterSpacing: "0.04em" }}
                  >
                    {recipe.name}
                  </h2>
                  <VoteButtons
                    itemId={recipe.id}
                    initialScore={recipe.score ?? 0}
                    initialUserVote={userVotesMap.get(recipe.id) ?? 0}
                    accent="pink"
                  />
                </div>
                {recipe.vibe && (
                  <p className="text-[#C49AB0] italic mt-2 text-sm">&ldquo;{recipe.vibe}&rdquo;</p>
                )}
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={ing} className="flex items-baseline gap-2 text-[#F5E6F0]/80 text-[14px]">
                      <span className="text-[10px] font-bold tabular-nums text-[#FF3D8B] tracking-[0.1em]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
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
                      className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold tracking-[0.15em] uppercase ${moodColors[mood] ?? "bg-[#FF3D8B]/10 text-[#FF3D8B] border-[#FF3D8B]/40"}`}
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
          href="/"
          className="neon-cyan-text text-[11px] tracking-[0.24em] uppercase font-semibold hover:opacity-80 transition-opacity"
        >
          ← back home
        </Link>
        <Link
          href="/cocktails"
          className="neon-cyan-text text-[11px] tracking-[0.24em] uppercase font-semibold hover:opacity-80 transition-opacity"
        >
          see all cocktails →
        </Link>
      </footer>
    </main>
  );
}
