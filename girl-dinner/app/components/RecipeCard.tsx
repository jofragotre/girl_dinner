import type { Recipe, Cocktail } from "@/lib/types";

interface RecipeCardProps {
  item: Recipe | Cocktail;
  label: string;
  emoji: string;
  dotColor: string;
  isShuffling: boolean;
  fridayMode?: boolean;
}

export default function RecipeCard({
  item,
  label,
  emoji,
  dotColor,
  isShuffling,
  fridayMode,
}: RecipeCardProps) {
  return (
    <section
      className={`card-lift bg-[#FDF8F5]/90 backdrop-blur-sm rounded-3xl p-8 border border-[rgba(128,0,64,0.08)] shadow-sm transition-all duration-200 ${
        isShuffling ? "animate-wiggle scale-[0.98] blur-[1px]" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{emoji}</span>
        <span className="text-xs uppercase tracking-[0.15em] text-mauve font-semibold">
          {label}
        </span>
        {fridayMode && (
          <span className="ml-auto text-xs px-2.5 py-0.5 rounded-full bg-gold/15 text-gold font-semibold tracking-wide border border-gold/25">
            friday pour 🥂
          </span>
        )}
      </div>
      <h2 className="font-serif italic font-semibold text-[32px] leading-tight text-wine mt-2">
        {item.name}
      </h2>
      {item.vibe && (
        <p className="text-dusty italic mt-2 text-sm">
          &ldquo;{item.vibe}&rdquo;
        </p>
      )}
      <ul className="mt-5 space-y-1.5">
        {item.ingredients.map((ingredient) => (
          <li key={ingredient} className="flex items-center gap-2 text-deep/80 text-base font-normal">
            <span
              className={`w-[6px] h-[6px] rounded-full inline-block flex-shrink-0 ${dotColor}`}
            />
            {fridayMode ? `${ingredient} ×2` : ingredient}
          </li>
        ))}
      </ul>
    </section>
  );
}
