"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";

/* ---------------------------------------------------------------- */
/* Shared scroll + pointer state (refs so useFrame reads are cheap)  */
/* ---------------------------------------------------------------- */

function useScrollProgress() {
  const progress = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      progress.current = Math.min(1, Math.max(0, window.scrollY / max));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return progress;
}

function usePointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}

/* ---------------------------------------------------------------- */
/* Camera rig — walks forward through the forest as the page scrolls */
/* ---------------------------------------------------------------- */

const WALK_START = 10;
const WALK_END = -68;

function CameraRig() {
  const scroll = useScrollProgress();
  const pointer = usePointer();

  useFrame(({ camera }, delta) => {
    const p = scroll.current;
    const targetZ = WALK_START + (WALK_END - WALK_START) * p;
    // gentle serpentine path, like following a jungle track
    const targetX = Math.sin(p * Math.PI * 3) * 1.6;
    const targetY = 2.1 + Math.sin(p * Math.PI * 5) * 0.25;

    const k = 1 - Math.pow(0.001, delta); // framerate-independent lerp
    camera.position.z += (targetZ - camera.position.z) * k;
    camera.position.x += (targetX - camera.position.x) * k;
    camera.position.y += (targetY - camera.position.y) * k;

    const lookX = pointer.current.x * 0.08;
    const lookY = pointer.current.y * 0.05;
    camera.rotation.y += (-lookX - camera.rotation.y) * k;
    camera.rotation.x += (-lookY - camera.rotation.x) * k;
  });
  return null;
}

/* ---------------------------------------------------------------- */
/* Sky dome that follows the camera                                  */
/* ---------------------------------------------------------------- */

