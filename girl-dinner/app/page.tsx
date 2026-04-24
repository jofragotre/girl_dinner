import { listItems } from "@/db/queries";
import subtitles from "@/data/subtitles.json";
import type { Recipe, Cocktail } from "@/lib/types";
import HomeClient from "./home-client";

export default async function Home() {
  const [rawRecipes, rawCocktails] = await Promise.all([
    listItems("recipe"),
    listItems("cocktail"),
  ]);

  const allRecipes = rawRecipes.map((r) => ({
    id: r.id,
    name: r.name,
    vibe: r.vibe ?? "",
    ingredients: r.ingredients as string[],
    moods: (r.moods ?? []) as Recipe["moods"],
    score: r.score,
  })) satisfies Recipe[];

  const allCocktails = rawCocktails.map((c) => ({
    id: c.id,
    name: c.name,
    vibe: c.vibe ?? undefined,
    ingredients: c.ingredients as string[],
    moods: (c.moods ?? []) as Cocktail["moods"],
    score: c.score,
  })) satisfies Cocktail[];

  return (
    <HomeClient
      allRecipes={allRecipes}
      allCocktails={allCocktails}
      subtitles={subtitles}
    />
  );
}
