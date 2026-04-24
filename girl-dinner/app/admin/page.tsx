import Link from "next/link";
import { listItems } from "@/db/queries";
import DeleteButton from "./DeleteButton";

const moodColors: Record<string, string> = {
  soft: "bg-[#FF3D8B]/10 text-[#FF3D8B] border-[#FF3D8B]/40",
  feral: "bg-[#5EEAD4]/10 text-[#5EEAD4] border-[#5EEAD4]/40",
  fancy: "bg-[#FF3D8B]/10 text-[#FF3D8B] border-[#FF3D8B]/40",
  hungover: "bg-[#5EEAD4]/10 text-[#5EEAD4] border-[#5EEAD4]/40",
};

type Kind = "recipe" | "cocktail";

export const metadata = {
  title: "admin — girl dinner™",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind: rawKind } = await searchParams;
  const kind: Kind = rawKind === "cocktail" ? "cocktail" : "recipe";

  const items = await listItems(kind, "new");

  return (
    <main className="interior-bg relative min-h-screen flex flex-col items-center px-6 py-16 font-sans">
      <div className="relative z-10 w-full max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/"
              className="neon-cyan-text text-[11px] tracking-[0.28em] uppercase font-semibold hover:opacity-80 transition-opacity"
            >
              ← back to site
            </Link>
            <h1
              className="neon-title font-sans font-black uppercase text-4xl mt-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              admin
            </h1>
          </div>
          <Link
            href={`/admin/${kind}/new`}
            className="neon-button px-6 py-2.5 rounded-full text-[12px]"
          >
            + add {kind}
          </Link>
        </div>

        {/* Kind tabs */}
        <div className="flex gap-3 mb-6">
          {(["recipe", "cocktail"] as Kind[]).map((k) => (
            <Link
              key={k}
              href={`/admin?kind=${k}`}
              className={`text-[11px] uppercase tracking-[0.2em] font-semibold px-4 py-2 rounded-full border transition-all ${
                kind === k
                  ? "border-[#FF3D8B] text-[#FF3D8B] bg-[#FF3D8B]/10"
                  : "border-[#F5E6F0]/15 text-[#F5E6F0]/40 hover:text-[#F5E6F0]/70"
              }`}
            >
              {k}s
            </Link>
          ))}
        </div>

        <div className="grid gap-3">
          {items.map((item) => (
            <div key={item.id} className="neon-card rounded-2xl p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="neon-pink-text font-bold uppercase text-[15px]">{item.name}</span>
                  <span className="text-[10px] text-[#F5E6F0]/30 font-mono">{item.id}</span>
                  {(item.moods ?? []).map((mood) => (
                    <span
                      key={mood}
                      className={`text-[9px] px-2 py-0.5 rounded-full border font-semibold tracking-[0.12em] uppercase ${moodColors[mood] ?? "bg-[#FF3D8B]/10 text-[#FF3D8B] border-[#FF3D8B]/40"}`}
                    >
                      {mood}
                    </span>
                  ))}
                </div>
                {item.vibe && (
                  <p className="text-[#C49AB0] italic text-xs mt-1">&ldquo;{item.vibe}&rdquo;</p>
                )}
                <p className="text-[#F5E6F0]/40 text-xs mt-1">
                  {(item.ingredients as string[]).join(" · ")}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href={`/admin/${kind}/${item.id}/edit`}
                  className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#5EEAD4] hover:opacity-70 transition-opacity px-3 py-1.5 rounded-full border border-[#5EEAD4]/30 hover:border-[#5EEAD4]/60"
                >
                  edit
                </Link>
                <DeleteButton id={item.id} kind={kind} name={item.name} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
