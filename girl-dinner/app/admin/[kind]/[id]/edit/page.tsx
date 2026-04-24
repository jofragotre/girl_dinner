import Link from "next/link";
import { notFound } from "next/navigation";
import { getItem } from "@/db/queries";
import { updateItemAction } from "@/app/actions/admin";

const MOODS = ["soft", "feral", "fancy", "hungover"] as const;

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ kind: string; id: string }>;
}) {
  const { kind, id } = await params;
  const item = await getItem(id);

  if (!item || item.kind !== kind) notFound();

  const isRecipe = kind === "recipe";
  const currentMoods = item.moods ?? [];
  const ingredientsText = (item.ingredients as string[]).join("\n");

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
          className="neon-title font-sans font-black uppercase text-3xl mb-1"
          style={{ letterSpacing: "-0.02em" }}
        >
          edit {kind}
        </h1>
        <p className="text-[10px] font-mono text-[#F5E6F0]/25 mb-8">{item.id}</p>

        <form action={updateItemAction} className="flex flex-col gap-5">
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="kind" value={kind} />

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#F5E6F0]/50 font-semibold">
              name *
            </span>
            <input
              name="name"
              required
              defaultValue={item.name}
              className="bg-black/40 border border-[#F5E6F0]/15 rounded-xl px-4 py-3 text-[#F5E6F0] text-sm focus:outline-none focus:border-[#FF3D8B]/50"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#F5E6F0]/50 font-semibold">
              vibe {isRecipe ? "*" : "(optional)"}
            </span>
            <input
              name="vibe"
              required={isRecipe}
              defaultValue={item.vibe ?? ""}
              className="bg-black/40 border border-[#F5E6F0]/15 rounded-xl px-4 py-3 text-[#F5E6F0] text-sm focus:outline-none focus:border-[#FF3D8B]/50"
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
              defaultValue={ingredientsText}
              className="bg-black/40 border border-[#F5E6F0]/15 rounded-xl px-4 py-3 text-[#F5E6F0] text-sm focus:outline-none focus:border-[#FF3D8B]/50 resize-none"
            />
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-[10px] uppercase tracking-[0.2em] text-[#F5E6F0]/50 font-semibold mb-1">
              moods
            </legend>
            <div className="flex gap-3 flex-wrap">
              {MOODS.map((mood) => (
                <label key={mood} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="moods"
                    value={mood}
                    defaultChecked={currentMoods.includes(mood)}
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
            save changes
          </button>
        </form>
      </div>
    </main>
  );
}
