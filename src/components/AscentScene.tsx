"use client";

/**
 * This file intentionally mutates typed-array buffers directly inside
 * useFrame (react-three-fiber's per-frame render loop), rather than going
 * through React state. This is the standard, documented R3F pattern for
 * animating WebGL geometry at 60fps — routing per-frame position updates
 * through setState would force a full React re-render every frame, which
 * defeats the purpose. React Compiler's purity/immutability rules assume
 * useMemo/useRef values are never mutated after render, which conflicts
 * with this pattern; disabled below for that reason.
 */
/* eslint-disable react-hooks/refs */

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import type { Line2 } from "three-stdlib";
import { scrollState } from "@/lib/scrollProgress";
import { getStarTexture } from "@/lib/particleTexture";
import { mulberry32 } from "@/lib/prng";
import { sampleArrowPoint, arrowLocalToWorldOffset, getArrowOutline } from "@/lib/arrowShape";

const WHITE = new THREE.Color("#ffffff");
const SILVERBLUE = new THREE.Color("#93c5fd");
const BLUE = new THREE.Color("#3b82f6");

const COUNT = typeof window !== "undefined" && window.innerWidth < 768 ? 220 : 420;
const NODE_FRACTION = 0.2;
const EDGES_PER_NODE = 2;

const CONTROL_POINTS: [number, number, number][] = [
  [-9, -4.5, -6],
  [-6.5, -3.2, -4],
  [-4.5, -3.8, -3],
  [-2.5, -1.4, -2],
  [-0.6, -2.1, -1],
  [1.2, 0.4, 0],
  [3, -0.3, 1],
  [4.8, 2, 2],
  [6.6, 1.3, 3],
  [8.4, 4.2, 4],
  [10.2, 3.6, 5],
  [12, 6.4, 6],
];

const CONVERGE_CENTER = new THREE.Vector3(9.5, 4.5, 3.5);

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function getFormationWeights(p: number) {
  const scatterDown = 1 - smoothstep(0.28, 0.5, p);
  const convergeUp = smoothstep(0.78, 0.97, p);
  const trajectoryRaw = smoothstep(0.28, 0.5, p) * (1 - smoothstep(0.78, 0.97, p));

  let w1 = scatterDown;
  let w2 = trajectoryRaw;
  let w3 = convergeUp;
  const sum = w1 + w2 + w3 || 1;
  w1 /= sum;
  w2 /= sum;
  w3 /= sum;
  return { w1, w2, w3 };
}

function useAscentCurve() {
  return useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        CONTROL_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
        false,
        "catmullrom",
        0.2
      ),
    []
  );
}

function useParticleData() {
  const curve = useAscentCurve();

  return useMemo(() => {
    const rand = mulberry32(4242);
    const scatter: THREE.Vector3[] = [];
    const trajectory: THREE.Vector3[] = [];
    const converge: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];
    const phases: number[] = [];
    // Per-particle base sizes for varied point sizes
    const baseSizes: number[] = [];

    for (let i = 0; i < COUNT; i++) {
      scatter.push(
        new THREE.Vector3(
          (rand() - 0.5) * 30,
          (rand() - 0.5) * 18,
          (rand() - 0.5) * 20 - 3
        )
      );

      const t = THREE.MathUtils.clamp(i / COUNT + (rand() - 0.5) * 0.03, 0, 1);
      const base = curve.getPointAt(t);
      const jitter = new THREE.Vector3(
        (rand() - 0.5) * 0.9,
        (rand() - 0.5) * 0.9,
        (rand() - 0.5) * 1.4
      );
      trajectory.push(base.clone().add(jitter));

      const [u, v] = sampleArrowPoint(rand);
      const [dx, dy] = arrowLocalToWorldOffset(u, v);
      converge.push(
        new THREE.Vector3(
          CONVERGE_CENTER.x + dx,
          CONVERGE_CENTER.y + dy,
          CONVERGE_CENTER.z + (rand() - 0.5) * 0.6
        )
      );

      const roll = rand();
      colors.push(roll > 0.66 ? WHITE : roll > 0.33 ? SILVERBLUE : BLUE);
      phases.push(rand() * Math.PI * 2);
      // Vary base size slightly per particle: 0.12–0.22
      baseSizes.push(0.12 + rand() * 0.10);
    }

    const nodeIndices: number[] = [];
    for (let i = 0; i < COUNT; i++) {
      if (rand() < NODE_FRACTION) nodeIndices.push(i);
    }

    // Only connect nodes that are genuinely close together — without this
    // cutoff, "nearest neighbor" in a sparse cloud can still be far away,
    // producing long lines that stretch across the whole screen instead of
    // small local clusters. This was the cause of the busy mesh look.
    const MAX_CONNECTION_DISTANCE = 3.2;

    const edges: [number, number][] = [];
    for (const a of nodeIndices) {
      const dists = nodeIndices
        .filter((b) => b !== a)
        .map((b) => ({ b, d: scatter[a].distanceTo(scatter[b]) }))
        .filter(({ d }) => d < MAX_CONNECTION_DISTANCE)
        .sort((x, y) => x.d - y.d)
        .slice(0, EDGES_PER_NODE);
      for (const { b } of dists) {
        const key: [number, number] = a < b ? [a, b] : [b, a];
        if (!edges.some(([x, y]) => x === key[0] && y === key[1])) {
          edges.push(key);
        }
      }
    }

    return { scatter, trajectory, converge, colors, phases, baseSizes, edges };
  }, [curve]);
}

