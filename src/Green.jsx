
import React, { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stats, GradientTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function makeLeafCanvas() {
  // returns a dataURL texture of an organic leaf shape
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");

  // Background transparent
  ctx.clearRect(0, 0, size, size);

  // Draw leaf shape with gradient and veins
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(-0.2 + Math.random() * 0.4);

  // gradient
  const g = ctx.createLinearGradient(-size / 2, 0, size / 2, 0);
  g.addColorStop(0, "#1b5e20");
  g.addColorStop(0.5, "#2e7d32");
  g.addColorStop(1, "#66bb6a");

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.35, size * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();

  // veins
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  for (let i = 0; i < 8; i++) {
    const x = Math.cos((i / 8) * Math.PI * 2) * (size * 0.35);
    const y = Math.sin((i / 8) * Math.PI * 2) * (size * 0.18);
    ctx.lineTo(x * 0.7, y * 0.7);
    ctx.moveTo(0, 0);
  }
  ctx.stroke();

  ctx.restore();

  // subtle darker rim
  ctx.globalCompositeOperation = "source-atop";
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(size / 2, size / 2, size * 0.35, size * 0.18, 0, 0, Math.PI * 2);
  ctx.stroke();

  return c.toDataURL();
}

function Trees({ count = 40, radius = 30 }) {
  const groupRef = useRef();
  const leafTexture = useMemo(() => {
    const url = makeLeafCanvas();
    const t = new THREE.TextureLoader().load(url);
    t.encoding = THREE.sRGBEncoding;
    t.needsUpdate = true;
    return t;
  }, []);

  // one instanced mesh for many leaf planes per tree crown
  // but we'll construct each tree as a small group of leaves + trunk (non-instanced trunks okay)
  const primes = useMemo(() => {
    // precompute positions for trunks
    const data = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = radius * (0.4 + Math.random() * 0.6);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const scale = 0.8 + Math.random() * 1.6;
      const rotY = Math.random() * Math.PI * 2;
      data.push({ x, z, scale, rotY });
    }
    return data;
  }, [count, radius]);

  return (
    <group ref={groupRef}>
      {primes.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} rotation={[0, p.rotY, 0]} scale={p.scale}>
          {/* trunk */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.25 * p.scale, 0.35 * p.scale, 2.4, 8]} />
            <meshStandardMaterial color={"#4a2f1b"} roughness={1} metalness={0} />
          </mesh>

          {/* crown: instanced leaves */}
          <Crown leafTexture={leafTexture} />
        </group>
      ))}
    </group>
  );
}

