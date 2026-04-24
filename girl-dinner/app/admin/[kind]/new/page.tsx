import Link from "next/link";
import { createItemAction } from "@/app/actions/admin";

const MOODS = ["soft", "feral", "fancy", "hungover"] as const;

export default async function NewItemPage({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const { kind } = await params;
  const isRecipe = kind === "recipe";

  return (
    <main className="interior-bg relative min-h-screen flex flex-col items-center px-6 py-16 font-sans">
      <div className="relative z-10 w-full max-w-xl">
        <Link
          href={`/admin?kind=${kind}`}
          className="neon-cyan-text text-[11px] tracking-[0.28em] uppercase font-semibold mb-6 inline-block hover:opacity-80 transition-opacity"
        >
          ← back to admin
        </Link>
        <h1
          className="neon-title font-sans font-black uppercase text-3xl mb-8"
          style={{ letterSpacing: "-0.02em" }}
        >
          new {kind}
        </h1>

        <form action={createItemAction} className="flex flex-col gap-5">
          <input type="hidden" name="kind" value={kind} />

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#F5E6F0]/50 font-semibold">
              name *
            </span>
            <input
              name="name"
              required
              className="bg-black/40 border border-[#F5E6F0]/15 rounded-xl px-4 py-3 text-[#F5E6F0] text-sm focus:outline-none focus:border-[#FF3D8B]/50 placeholder:text-[#F5E6F0]/20"
              placeholder={isRecipe ? "e.g. pasta aglio e olio" : "e.g. negroni sbagliato"}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#F5E6F0]/50 font-semibold">
              vibe {isRecipe ? "*" : "(optional)"}
            </span>
            <input
              name="vibe"
              required={isRecipe}
              className="bg-black/40 border border-[#F5E6F0]/15 rounded-xl px-4 py-3 text-[#F5E6F0] text-sm focus:outline-none focus:border-[#FF3D8B]/50 placeholder:text-[#F5E6F0]/20"
              placeholder="one line about the vibe"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#F5E6F0]/50 font-semibold">
              ingredients * (one per line)
            </span>
            <textarea
              name="ingredients"
              required
              rows={6}
              className="bg-black/40 border border-[#F5E6F0]/15 rounded-xl px-4 py-3 text-[#F5E6F0] text-sm focus:outline-none focus:border-[#FF3D8B]/50 placeholder:text-[#F5E6F0]/20 resize-none"
              placeholder={"pasta\ngarlic\nolive oil\nparsley"}
            />
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-[10px] uppercase tracking-[0.2em] text-[#F5E6F0]/50 font-semibold mb-1">
              moods (optional)
            </legend>
            <div className="flex gap-3 flex-wrap">
              {MOODS.map((mood) => (
                <label key={mood} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="moods"
                    value={mood}
                    className="accent-[#FF3D8B]"
                  />
                  <span className="text-[11px] uppercase tracking-[0.15em] text-[#F5E6F0]/60 font-semibold">
                    {mood}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            className="neon-button px-8 py-3 rounded-full text-[12px] mt-2 self-start cursor-pointer"
          >
            save {kind}
          </button>
        </form>
      </div>
    </main>
  );
}
