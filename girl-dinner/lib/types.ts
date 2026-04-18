export type Mood = "soft" | "feral" | "dissociating" | "fancy" | "hungover";

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  vibe: string;
  moods?: Mood[];
}

export interface Cocktail {
  id: string;
  name: string;
  ingredients: string[];
  vibe?: string;
  moods?: Mood[];
}
