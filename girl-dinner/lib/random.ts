import type { Mood, Recipe, Cocktail } from "./types";

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickFiltered<T extends Recipe | Cocktail>(
  arr: T[],
  moods: Mood[],
): T | null {
  if (moods.length === 0) return pick(arr);
  const filtered = arr.filter(
    (item) => item.moods && moods.some((m) => item.moods!.includes(m)),
  );
  return filtered.length > 0 ? pick(filtered) : null;
}