// Writes the current scene look-target into `out` (caller-provided,
// reused every frame) instead of allocating a new Vector3 each call —
// this runs inside useFrame for two separate components every frame.
function computeSceneLookTarget(p: number, out: THREE.Vector3) {
  const { w2, w3 } = getFormationWeights(p);
  const tp = smoothstep(0.28, 0.5, p) * (1 - smoothstep(0.78, 1, p));
  const trajX = -6 + tp * 12;
  const trajY = -1 + tp * 5.5;
  out.set(
    (trajX + 3) * w2 + CONVERGE_CENTER.x * w3,
    (trajY + 0.6) * w2 + CONVERGE_CENTER.y * w3,
    CONVERGE_CENTER.z * w3
  );
  return out;
}

function ParticleNetwork() {
  const { scatter, trajectory, converge, colors, phases, baseSizes, edges } = useParticleData();
  const texture = useMemo(() => getStarTexture(), []);
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);

  const posArray = useRef<Float32Array>(new Float32Array(COUNT * 3)).current;
  const colorArray = useRef<Float32Array>(
    (() => {
      const arr = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        arr[i * 3] = colors[i].r;
        arr[i * 3 + 1] = colors[i].g;
        arr[i * 3 + 2] = colors[i].b;
      }
      return arr;
    })()
  ).current;

  // Per-particle sizes buffer — allows twinkling via size animation
  const sizeArray = useRef<Float32Array>(
    (() => {
      const arr = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) arr[i] = baseSizes[i];
      return arr;
    })()
  ).current;

  const edgePositions = useRef<Float32Array>(
    new Float32Array(edges.length * 2 * 3)
  ).current;

  const scrollVelocity = useRef(0);
  const prevProgress = useRef(0);
  const cursorWorld = useRef(new THREE.Vector3());
  const lookTargetScratch = useRef(new THREE.Vector3());

  useFrame((state) => {
    const p = scrollState.progress;
    const t = state.clock.getElapsedTime();

    const rawDelta = Math.abs(p - prevProgress.current);
    prevProgress.current = p;
    const targetVel = THREE.MathUtils.clamp(rawDelta * 40, 0, 1.6);
    scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, targetVel, 0.12);
    scrollState.velocity = scrollVelocity.current;

    const { w1, w2, w3 } = getFormationWeights(p);

    const { pointer } = state;
    const lookTarget = computeSceneLookTarget(p, lookTargetScratch.current);
    cursorWorld.current.set(
      lookTarget.x + pointer.x * 5,
      lookTarget.y + pointer.y * 3.5,
      0
    );

    const positions = pointsRef.current?.geometry.attributes.position as
      | THREE.BufferAttribute
      | undefined;
    const sizes = pointsRef.current?.geometry.attributes.size as
      | THREE.BufferAttribute
      | undefined;

    for (let i = 0; i < COUNT; i++) {
      const homeX = scatter[i].x * w1 + trajectory[i].x * w2 + converge[i].x * w3;
      const homeY = scatter[i].y * w1 + trajectory[i].y * w2 + converge[i].y * w3;
      const homeZ = scatter[i].z * w1 + trajectory[i].z * w2 + converge[i].z * w3;

      const dx = homeX - cursorWorld.current.x;
      const dy = homeY - cursorWorld.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 3.2;
      let ox = homeX;
      let oy = homeY;
      if (dist < radius) {
        const pull = (1 - dist / radius) * 0.55 * (1 - w3 * 0.7);
        ox -= dx * pull * 0.3;
        oy -= dy * pull * 0.3;
      }

      const agitation = scrollVelocity.current * 0.14;
      ox += Math.sin(t * 1.4 + phases[i]) * agitation;
      oy += Math.cos(t * 1.7 + phases[i] * 1.3) * agitation;

      posArray[i * 3] = ox;
      posArray[i * 3 + 1] = oy;
      posArray[i * 3 + 2] = homeZ;

      // Twinkling: size oscillates ±20% of base using phase offset
      // Frequency varies slightly per particle for organic feel
      const twinkle = 0.80 + 0.20 * Math.sin(t * (1.1 + phases[i] * 0.08) + phases[i]);
      sizeArray[i] = baseSizes[i] * twinkle;
    }

    if (positions) positions.needsUpdate = true;
    if (sizes) sizes.needsUpdate = true;

    // Use plain for-loop instead of forEach — avoids closure allocation every frame
    for (let idx = 0; idx < edges.length; idx++) {
      const a = edges[idx][0];
      const b = edges[idx][1];
      edgePositions[idx * 6]     = posArray[a * 3];
      edgePositions[idx * 6 + 1] = posArray[a * 3 + 1];
      edgePositions[idx * 6 + 2] = posArray[a * 3 + 2];
      edgePositions[idx * 6 + 3] = posArray[b * 3];
      edgePositions[idx * 6 + 4] = posArray[b * 3 + 1];
      edgePositions[idx * 6 + 5] = posArray[b * 3 + 2];
    }
    const edgeGeom = lineRef.current?.geometry;
    if (edgeGeom) {
      edgeGeom.attributes.position.needsUpdate = true;
    }

    if (lineMatRef.current) {
      const netOpacity = smoothstep(0.05, 0.24, p) * (1 - smoothstep(0.32, 0.48, p));
      lineMatRef.current.opacity = THREE.MathUtils.lerp(
        lineMatRef.current.opacity,
        netOpacity * 0.32,
        0.1
      );
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.008 * (1 - w3);
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[posArray, 3]} />
          <bufferAttribute attach="attributes-color" args={[colorArray, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizeArray, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.17}
          map={texture}
          vertexColors
          transparent
          opacity={0.92}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMatRef}
          color={"#6f8fff"}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

function ArrowReinforcement() {
  const outline = useMemo(() => getArrowOutline(CONVERGE_CENTER), []);
  const lineRef = useRef<Line2 | null>(null);

  useFrame(() => {
    const p = scrollState.progress;
    const opacity = smoothstep(0.82, 0.98, p) * 0.7;
    const mat = lineRef.current?.material as THREE.LineBasicMaterial | undefined;
    if (mat) {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, opacity, 0.08);
    }
  });

  return (
    <Line
      ref={lineRef}
      points={outline}
      color={"#ffffff"}
      lineWidth={1.6}
      transparent
      opacity={0}
      toneMapped={false}
    />
  );
}

