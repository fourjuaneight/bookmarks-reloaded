import { Buffer } from "node:buffer";
import { randomInt } from "node:crypto";
import type { CSSProperties, JSX } from "react";

const DEFAULT_SIZE = 64;
const MAX_SEED = 10_000;

// Embed the generated SVG as a data URI so we can style it with regular CSS.
const svgToDataUri = (svg: string): string => {
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
};

// Produce a lightweight SVG that renders fractal noise using a filter.
const createNoiseSvg = (size: number, seed: number): string => `
  <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' preserveAspectRatio='none'>
    <filter id='noise-${seed}'>
      <feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch' seed='${seed}' />
    </filter>
    <rect width='100%' height='100%' filter='url(#noise-${seed})' />
  </svg>
`;

type NoiseBackgroundProps = {
  size?: number;
  seed?: number;
};

export default function NoiseBackground({
  size = DEFAULT_SIZE,
  seed,
}: NoiseBackgroundProps): JSX.Element {
  // Clamp invalid input before handing it to the SVG renderer.
  const safeSize = Number.isFinite(size) && size > 0 ? Math.floor(size) : DEFAULT_SIZE;
  // Allow seeded renders for deterministic screenshots, falling back to a random value once.
  const noiseSeed = seed ?? randomInt(MAX_SEED);
  // Generate the noise SVG and encode it once per render.
  const backgroundSvg = createNoiseSvg(safeSize, noiseSeed);
  const backgroundImage = svgToDataUri(backgroundSvg);

  const style: CSSProperties = {
    // Feed the encoded SVG into a CSS background so it can animate with Tailwind classes.
    backgroundImage: `url('${backgroundImage}')`,
  };

  return <div className="noise absolute duration-1000 ease-in-out inset-x-0 inset-y-0 pointer-events-none transition-opacity w-full z-20" style={style} aria-hidden="true" />;
}
