"use client";

import { useCallback, useState } from "react";
import type { Recipe, Cocktail } from "@/lib/types";

interface ShareCardProps {
  dinner: Recipe;
  drink: Cocktail;
  compact?: boolean;
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
  accent: string; // hex
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
  ctx.font = "700 26px 'Helvetica Neue', Helvetica, Inter, Arial, sans-serif";
  const upperName = s.name.toUpperCase();
  const nameLines = wrapText(ctx, upperName, contentW).slice(0, 2);
  const nameBlockH = nameLines.length * 32;

  const items = s.ingredients.slice(0, s.maxItems);
  const vibeBlockH = s.vibe ? 30 : 0;

  const cardH = pad + 22 + 16 + nameBlockH + vibeBlockH + 20 + items.length * 28 + pad;

  // Glassy dark fill with accent border + subtle neon glow
  // Outer glow
  ctx.save();
  ctx.shadowColor = s.accent;
  ctx.shadowBlur = 24;
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.strokeStyle = s.accent + "66"; // ~40% alpha
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX, startY, cardW, cardH, 22);
  ctx.fill();
  ctx.restore();
  // Glass overlay (no shadow) for crisp edge + stroke
  ctx.fillStyle = "rgba(13, 6, 18, 0.55)";
  ctx.beginPath();
  ctx.roundRect(cardX, startY, cardW, cardH, 22);
  ctx.fill();
  ctx.strokeStyle = s.accent + "66";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX, startY, cardW, cardH, 22);
  ctx.stroke();

  // Mirror top highlight
  const mirror = ctx.createLinearGradient(cardX, startY, cardX + cardW, startY);
  mirror.addColorStop(0, "rgba(255, 255, 255, 0)");
  mirror.addColorStop(0.5, "rgba(255, 255, 255, 0.4)");
  mirror.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.strokeStyle = mirror;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + cardW * 0.1, startY + 1);
  ctx.lineTo(cardX + cardW * 0.9, startY + 1);
  ctx.stroke();

  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  let y = startY + pad;

  // Eyebrow: emoji + uppercase label in accent
  ctx.font = "20px 'Helvetica Neue', Helvetica, Inter, Arial, sans-serif";
  const emojiW = ctx.measureText(s.emoji).width;
  ctx.fillText(s.emoji, contentX, y - 2);

  ctx.font = "700 10px 'Helvetica Neue', Helvetica, Inter, Arial, sans-serif";
  ctx.fillStyle = s.accent;
  ctx.letterSpacing = "2.2px";
  ctx.fillText(s.label.toUpperCase(), contentX + emojiW + 10, y + 5);
  ctx.letterSpacing = "0px";
  y += 22 + 16;

  // Title — uppercase helvetica bold with accent glow
  ctx.font = "700 26px 'Helvetica Neue', Helvetica, Inter, Arial, sans-serif";
  ctx.save();
  ctx.shadowColor = s.accent;
  ctx.shadowBlur = 14;
  ctx.fillStyle = s.accent;
  for (const line of nameLines) {
    ctx.fillText(line, contentX, y);
    y += 32;
  }
  ctx.restore();

  // Vibe
  if (s.vibe) {
    y += 4;
    ctx.font = "italic 14px 'Helvetica Neue', Helvetica, Inter, Arial, sans-serif";
    ctx.fillStyle = "#C49AB0";
    ctx.fillText(`"${s.vibe}"`, contentX, y);
    y += 22;
  }

  y += 16;

  // Ingredients — numbered
  ctx.font = "15px 'Helvetica Neue', Helvetica, Inter, Arial, sans-serif";
  items.forEach((ing, idx) => {
    const num = String(idx + 1).padStart(2, "0");
    ctx.font = "700 11px 'Helvetica Neue', Helvetica, Inter, Arial, sans-serif";
    ctx.fillStyle = s.accent;
    ctx.fillText(num, contentX, y + 2);
    ctx.font = "15px 'Helvetica Neue', Helvetica, Inter, Arial, sans-serif";
    ctx.fillStyle = "rgba(245, 230, 240, 0.85)";
    ctx.fillText(ing, contentX + 28, y);
    y += 28;
  });

  return startY + cardH;
}

