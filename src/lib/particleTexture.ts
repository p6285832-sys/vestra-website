import * as THREE from "three";

let starCache: THREE.Texture | null = null;

/**
 * A crisp point sprite: small bright core, tight fast falloff.
 * Reads as a fine star/data-point, not a soft blur.
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
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.32, "rgba(255,255,255,1)");
  gradient.addColorStop(0.6, "rgba(255,255,255,0.35)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  starCache = texture;
  return texture;
}
