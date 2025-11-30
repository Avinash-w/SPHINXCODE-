import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Sections from "./components/Sections"; 
import Particles from "./Particles";
import './style.css';

gsap.registerPlugin(ScrollTrigger);

// --------------------------------------------------
// 3D SPHERE COMPONENT
// --------------------------------------------------
function Sphere({ visible }) {
  const mesh = useRef();
  const { mouse } = useThree();

  useFrame((state) => {
    if (!visible) return; // Skip updates when hidden

    const t = state.clock.getElapsedTime();

    // Auto rotation
    mesh.current.rotation.y += 0.003;

    // Mouse parallax
    mesh.current.position.x = mouse.x * 0.5;
    mesh.current.position.y = -mouse.y * 0.5;

    // Smooth scroll morph
    mesh.current.scale.setScalar(1 + window.scrollY * 0.0005);
  });

  if (!visible) return null;

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1.4, 32, 32]} />
      <meshStandardMaterial color={"#d4af37"} wireframe />
    </mesh>
  );
}

// --------------------------------------------------
// ROOT APP
// --------------------------------------------------
export default function GoldenGlobe() {
  const [showSphere, setShowSphere] = useState(false);

  useEffect(() => {
    // ---------------------------
    // HERO title animation
    // ---------------------------
    gsap.from(".hero-title", {
      y: 80,
      opacity: 0,
      duration: 1.4,
      ease: "power3.out",
    });

    gsap.from(".hero-text", {
      opacity: 0,
      y: 40,
      delay: 0.3,
      duration: 1.4,
    });

    // ---------------------------
    // HERO parallax scroll
    // ---------------------------
    gsap.to(".hero-content", {
      y: -180,
      scrollTrigger: {
        trigger: "#sec5",
        start: "top top",
        scrub: true,
      },
    });

    // ---------------------------
    // Sphere scroll visibility
    // ---------------------------
    ScrollTrigger.create({
      trigger: "#sec5",
      start: "top bottom",
      end: "top top",
      onEnter: () => setShowSphere(true),
      onLeaveBack: () => setShowSphere(false),
      onEnterBack: () => setShowSphere(true),
    });

  }, []);

  return (
    <div style={{ background: "black", minHeight: "300vh" }}>
      {/* -------------------------------------------------- */}
      {/*  3D SPHERE CANVAS */}
      {/* -------------------------------------------------- */}
      <Canvas
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
        camera={{ position: [0, 0, 7], fov: 60 }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />
        <Particles />
        <Sphere visible={showSphere} /> {/* Show only in section 3 */}
        <OrbitControls enableZoom={false} />
      </Canvas>

      {/* -------------------------------------------------- */}
      {/*  HERO SECTION */}
      {/* -------------------------------------------------- */}
      <Sections />
    </div>
  );
}
