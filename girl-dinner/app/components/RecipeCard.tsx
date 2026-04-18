import type { Recipe, Cocktail } from "@/lib/types";

interface RecipeCardProps {
  item: Recipe | Cocktail;
  label: string;
  emoji: string;
  dotColor: string;
  borderColor: string;
  isShuffling: boolean;
}

export default function RecipeCard({
  item,
  label,
  emoji,
  dotColor,
  borderColor,
  isShuffling,
}: RecipeCardProps) {
  return (
    <section
      className={`bg-white/60 backdrop-blur-sm rounded-2xl p-8 border shadow-sm transition-all duration-200 ${borderColor} ${
        isShuffling ? "animate-wiggle scale-[0.98] blur-[1px]" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{emoji}</span>
        <span className="text-xs uppercase tracking-[0.2em] text-mauve font-semibold">
          {label}
        </span>
      </div>
      <h2 className="font-serif text-3xl italic text-wine mt-2">{item.name}</h2>
      {item.vibe && (
        <p className="text-dusty italic mt-1 text-sm">
          &ldquo;{item.vibe}&rdquo;
        </p>
      )}
      <ul className="mt-4 space-y-1.5">
        {item.ingredients.map((ingredient) => (
          <li key={ingredient} className="flex items-center gap-2 text-deep/80">
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block flex-shrink-0 ${dotColor}`}
            />
            {ingredient}
          </li>
        ))}
      </ul>
    </section>
  );
}