async function buildCard(dinner: Recipe, drink: Cocktail): Promise<string> {
  await document.fonts.load("900 62px 'Helvetica Neue'").catch(() => {});
  await document.fonts.load("700 26px 'Helvetica Neue'").catch(() => {});
  await document.fonts.load("italic 14px 'Helvetica Neue'").catch(() => {});
  await document.fonts.load("italic 24px 'Caveat'").catch(() => {});

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Background — dark plum to ink
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#1A0B1F");
  bg.addColorStop(1, "#0D0612");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Top neon exterior — pink radial glow
  const hero = ctx.createRadialGradient(W / 2, -40, 0, W / 2, -40, W);
  hero.addColorStop(0, "rgba(255, 61, 139, 0.95)");
  hero.addColorStop(0.35, "rgba(217, 30, 111, 0.55)");
  hero.addColorStop(0.75, "rgba(26, 11, 31, 0)");
  ctx.fillStyle = hero;
  ctx.fillRect(0, 0, W, 320);

  // Cyan accent blob bottom-right
  const accent = ctx.createRadialGradient(W - 40, H - 80, 0, W - 40, H - 80, 260);
  accent.addColorStop(0, "rgba(94, 234, 212, 0.25)");
  accent.addColorStop(1, "rgba(94, 234, 212, 0)");
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, W, H);

  // Logo — Helvetica black uppercase with neon pink glow
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";
  ctx.font = "900 56px 'Helvetica Neue', Helvetica, Inter, Arial, sans-serif";
  ctx.save();
  ctx.shadowColor = "#FF3D8B";
  ctx.shadowBlur = 26;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("GIRL DINNER", W / 2, 100);
  ctx.restore();
  // ™ in cyan, smaller, to the right
  const dinnerW = ctx.measureText("GIRL DINNER").width;
  ctx.font = "900 24px 'Helvetica Neue', Helvetica, Inter, Arial, sans-serif";
  ctx.save();
  ctx.shadowColor = "#5EEAD4";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#5EEAD4";
  ctx.textAlign = "left";
  ctx.fillText("™", W / 2 + dinnerW / 2 + 6, 76);
  ctx.restore();

  // Two cards stacked vertically
  let y = 160;
  y = drawCard(ctx, y, {
    emoji: "🍝",
    label: "tonight's dinner",
    name: dinner.name,
    vibe: dinner.vibe,
    ingredients: dinner.ingredients,
    accent: "#FF3D8B",
    maxItems: 5,
  });
  y += 18;
  drawCard(ctx, y, {
    emoji: "🍸",
    label: "pair with",
    name: drink.name,
    vibe: drink.vibe,
    ingredients: drink.ingredients,
    accent: "#5EEAD4",
    maxItems: 4,
  });

  // Footer
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";
  ctx.font = "700 11px 'Helvetica Neue', Helvetica, Inter, Arial, sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillStyle = "rgba(94, 234, 212, 0.6)";
  ctx.fillText("MADE WITH GIRL DINNER™", W / 2, H - 32);
  ctx.letterSpacing = "0px";

  return canvas.toDataURL("image/png");
}

export default function ShareCard({ dinner, drink, compact }: ShareCardProps) {
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
      {compact ? (
        <button
          onClick={generate}
          className="text-[#F5E6F0]/35 hover:text-[#F5E6F0]/70 transition-colors cursor-pointer text-xl"
          title="share your girl dinner"
        >
          📤
        </button>
      ) : (
        <button
          onClick={generate}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[12px] tracking-[0.2em] uppercase font-bold
                     bg-transparent border border-[#FF3D8B]/55 text-[#FF3D8B]
                     hover:border-[#FF3D8B] hover:text-white hover:shadow-[0_0_14px_rgba(255,61,139,0.4)]
                     transition-all duration-300 cursor-pointer"
          style={{ textShadow: "0 0 6px rgba(255, 61, 139, 0.45)" }}
        >
          share story ✦
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="neon-card rounded-2xl p-5 w-full max-w-xs flex flex-col items-center gap-4"
            style={{ background: "rgba(13, 6, 18, 0.9)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="neon-pink-text font-sans font-bold uppercase text-lg"
              style={{ letterSpacing: "0.12em" }}
            >
              your story card
            </h3>

            <div
              className="w-full rounded-xl overflow-hidden"
              style={{ aspectRatio: "9/16", background: "#0D0612", boxShadow: "0 0 24px rgba(255, 61, 139, 0.2)" }}
            >
              {loading && (
                <div className="w-full h-full flex items-center justify-center min-h-40">
                  <span className="text-[#C49AB0] text-sm tracking-wider uppercase">generating…</span>
                </div>
              )}
              {!loading && dataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={dataUrl} alt="story card preview" className="w-full h-full object-cover" />
              )}
            </div>

            <p className="text-[11px] text-[#C49AB0]/70 text-center -mt-1 tracking-wide">
              save to camera roll, then post as an instagram story
            </p>

            <button
              onClick={download}
              disabled={!dataUrl}
              className="neon-button w-full py-3 rounded-full text-[12px] disabled:opacity-40"
            >
              download png
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-[11px] text-[#F5E6F0]/50 hover:text-[#F5E6F0]/80 transition-colors cursor-pointer -mt-1 tracking-wider uppercase"
            >
              close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
