import * as THREE from "three";

let starCache: THREE.Texture | null = null;

/**
 * A crisp point sprite: tiny bright core, steep fast falloff.
 * Reads as a precise financial data-point, not a soft nebula blob.
 */
export function getStarTexture(): THREE.Texture {
  if (starCache) return starCache;

  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const c = size / 2;
  const gradient = ctx.createRadialGradient(c, c, 0, c, c, c);
  // Tight core plateau only to 15%, then steep falloff → sharp data-point look
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.15, "rgba(255,255,255,1)");
  gradient.addColorStop(0.45, "rgba(255,255,255,0.28)");
  gradient.addColorStop(0.75, "rgba(255,255,255,0.04)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  starCache = texture;
  return texture;
}
