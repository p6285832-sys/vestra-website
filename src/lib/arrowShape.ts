import * as THREE from "three";

const SHAFT_LENGTH = 4.2;
const SHAFT_HALF_WIDTH = 0.16;
const HEAD_LENGTH = 1.9;
const HEAD_HALF_WIDTH = 0.75;
const ANGLE = Math.PI / 4; // 45°, matching the logo's upward-right ascent

function rotate(u: number, v: number): [number, number] {
  const cos = Math.cos(ANGLE);
  const sin = Math.sin(ANGLE);
  return [u * cos - v * sin, u * sin + v * cos];
}

/** Samples one point uniformly within the arrow's silhouette (shaft + head), local frame. */
export function sampleArrowPoint(rand: () => number): [number, number] {
  const inHead = rand() < 0.42; // weight some density toward the head
  if (!inHead) {
    const u = rand() * SHAFT_LENGTH;
    const v = (rand() - 0.5) * 2 * SHAFT_HALF_WIDTH;
    return [u, v];
  }
  const u = SHAFT_LENGTH + rand() * HEAD_LENGTH;
  const frac = (u - SHAFT_LENGTH) / HEAD_LENGTH;
  const halfW = HEAD_HALF_WIDTH * (1 - frac);
  const v = (rand() - 0.5) * 2 * halfW;
  return [u, v];
}

/** Local silhouette point → world-space [x,y] offset from a center. */
export function arrowLocalToWorldOffset(u: number, v: number): [number, number] {
  return rotate(u, v);
}

/** Closed outline of the arrow silhouette, for a reinforcing line. */
export function getArrowOutline(center: THREE.Vector3): THREE.Vector3[] {
  const localPoints: [number, number][] = [
    [0, -SHAFT_HALF_WIDTH],
    [SHAFT_LENGTH, -SHAFT_HALF_WIDTH],
    [SHAFT_LENGTH, -HEAD_HALF_WIDTH],
    [SHAFT_LENGTH + HEAD_LENGTH, 0],
    [SHAFT_LENGTH, HEAD_HALF_WIDTH],
    [SHAFT_LENGTH, SHAFT_HALF_WIDTH],
    [0, SHAFT_HALF_WIDTH],
    [0, -SHAFT_HALF_WIDTH],
  ];
  return localPoints.map(([u, v]) => {
    const [dx, dy] = rotate(u, v);
    return new THREE.Vector3(center.x + dx, center.y + dy, center.z);
  });
}