function Crown({ leafTexture }) {
  // create an instanced mesh of many small leaf planes, randomized around crown
  const ref = useRef();
  const count = 80;
  const temp = new THREE.Object3D();

  useEffect(() => {
    if (!ref.current) return;
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.6 + 0.2; // top hemisphere
      const r = 1 + Math.random() * 0.9;
      const x = Math.cos(theta) * Math.sin(phi) * r;
      const y = Math.cos(phi) * r + 2.2; // crown elevated
      const z = Math.sin(theta) * Math.sin(phi) * r;
      temp.position.set(x, y, z);
      temp.rotation.set(Math.random() * 0.6 - 0.3, Math.random() * Math.PI, Math.random() * 0.6 - 0.3);
      const s = 0.6 + Math.random() * 0.9;
      temp.scale.set(s, s, s);
      temp.updateMatrix();
      ref.current.setMatrixAt(i, temp.matrix);
      // add custom color per-instance via instanceColor (optional)
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [ref]);

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <planeGeometry args={[1, 0.5]} />
      <meshStandardMaterial map={leafTexture} transparent={true} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function FallingLeaves({ count = 200 }) {
  // instanced falling leaves that respond to scroll
  const ref = useRef();
  const { viewport } = useThree();
  const leafTexture = useMemo(() => {
    const url = makeLeafCanvas();
    const t = new THREE.TextureLoader().load(url);
    t.encoding = THREE.sRGBEncoding;
    t.needsUpdate = true;
    return t;
  }, []);

  const data = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * viewport.width * 2,
        y: Math.random() * 20 + 5,
        z: (Math.random() - 0.5) * 40,
        rotZ: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
        sway: (Math.random() - 0.5) * 0.5,
        scale: 0.6 + Math.random() * 0.9,
      });
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  // dynamic positions held in local array to mutate each frame
  const positions = useMemo(() => data.map(d => ({ ...d })), [data]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    for (let i = 0; i < count; i++) {
      const p = positions[i];
      p.y -= p.speed * delta * 2;
      p.x += Math.sin(state.clock.elapsedTime * 0.5 + i) * p.sway * delta * 10;
      p.rotZ += 0.5 * delta;
      if (p.y < -2) {
        p.y = Math.random() * 20 + 10;
        p.x = (Math.random() - 0.5) * viewport.width * 2;
        p.z = (Math.random() - 0.5) * 40;
      }
      const temp = new THREE.Object3D();
      temp.position.set(p.x, p.y, p.z);
      temp.rotation.set(0, 0, p.rotZ);
      temp.scale.set(p.scale, p.scale, p.scale);
      temp.updateMatrix();
      ref.current.setMatrixAt(i, temp.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <planeGeometry args={[1, 0.5]} />
      <meshStandardMaterial map={leafTexture} transparent={true} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[400, 400, 32, 32]} />
      <meshStandardMaterial color={"#0c3014ff"} roughness={1} />
    </mesh>
  );
}

function ScrollCameraController() {
  // Drives camera based on scroll, smoothing in useFrame
  const camRef = useRef();
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 3, z: 18 });
  const current = useRef({ x: camera.position.x, y: camera.position.y, z: camera.position.z });

  useEffect(() => {
    // Setup GSAP ScrollTriggers to update target values
    ScrollTrigger.create({
      trigger: "#section1",
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        const p = self.progress; // 0 -> 1
        target.current.z = 18 - p * 6; // move forward
        target.current.y = 4 - p * 1.2; // slightly down
        target.current.x = Math.sin(p * Math.PI * 0.5) * 1.2;
      },
    });

    ScrollTrigger.create({
      trigger: "#section2",
      start: "top bottom",
      end: "top top",
      onUpdate: (self) => {
        const p = self.progress;
        target.current.z = 12 - p * 4;
        target.current.y = 3.5 - p * 1.2;
        target.current.x = Math.sin(p * Math.PI) * 1.6;
      },
    });

    ScrollTrigger.create({
      trigger: "#section3",
      start: "top bottom",
      end: "top top",
      onUpdate: (self) => {
        const p = self.progress;
        target.current.z = 8 - p * 2.5;
        target.current.y = 2.8 - p * 0.8;
        target.current.x = Math.sin(p * Math.PI * 1.2) * 2.2;
      },
    });

    return () => ScrollTrigger.getAll().forEach(s => s.kill());
  }, []);

  useFrame((_, dt) => {
    // lerp camera towards target for smooth motion
    camera.position.x += (target.current.x - camera.position.x) * dt * 3;
    camera.position.y += (target.current.y - camera.position.y) * dt * 3;
    camera.position.z += (target.current.z - camera.position.z) * dt * 3;

    // subtle lookAt a forward point for parallax feel
    const lookAt = new THREE.Vector3(camera.position.x * 0.2, 1.5, camera.position.z - 8);
    camera.lookAt(lookAt);
  });

  return null;
}

export default function Green() {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 4, 18], fov: 45 }}
        style={{ width: "100vw", height: "100vh", position: "fixed", inset: 0, zIndex: 0 }}
      >
        <fog attach="fog" args={[0x08120a, 10, 60]} />
        <ambientLight intensity={0.8} color={0x556b45} />
        <directionalLight
          castShadow
          intensity={0.8}
          position={[10, 20, 10]}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Suspense fallback={null}>
          <Ground />
          <Trees count={60} radius={45} />
          <FallingLeaves count={350} />
        </Suspense>
        <ScrollCameraController />
        {/* optional helper for debugging */}
        {/* <OrbitControls /> */}
      </Canvas>

      {/* Page content stacked in front of the canvas */}
      <div style={{ position: "relative", zIndex: 10, pointerEvents: "auto" }}>
        <section id="section1" style={sectionStyle}>
          <h1 style={titleStyle}>Enter the Realistic Jungle</h1>
          <p style={pStyle}>Scroll down to move through the forest — leaves fall dynamically.</p>
        </section>

        <section id="section2" style={sectionStyle}>
          <h2 style={titleStyle}>Deeper Into Green</h2>
          <p style={pStyle}>The camera moves forward and the canopy thickens.</p>
        </section>

        <section id="section3" style={sectionStyle}>
          <h2 style={titleStyle}>The Canopy</h2>
          <p style={pStyle}>Falling leaves, layered trees and fog create depth and realism.</p>
        </section>
      </div>
    </>
  );
}

const sectionStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingLeft: "8vw",
  paddingRight: "8vw",
  color: "white",
  background: "linear-gradient(180deg, rgba(207, 205, 205, 0) 0%, rgba(0,0,0,0.45) 100%)",
};

const titleStyle = {
  fontSize: "clamp(32px, 6vw, 56px)",
  margin: 0,
  lineHeight: 1.02,
};

const pStyle = {
  maxWidth: "55ch",
  fontSize: "clamp(16px, 1.8vw, 20px)",
  marginTop: "1rem",
  opacity: 0.95,
};
