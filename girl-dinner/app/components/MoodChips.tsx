"use client";

import type { Mood } from "@/lib/types";

const MOODS: { value: Mood | "any"; label: string }[] = [
  { value: "any", label: "any \u2728" },
  { value: "soft", label: "soft \uD83E\uDD7A" },
  { value: "feral", label: "feral \uD83D\uDE08" },
  { value: "dissociating", label: "dissociating \uD83D\uDC7B" },
  { value: "fancy", label: "fancy \uD83D\uDC85" },
  { value: "hungover", label: "hungover \uD83E\uDDC3" },
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
            className={`px-3.5 py-1.5 rounded-full text-sm transition-all duration-200 cursor-pointer border ${
              isActive
                ? "bg-wine text-white border-wine shadow-sm"
                : "bg-white/50 text-deep/70 border-rose/30 hover:bg-white/80 hover:border-rose"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
