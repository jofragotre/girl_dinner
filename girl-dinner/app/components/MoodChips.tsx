"use client";

import type { Mood } from "@/lib/types";

const MOODS: { value: Mood | "any"; label: string }[] = [
  { value: "any", label: "any ✨" },
  { value: "soft", label: "soft 🥺" },
  { value: "feral", label: "feral 😈" },
  { value: "fancy", label: "fancy 💅" },
  { value: "hungover", label: "hungover 🧃" },
];

interface MoodChipsProps {
  selected: Mood[];
  onChange: (moods: Mood[]) => void;
}

export default function MoodChips({ selected, onChange }: MoodChipsProps) {
  const toggle = (mood: Mood | "any") => {
    if (mood === "any") {
      onChange([]);
      return;
    }
    const next = selected.includes(mood)
      ? selected.filter((m) => m !== mood)
      : [...selected, mood];
    onChange(next);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {MOODS.map(({ value, label }) => {
        const isActive =
          value === "any" ? selected.length === 0 : selected.includes(value as Mood);
        return (
          <button
            key={value}
            onClick={() => toggle(value)}
            className={`neon-pill ${isActive ? "neon-pill--active" : ""} px-4 py-1.5 rounded-full text-sm cursor-pointer tracking-wide lowercase`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