const skyVertex = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragment = /* glsl */ `
  varying vec3 vPos;
  void main() {
    float h = normalize(vPos).y;
    vec3 horizon = vec3(0.043, 0.11, 0.066);   // deep moss glow
    vec3 zenith  = vec3(0.008, 0.024, 0.016);  // near-black canopy night
    vec3 col = mix(horizon, zenith, smoothstep(-0.15, 0.55, h));
    // faint cool moonlight wash high in the sky
    col += vec3(0.02, 0.05, 0.045) * pow(max(h, 0.0), 2.0);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Sky() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ camera }) => {
    ref.current?.position.copy(camera.position);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[120, 24, 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        vertexShader={skyVertex}
        fragmentShader={skyFragment}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}

function Moon() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ camera }) => {
    if (!ref.current) return;
    ref.current.position.set(
      camera.position.x + 26,
      camera.position.y + 30,
      camera.position.z - 80,
    );
  });
  return (
    <mesh ref={ref}>
      <circleGeometry args={[4.5, 40]} />
      <meshBasicMaterial
        color="#cfe8d5"
        transparent
        opacity={0.85}
        fog={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ---------------------------------------------------------------- */
/* Procedural forest — instanced trunks + canopy blobs               */
/* ---------------------------------------------------------------- */

// deterministic PRNG so SSR/client render the same forest
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Merge transformed geometry parts into one non-indexed BufferGeometry
 * carrying per-vertex colors — lets a whole tree render as one instance.
 */
function mergeParts(
  parts: { geometry: THREE.BufferGeometry; color: THREE.Color; darkenBase?: boolean }[],
): THREE.BufferGeometry {
  const positions: number[] = [];
  const colors: number[] = [];
  for (const part of parts) {
    const geo = part.geometry.toNonIndexed();
    const pos = geo.getAttribute("position");
    geo.computeBoundingBox();
    const box = geo.boundingBox!;
    const span = Math.max(0.0001, box.max.y - box.min.y);
    for (let i = 0; i < pos.count; i++) {
      positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
      // darken undersides so crowns read as lit from the sky
      const t = part.darkenBase
        ? 0.55 + 0.45 * ((pos.getY(i) - box.min.y) / span)
        : 1;
      colors.push(part.color.r * t, part.color.g * t, part.color.b * t);
    }
    geo.dispose();
  }
  const merged = new THREE.BufferGeometry();
  merged.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  merged.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return merged;
}

/** Icosahedron with noise-displaced vertices — an irregular foliage clump. */
function foliageClump(rand: () => number, radius: number): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(radius, 2);
  const pos = geo.getAttribute("position");
  const seed = rand() * 100;
  // PolyhedronGeometry duplicates vertices per face, so displacement must be
  // a function of position (not vertex index) or the surface tears apart
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + seed) * 43758.5453;
    const n = 0.86 + 0.28 * (s - Math.floor(s));
    pos.setXYZ(i, x * n, y * n * 0.72, z * n);
  }
  return geo;
}

/**
 * Build one unit-height tree: a bending tapered trunk, a fan of angled
 * branches, and irregular foliage clumps at the branch tips — the flat,
 * umbrella-crowned look of Wilpattu's dry-zone giants.
 */
function buildTreeArchetype(rand: () => number): THREE.BufferGeometry {
  const parts: Parameters<typeof mergeParts>[0] = [];
  const barkColor = new THREE.Color(0.06, 0.052, 0.04);
  const up = new THREE.Vector3(0, 1, 0);

  // --- trunk: stacked tapered segments that drift off-vertical
  const segments = 4;
  const base = new THREE.Vector3(0, 0, 0);
  const dir = new THREE.Vector3(0, 1, 0);
  const trunkPoints: THREE.Vector3[] = [];
  let radius = 0.045 + rand() * 0.02;
  for (let s = 0; s < segments; s++) {
    const len = 0.16 + rand() * 0.08;
    const rTop = radius * (0.62 + rand() * 0.12);
    const seg = new THREE.CylinderGeometry(rTop, radius, len, 6, 1);
    seg.translate(0, len / 2, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
    seg.applyQuaternion(quat);
    seg.translate(base.x, base.y, base.z);
    parts.push({ geometry: seg, color: barkColor });
    base.addScaledVector(dir.clone().normalize(), len);
    trunkPoints.push(base.clone());
    dir.x += (rand() - 0.5) * 0.35;
    dir.z += (rand() - 0.5) * 0.35;
    radius = rTop;
  }

  // --- branches fanning out from the upper trunk
  const crownTips: { p: THREE.Vector3; r: number }[] = [
    { p: base.clone(), r: 0.2 + rand() * 0.1 },
  ];
  const branchCount = 4 + Math.floor(rand() * 3);
  for (let b = 0; b < branchCount; b++) {
    const origin =
      trunkPoints[
        Math.min(trunkPoints.length - 1, 1 + Math.floor(rand() * (trunkPoints.length - 1)))
      ].clone();
    const azimuth = rand() * Math.PI * 2;
    const tilt = 0.75 + rand() * 0.55; // radians from vertical — wide crowns
    const bDir = new THREE.Vector3(
      Math.sin(tilt) * Math.cos(azimuth),
      Math.cos(tilt),
      Math.sin(tilt) * Math.sin(azimuth),
    );
    const len = 0.22 + rand() * 0.24;
    const branch = new THREE.CylinderGeometry(0.008, 0.02 + rand() * 0.012, len, 5, 1);
    branch.translate(0, len / 2, 0);
    branch.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, bDir));
    branch.translate(origin.x, origin.y, origin.z);
    parts.push({ geometry: branch, color: barkColor });
    crownTips.push({
      p: origin.addScaledVector(bDir, len),
      r: 0.14 + rand() * 0.14,
    });
  }

  // --- foliage: clustered clumps around every branch tip
  for (const tip of crownTips) {
    const clumps = 2 + Math.floor(rand() * 2);
    for (let c = 0; c < clumps; c++) {
      const clump = foliageClump(rand, tip.r * (0.75 + rand() * 0.5));
      clump.translate(
        tip.p.x + (rand() - 0.5) * tip.r * 1.2,
        tip.p.y + (rand() - 0.3) * tip.r * 0.7,
        tip.p.z + (rand() - 0.5) * tip.r * 1.2,
      );
      const g = 0.09 + rand() * 0.05;
      parts.push({
        geometry: clump,
        color: new THREE.Color(g * 0.45, g, g * 0.55),
        darkenBase: true,
      });
    }
  }

  return mergeParts(parts);
}

interface TreeInstance {
  x: number;
  z: number;
  h: number;
  spin: number;
  shade: number;
}

function scatterTrees(count: number, rand: () => number): TreeInstance[] {
  return Array.from({ length: count }, () => {
    // keep a walkable corridor clear around x ∈ (-3.2, 3.2)
    const side = rand() > 0.5 ? 1 : -1;
    return {
      x: side * (3.6 + rand() * 16),
      z: 18 - rand() * 110,
      h: 6 + rand() * 8,
      spin: rand() * Math.PI * 2,
      shade: 0.65 + rand() * 0.55,
    };
  });
}

const ARCHETYPE_COUNT = 4;
const TREES_PER_ARCHETYPE = 30;

function Forest() {
  const meshRefs = useRef<(THREE.InstancedMesh | null)[]>([]);

  const { archetypes, placements, bushGeo, bushes } = useMemo(() => {
    const rand = mulberry32(20260715);
    const archetypes = Array.from({ length: ARCHETYPE_COUNT }, () =>
      buildTreeArchetype(rand),
    );
    const placements = Array.from({ length: ARCHETYPE_COUNT }, () =>
      scatterTrees(TREES_PER_ARCHETYPE, rand),
    );
    // low undergrowth softening the forest floor
    const bushGeo = foliageClump(rand, 1);
    const bushes = Array.from({ length: 70 }, () => {
      const side = rand() > 0.5 ? 1 : -1;
      return {
        x: side * (2.9 + rand() * 15),
        z: 18 - rand() * 110,
        s: 0.5 + rand() * 1.3,
        shade: 0.4 + rand() * 0.5,
      };
    });
    return { archetypes, placements, bushGeo, bushes };
  }, []);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    placements.forEach((trees, a) => {
      const mesh = meshRefs.current[a];
      if (!mesh) return;
      trees.forEach((t, i) => {
        dummy.position.set(t.x, 0, t.z);
        dummy.rotation.set(0, t.spin, 0);
        // trees are unit-height; widen slightly less than they grow tall
        dummy.scale.set(t.h * 0.9, t.h, t.h * 0.9);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        color.setRGB(t.shade, t.shade, t.shade);
        mesh.setColorAt(i, color);
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });

    const bushMesh = meshRefs.current[ARCHETYPE_COUNT];
    if (bushMesh) {
      bushes.forEach((b, i) => {
        dummy.position.set(b.x, b.s * 0.25, b.z);
        dummy.rotation.set(0, b.x * 7.3, 0);
        dummy.scale.set(b.s, b.s * 0.6, b.s);
        dummy.updateMatrix();
        bushMesh.setMatrixAt(i, dummy.matrix);
        color.setRGB(0.05 * b.shade, 0.11 * b.shade, 0.06 * b.shade);
        bushMesh.setColorAt(i, color);
      });
      bushMesh.instanceMatrix.needsUpdate = true;
      if (bushMesh.instanceColor) bushMesh.instanceColor.needsUpdate = true;
    }
  }, [placements, bushes]);

  return (
    <group>
      {archetypes.map((geo, a) => (
        <instancedMesh
          key={a}
          ref={(el) => {
            meshRefs.current[a] = el;
          }}
          args={[geo, undefined, TREES_PER_ARCHETYPE]}
        >
          <meshBasicMaterial vertexColors />
        </instancedMesh>
      ))}
      <instancedMesh
        ref={(el) => {
          meshRefs.current[ARCHETYPE_COUNT] = el;
        }}
        args={[bushGeo, undefined, bushes.length]}
      >
        <meshBasicMaterial />
      </instancedMesh>
    </group>
  );
}

/* ---------------------------------------------------------------- */
/* Leopard eyes — a pair of amber points watching from the dark      */
/* ---------------------------------------------------------------- */

function useEyeTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    g.addColorStop(0, "rgba(255, 214, 120, 1)");
    g.addColorStop(0.35, "rgba(240, 180, 70, 0.85)");
    g.addColorStop(1, "rgba(240, 180, 70, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

const EYE_CYCLE = 11; // seconds: fade in, watch, blink, fade out, move

function LeopardEyes() {
  const texture = useEyeTexture();
  const group = useRef<THREE.Group>(null);
  const mats = useRef<(THREE.SpriteMaterial | null)[]>([]);
  const spot = useRef({ x: 6, y: 1.1, z: -20, placed: false });
  const rand = useRef(mulberry32(97));

  useFrame(({ camera, clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime % EYE_CYCLE;

    // while invisible, relocate ahead of the walking camera
    if (t < 0.1 && !spot.current.placed) {
      const r = rand.current;
      spot.current = {
        x: (r() > 0.5 ? 1 : -1) * (4 + r() * 5),
        y: 0.8 + r() * 1.1,
        z: camera.position.z - 16 - r() * 14,
        placed: true,
      };
    }
    if (t > 1) spot.current.placed = false;
    g.position.set(spot.current.x, spot.current.y, spot.current.z);

    // fade in → hold → fade out, with a slow blink mid-stare
    let opacity = 0;
    if (t < 1.4) opacity = t / 1.4;
    else if (t < 7.5) opacity = 1;
    else if (t < 9) opacity = 1 - (t - 7.5) / 1.5;
    const blink = t > 4 && t < 4.22 ? 0.08 : 1;
    mats.current.forEach((m) => {
      if (m) m.opacity = opacity * 0.9;
    });
    g.scale.y = blink;
  });

  return (
    <group ref={group}>
      {[-0.16, 0.16].map((dx, i) => (
        <sprite key={i} position={[dx, 0, 0]} scale={[0.22, 0.22, 1]}>
          <spriteMaterial
            ref={(el) => {
              mats.current[i] = el;
            }}
            map={texture}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0}>
      <planeGeometry args={[300, 300]} />
      <meshBasicMaterial color="#04120a" />
    </mesh>
  );
}

/* ---------------------------------------------------------------- */
/* Fireflies — additive shader points that trail the camera          */
/* ---------------------------------------------------------------- */

const fireflyVertex = /* glsl */ `
  attribute float aScale;
  attribute float aOffset;
  uniform float uTime;
  varying float vBlink;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.5 + aOffset * 11.0) * 0.6;
    p.x += cos(uTime * 0.33 + aOffset * 17.0) * 0.7;
    p.z += sin(uTime * 0.27 + aOffset * 23.0) * 0.7;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aScale * (120.0 / max(1.0, -mv.z));
    gl_Position = projectionMatrix * mv;
    vBlink = 0.25 + 0.75 * pow(0.5 + 0.5 * sin(uTime * 1.7 + aOffset * 41.0), 3.0);
  }
