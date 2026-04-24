import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { listItems, getUserVotes } from "@/db/queries";
import type { Cocktail } from "@/lib/types";
import JunglePlants from "../components/JunglePlants";
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
  title: "all cocktails — girl dinner™",
  description: "every sip this bar has to offer",
};

export default async function CocktailsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort: rawSort } = await searchParams;
  const sort: Sort = (rawSort as Sort) || "score";

  const { userId } = await auth();
  const [rows, userVotesMap] = await Promise.all([
    listItems("cocktail", sort),
    userId ? getUserVotes(userId) : Promise.resolve(new Map<string, number>()),
  ]);

  const cocktails = rows.map((c) => ({
    id: c.id,
    name: c.name,
    vibe: c.vibe ?? undefined,
    ingredients: c.ingredients as string[],
    moods: (c.moods ?? []) as Cocktail["moods"],
    score: c.score,
  }));

  return (
    <main className="interior-bg relative min-h-screen flex flex-col items-center px-6 py-16 font-sans overflow-hidden">
      <JunglePlants />

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
          all cocktails
        </h1>
        <p className="mt-4 text-[12px] neon-cyan-text tracking-[0.24em] uppercase">
          {cocktails.length} drinks for every kind of evening
        </p>
      </header>

      {/* Sort controls */}
      <div className="relative z-10 flex gap-3 mb-8">
        {sortOptions.map((opt) => (
          <Link
            key={opt.value}
            href={`/cocktails?sort=${opt.value}`}
            className={`text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1.5 rounded-full border transition-all ${
              sort === opt.value
                ? "border-[#5EEAD4] text-[#5EEAD4] bg-[#5EEAD4]/10"
                : "border-[#F5E6F0]/15 text-[#F5E6F0]/40 hover:text-[#F5E6F0]/70"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl grid gap-4">
        {cocktails.map((cocktail) => (
          <section key={cocktail.id} className="neon-card neon-card--cyan rounded-2xl p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h2
                    className="neon-cyan-text font-sans font-bold uppercase text-[22px] leading-tight"
                    style={{ letterSpacing: "0.04em" }}
                  >
                    {cocktail.name}
                  </h2>
                  <VoteButtons
                    itemId={cocktail.id}
                    initialScore={cocktail.score ?? 0}
                    initialUserVote={userVotesMap.get(cocktail.id) ?? 0}
                    accent="cyan"
                  />
                </div>
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
