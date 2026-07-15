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

interface TreeSpec {
  x: number;
  z: number;
  h: number;
  lean: number;
  spin: number;
  shade: number;
}

function makeForest(count: number, seedFn: () => number): TreeSpec[] {
  const trees: TreeSpec[] = [];
  for (let i = 0; i < count; i++) {
    // keep a walkable corridor clear around x ∈ (-3.2, 3.2)
    const side = seedFn() > 0.5 ? 1 : -1;
    const x = side * (3.6 + seedFn() * 16);
    const z = 18 - seedFn() * 110;
    trees.push({
      x,
      z,
      h: 5 + seedFn() * 9,
      lean: (seedFn() - 0.5) * 0.22,
      spin: seedFn() * Math.PI * 2,
      shade: 0.7 + seedFn() * 0.5,
    });
  }
  return trees;
}

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

function Forest() {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);

  const { trees, canopies } = useMemo(() => {
    const rand = mulberry32(20260715);
    const trees = makeForest(110, rand);
    const canopies = trees.flatMap((t) => {
      const blobs = 2 + Math.floor(rand() * 2);
      return Array.from({ length: blobs }, () => ({
        x: t.x + (rand() - 0.5) * 2.4,
        y: t.h * (0.72 + rand() * 0.35),
        z: t.z + (rand() - 0.5) * 2.4,
        r: 1.6 + rand() * 2.6,
        shade: t.shade * (0.85 + rand() * 0.3),
      }));
    });
    return { trees, canopies };
  }, []);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    const trunk = trunkRef.current;
    if (trunk) {
      trees.forEach((t, i) => {
        dummy.position.set(t.x, t.h / 2, t.z);
        dummy.rotation.set(t.lean, t.spin, t.lean * 0.6);
        dummy.scale.set(1.3, t.h, 1.3);
        dummy.updateMatrix();
        trunk.setMatrixAt(i, dummy.matrix);
        color.setRGB(0.045 * t.shade, 0.075 * t.shade, 0.05 * t.shade);
        trunk.setColorAt(i, color);
      });
      trunk.instanceMatrix.needsUpdate = true;
      if (trunk.instanceColor) trunk.instanceColor.needsUpdate = true;
    }

    const canopy = canopyRef.current;
    if (canopy) {
      canopies.forEach((c, i) => {
        dummy.position.set(c.x, c.y, c.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(c.r);
        dummy.updateMatrix();
        canopy.setMatrixAt(i, dummy.matrix);
        color.setRGB(0.05 * c.shade, 0.13 * c.shade, 0.075 * c.shade);
        canopy.setColorAt(i, color);
      });
      canopy.instanceMatrix.needsUpdate = true;
      if (canopy.instanceColor) canopy.instanceColor.needsUpdate = true;
    }
  }, [trees, canopies]);

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, trees.length]}>
        <cylinderGeometry args={[0.07, 0.2, 1, 6]} />
        <meshBasicMaterial />
      </instancedMesh>
      <instancedMesh
        ref={canopyRef}
        args={[undefined, undefined, canopies.length]}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial />
      </instancedMesh>
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
        {!reduced && <CameraRig />}
      </Canvas>
    </div>
  );
}