`;

const fireflyFragment = /* glsl */ `
  varying float vBlink;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vec3(1.0, 0.86, 0.45) * vBlink, a * vBlink);
  }
`;

function Fireflies({ count = 160 }: { count?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);

  const { positions, scales, offsets } = useMemo(() => {
    const rand = mulberry32(8080);
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 34;
      positions[i * 3 + 1] = 0.4 + rand() * 6.5;
      positions[i * 3 + 2] = -rand() * 42 + 6;
      scales[i] = 1.2 + rand() * 2.6;
      offsets[i] = rand() * 100;
    }
    return { positions, scales, offsets };
  }, [count]);

  useFrame(({ camera, clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime;
    // keep the swarm floating around the walking camera
    if (group.current) group.current.position.z = camera.position.z - 4;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
          <bufferAttribute attach="attributes-aOffset" args={[offsets, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={mat}
          vertexShader={fireflyVertex}
          fragmentShader={fireflyFragment}
          uniforms={{ uTime: { value: 0 } }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* ---------------------------------------------------------------- */
/* God rays — soft additive light blades slanting through the canopy */
/* ---------------------------------------------------------------- */

const rayVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const rayFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uSeed;
  void main() {
    float x = smoothstep(0.0, 0.35, vUv.x) * smoothstep(1.0, 0.65, vUv.x);
    float y = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.4, vUv.y);
    float pulse = 0.75 + 0.25 * sin(uTime * 0.35 + uSeed * 10.0);
    vec3 col = vec3(0.45, 0.72, 0.5);
    gl_FragColor = vec4(col, x * y * 0.16 * pulse);
  }
`;

