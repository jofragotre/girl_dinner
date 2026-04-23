import type { CSSProperties } from "react";

type Layer = 1 | 2 | 3;

type Plant = {
  layer: Layer;
  fontSize: number;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  rotate: number;
  scaleX?: 1 | -1;
  swayAmp?: number;
  delay: number;
  duration?: number;
};

const LEAF = "🌿";

const plants: Plant[] = [
  // TL corner — leaning inward (down-right, toward center)
  // { layer: 1, fontSize: 480, top: -280, left: -280, rotate: 130, delay: 0, duration: 11 },
  // { layer: 2, fontSize: 290, top: -80, left: -60, rotate: 145, delay: -2, duration: 9 },
  // { layer: 3, fontSize: 200, top: -10, left: 50, rotate: 120, delay: -3, swayAmp: 3, duration: 7 },
  // { layer: 3, fontSize: 130, top: 0, left: 10, rotate: 160, delay: -6, swayAmp: 3.5, duration: 8 },

  // // TR corner — leaning inward (down-left), mirrored
  // { layer: 1, fontSize: 460, top: -260, right: -260, rotate: 215, scaleX: -1, delay: -1, duration: 12 },
  // { layer: 2, fontSize: 280, top: -90, right: -50, rotate: 230, scaleX: -1, delay: -4, duration: 10 },
  // { layer: 3, fontSize: 190, top: -10, right: 40, rotate: 200, scaleX: -1, delay: -5, swayAmp: 3, duration: 8 },
  // { layer: 3, fontSize: 130, top: 0, right: 30, rotate: 230, scaleX: -1, delay: -2.5, swayAmp: 3.5, duration: 9 },

  // Top edge — small hint
  //{ layer: 2, fontSize: 210, top: -70, left: "42%", rotate: 180, delay: -6, duration: 13 },

  // BL corner — lushest, rising up
  { layer: 1, fontSize: 520, bottom: -360, left: -260, rotate: -10, delay: -7, duration: 13 },
  { layer: 2, fontSize: 300, bottom: -160, left: -50, rotate: 20, delay: -2.5, duration: 10 },
  { layer: 2, fontSize: 240, bottom: -120, left: 170, rotate: -5, delay: -5.5, duration: 8 },
  { layer: 2, fontSize: 220, bottom: -120, left: 295, rotate: 10, delay: -1.5, swayAmp: 2.5, duration: 9 },
  
  // BR corner — rising up, mirrored
  { layer: 1, fontSize: 460, bottom: -360, right: -240, rotate: 20, scaleX: -1, delay: -3.5, duration: 12 },
  { layer: 2, fontSize: 280, bottom: -150, right: -40, rotate: -15, scaleX: -1, delay: -6.5, duration: 10 },
  { layer: 2, fontSize: 230, bottom: -100, right: 140, rotate: 10, scaleX: -1, delay: -2, duration: 9 },
  { layer: 2, fontSize: 210, bottom: -100, right: 280, rotate: -5, scaleX: -1, delay: -4.5, swayAmp: 3, duration: 9 },
  
  // Bottom edge — small hints
  { layer: 1, fontSize: 300, bottom: -190, right: "38%", rotate: 5, delay: -7.5, duration: 14 },
  { layer: 2, fontSize: 200, bottom: -170, left: "46%", rotate: -10, delay: -3, duration: 11 },
];

export default function JunglePlants() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {plants.map((p, i) => {
        const style: CSSProperties = {
          fontSize: `${p.fontSize}px`,
          top: p.top,
          left: p.left,
          right: p.right,
          bottom: p.bottom,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration ?? 10}s`,
          ["--base-rotate" as string]: `${p.rotate}deg`,
          ["--base-scale-x" as string]: p.scaleX ?? 1,
          ["--sway-amp" as string]: `${p.swayAmp ?? 2}deg`,
        };
        return (
          <span key={i} className={`jungle-plant jungle-layer-${p.layer}`} style={style}>
            {LEAF}
          </span>
        );
      })}
    </div>
  );
}
