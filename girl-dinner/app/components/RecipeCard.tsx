import type { Recipe, Cocktail } from "@/lib/types";

interface RecipeCardProps {
  item: Recipe | Cocktail;
  label: string;
  emoji: string;
  accent: "pink" | "cyan";
  isShuffling: boolean;
  fridayMode?: boolean;
}

export default function RecipeCard({
  item,
  label,
  emoji,
  accent,
  isShuffling,
  fridayMode,
}: RecipeCardProps) {
  const isCyan = accent === "cyan";
  const accentTextClass = isCyan ? "neon-cyan-text" : "neon-pink-text";
  const cardAccentClass = isCyan ? "neon-card--cyan" : "";
  const numberColor = isCyan ? "text-[#5EEAD4]" : "text-[#FF3D8B]";
  const fridayPillClass = isCyan
    ? "border-[#5EEAD4]/50 text-[#5EEAD4]"
    : "border-[#FF3D8B]/50 text-[#FF3D8B]";

  return (
    <section
      className={`neon-card ${cardAccentClass} rounded-2xl p-8 ${
        isShuffling ? "animate-wiggle scale-[0.98] blur-[1px]" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{emoji}</span>
        <span
          className={`text-[11px] uppercase tracking-[0.28em] font-semibold ${accentTextClass}`}
        >
          {label}
        </span>
        {fridayMode && (
          <span
            className={`ml-auto text-[10px] px-2.5 py-0.5 rounded-full bg-black/30 font-semibold tracking-[0.18em] uppercase border ${fridayPillClass}`}
          >
            friday pour
          </span>
        )}
      </div>
      <h2
        className={`font-sans font-bold uppercase text-[26px] leading-[1.1] ${accentTextClass} mt-1`}
        style={{ letterSpacing: "0.04em" }}
      >
        {item.name}
      </h2>
      {item.vibe && (
        <p className="text-[#C49AB0] italic mt-3 text-sm leading-relaxed">
          &ldquo;{item.vibe}&rdquo;
        </p>
      )}
      <ul className="mt-6 space-y-2.5">
        {item.ingredients.map((ingredient, idx) => (
          <li
            key={ingredient}
            className="flex items-baseline gap-3 text-[#F5E6F0]/85 text-[15px] font-normal"
          >
            <span
              className={`font-sans font-bold text-[11px] tracking-[0.1em] tabular-nums ${numberColor} flex-shrink-0 w-6`}
            >
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span>{fridayMode ? `${ingredient} ×2` : ingredient}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