function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  const lookTargetScratch = useRef(new THREE.Vector3());

  useFrame(() => {
    const p = scrollState.progress;
    const { w1, w2, w3 } = getFormationWeights(p);

    const tp = smoothstep(0.28, 0.5, p) * (1 - smoothstep(0.78, 1, p));
    const trajX = -6 + tp * 12;
    const trajY = -1 + tp * 5.5;

    // scatterPos = (0,0,15); trajectoryPos = (trajX,trajY,10.5);
    // convergePos = (CONVERGE_CENTER.x-2, CONVERGE_CENTER.y-1, CONVERGE_CENTER.z+8)
    target.current.set(
      trajX * w2 + (CONVERGE_CENTER.x - 2) * w3,
      trajY * w2 + (CONVERGE_CENTER.y - 1) * w3,
      15 * w1 + 10.5 * w2 + (CONVERGE_CENTER.z + 8) * w3
    );

    // Adaptive lerp: faster response when scrolling quickly, smoother at rest.
    // Clamped between 0.03 (idle) and 0.09 (fast scroll) for cinematic weight.
    const vel = scrollState.velocity ?? 0;
    const lerpFactor = THREE.MathUtils.clamp(0.03 + vel * 0.037, 0.03, 0.09);

    camera.position.lerp(target.current, lerpFactor);
    camera.lookAt(computeSceneLookTarget(p, lookTargetScratch.current));
  });

  return null;
}

export default function AscentScene() {
  return (
    <>
      <color attach="background" args={["#05070d"]} />
      {/* Extended fog depth: [18,40] vs original [16,36] — deeper atmospheric perspective */}
      <fog attach="fog" args={["#05070d", 18, 40]} />
      {/* Cool cobalt-tinted ambient light at 0.6 — premium, slightly cooler scene tone */}
      <ambientLight intensity={0.6} color={"#8ab4f8"} />
      <ParticleNetwork />
      <ArrowReinforcement />
      <CameraRig />
    </>
  );
}
