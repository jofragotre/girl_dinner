"use client";

import { useCallback, useState } from "react";
import type { Recipe, Cocktail } from "@/lib/types";

interface ShareCardProps {
  dinner: Recipe;
  drink: Cocktail;
}

const W = 540;
const H = 960;

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

interface Section {
  emoji: string;
  label: string;
  name: string;
  vibe?: string;
  ingredients: string[];
  dotColor: string;
  maxItems: number;
}

function drawCard(
  ctx: CanvasRenderingContext2D,
  startY: number,
  s: Section
): number {
  const cardX = 32;
  const cardW = W - cardX * 2;
  const pad = 28;
  const contentX = cardX + pad;
  const contentW = cardW - pad * 2;

  // Measure wrapped title
  ctx.font = "italic 600 32px 'Playfair Display'";
  const nameLines = wrapText(ctx, s.name, contentW).slice(0, 2);
  const nameBlockH = nameLines.length * 40;

  const items = s.ingredients.slice(0, s.maxItems);
  const vibeBlockH = s.vibe ? 32 : 0;

  const cardH = pad + 24 + 14 + nameBlockH + vibeBlockH + 18 + items.length * 30 + pad;

  // Card fill + subtle border
  ctx.fillStyle = "rgba(253, 248, 245, 0.94)";
  ctx.strokeStyle = "rgba(128, 0, 64, 0.10)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX, startY, cardW, cardH, 28);
  ctx.fill();
  ctx.stroke();

  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  let y = startY + pad;

  // Eyebrow: emoji + uppercase label
  ctx.font = "18px 'DM Sans'";
  ctx.fillStyle = "#8B2252";
  ctx.letterSpacing = "0px";
  const emojiW = ctx.measureText(s.emoji).width;
  ctx.fillText(s.emoji, contentX, y - 2);

  ctx.font = "600 11px 'DM Sans'";
  ctx.fillStyle = "#B87FC6";
  ctx.letterSpacing = "1.6px";
  ctx.fillText(s.label.toUpperCase(), contentX + emojiW + 10, y + 4);
  ctx.letterSpacing = "0px";
  y += 24 + 14;

  // Title
  ctx.font = "italic 600 32px 'Playfair Display'";
  ctx.fillStyle = "#8B2252";
  for (const line of nameLines) {
    ctx.fillText(line, contentX, y);
    y += 40;
  }

  // Vibe
  if (s.vibe) {
    y += 8;
    ctx.font = "italic 14px 'DM Sans'";
    ctx.fillStyle = "#B87A85";
    ctx.fillText(`"${s.vibe}"`, contentX, y);
    y += 24;
  }

  y += 18;

  // Ingredients
  ctx.font = "16px 'DM Sans'";
  for (const ing of items) {
    ctx.beginPath();
    ctx.arc(contentX + 3, y + 10, 3, 0, Math.PI * 2);
    ctx.fillStyle = s.dotColor;
    ctx.fill();
    ctx.fillStyle = "rgba(61, 31, 46, 0.80)";
    ctx.fillText(ing, contentX + 16, y);
    y += 30;
  }

  return startY + cardH;
}

async function buildCard(dinner: Recipe, drink: Cocktail): Promise<string> {
  await document.fonts.load("italic 700 52px 'Playfair Display'");
  await document.fonts.load("italic 600 32px 'Playfair Display'");
  await document.fonts.load("600 11px 'DM Sans'");
  await document.fonts.load("16px 'DM Sans'");
  await document.fonts.load("italic 14px 'DM Sans'");

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Background gradient (unchanged pink wash)
  const bg = ctx.createLinearGradient(0, 0, W * 0.7, H);
  bg.addColorStop(0, "#FFF0F5");
  bg.addColorStop(0.35, "#F8E3F0");
  bg.addColorStop(0.7, "#EEE0F5");
  bg.addColorStop(1, "#FFF5F8");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Blob top-right
  const b1 = ctx.createRadialGradient(W - 40, 60, 0, W - 40, 60, 280);
  b1.addColorStop(0, "rgba(255, 210, 228, 0.6)");
  b1.addColorStop(1, "rgba(255, 210, 228, 0)");
  ctx.fillStyle = b1;
  ctx.fillRect(0, 0, W, H);

  // Blob bottom-left
  const b2 = ctx.createRadialGradient(60, H - 80, 0, 60, H - 80, 240);
  b2.addColorStop(0, "rgba(234, 210, 248, 0.5)");
  b2.addColorStop(1, "rgba(234, 210, 248, 0)");
  ctx.fillStyle = b2;
  ctx.fillRect(0, 0, W, H);

  // Logo (matches hero treatment: serif italic bold)
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";
  ctx.font = "italic 700 52px 'Playfair Display'";
  ctx.fillStyle = "#8B2252";
  ctx.fillText("girl dinner™", W / 2, 100);

  // Two cards stacked vertically
  let y = 140;
  y = drawCard(ctx, y, {
    emoji: "🍝",
    label: "tonight's dinner",
    name: dinner.name,
    vibe: dinner.vibe,
    ingredients: dinner.ingredients,
    dotColor: "#E8829F",
    maxItems: 5,
  });
  y += 18;
  drawCard(ctx, y, {
    emoji: "🍸",
    label: "pair with",
    name: drink.name,
    vibe: drink.vibe,
    ingredients: drink.ingredients,
    dotColor: "#B87FC6",
    maxItems: 4,
  });

  // Footer
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";
  ctx.font = "13px 'DM Sans'";
  ctx.fillStyle = "rgba(139, 34, 82, 0.5)";
  ctx.fillText("made with girl dinner™", W / 2, H - 32);

  return canvas.toDataURL("image/png");
}

export default function ShareCard({ dinner, drink }: ShareCardProps) {
  const [open, setOpen] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    setLoading(true);
    setOpen(true);
    setDataUrl(null);
    const url = await buildCard(dinner, drink);
    setDataUrl(url);
    setLoading(false);
  }, [dinner, drink]);

  const download = useCallback(() => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "girl-dinner-story.png";
    a.click();
  }, [dataUrl]);

  return (
    <>
      <button
        onClick={generate}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-wine/75
                   bg-petal/60 border border-rose/20 hover:bg-petal hover:text-wine hover:border-rose/40
                   transition-colors duration-150 cursor-pointer"
      >
        share story 📸
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep/25 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-2xl w-full max-w-xs flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif italic text-xl text-wine">your story card</h3>

            <div className="w-full rounded-2xl overflow-hidden shadow-md bg-blush" style={{ aspectRatio: "9/16" }}>
              {loading && (
                <div className="w-full h-full flex items-center justify-center min-h-40">
                  <span className="text-dusty text-sm">generating...</span>
                </div>
              )}
              {!loading && dataUrl && (
                <img src={dataUrl} alt="story card preview" className="w-full h-full object-cover" />
              )}
            </div>

            <p className="text-xs text-dusty/60 text-center -mt-1">
              save to camera roll, then post as an instagram story
            </p>

            <button
              onClick={download}
              disabled={!dataUrl}
              className="w-full py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-rose via-mauve to-rose shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-40 cursor-pointer"
            >
              download png
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-dusty/60 hover:text-dusty transition-colors duration-150 cursor-pointer -mt-1"
            >
              close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