function GodRays() {
  const mats = useRef<(THREE.ShaderMaterial | null)[]>([]);
  const rays = useMemo(() => {
    const rand = mulberry32(4242);
    return Array.from({ length: 7 }, (_, i) => ({
      x: (rand() - 0.5) * 20,
      z: 8 - i * 12 - rand() * 6,
      tilt: 0.35 + (rand() - 0.5) * 0.25,
      w: 5 + rand() * 7,
      seed: rand(),
    }));
  }, []);

  useFrame(({ clock }) => {
    mats.current.forEach((m) => {
      if (m) m.uniforms.uTime.value = clock.elapsedTime;
    });
  });

  return (
    <group>
      {rays.map((r, i) => (
        <mesh
          key={i}
          position={[r.x, 9, r.z]}
          rotation={[0, 0.3, r.tilt]}
        >
          <planeGeometry args={[r.w, 26]} />
          <shaderMaterial
            ref={(el) => {
              mats.current[i] = el;
            }}
            vertexShader={rayVertex}
            fragmentShader={rayFragment}
            uniforms={{ uTime: { value: 0 }, uSeed: { value: r.seed } }}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------- */
/* Ground mist — soft radial sprites sliding across the track        */
/* ---------------------------------------------------------------- */

function useMistTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    g.addColorStop(0, "rgba(158, 199, 174, 0.55)");
    g.addColorStop(0.6, "rgba(158, 199, 174, 0.12)");
    g.addColorStop(1, "rgba(158, 199, 174, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

function Mist() {
  const texture = useMistTexture();
  const group = useRef<THREE.Group>(null);
  const puffs = useMemo(() => {
    const rand = mulberry32(1111);
    return Array.from({ length: 14 }, () => ({
      x: (rand() - 0.5) * 30,
      y: 0.6 + rand() * 1.4,
      z: 10 - rand() * 100,
      s: 7 + rand() * 12,
      speed: 0.15 + rand() * 0.3,
      phase: rand() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const p = puffs[i];
      child.position.x = p.x + Math.sin(t * p.speed + p.phase) * 3.5;
    });
  });

  return (
    <group ref={group}>
      {puffs.map((p, i) => (
        <sprite key={i} position={[p.x, p.y, p.z]} scale={[p.s, p.s * 0.45, 1]}>
          <spriteMaterial
            map={texture}
            transparent
            opacity={0.16}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------- */
/* Root canvas                                                       */
/* ---------------------------------------------------------------- */

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export default function JungleCanvas() {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none"
    >
      <Canvas
        camera={{ position: [0, 2.1, WALK_START], fov: 60, near: 0.1, far: 260 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        frameloop={reduced ? "demand" : "always"}
      >
        <fogExp2 attach="fog" args={["#04140b", 0.042]} />
        <Sky />
        <Moon />
        <Forest />
        <Ground />
        <GodRays />
        <Mist />
        <Fireflies />
        <LeopardEyes />
        {!reduced && <CameraRig />}
      </Canvas>
    </div>
  );
}
