import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import './style.css'
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import postprocessing from examples/jsm (three-stdlib recommended)
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import Navbar from "./components/Navbar";
import PersonalGuidance from "./components/PersonalGuidance";
import CosmicCards from "./components/CosmicCards";

gsap.registerPlugin(ScrollTrigger);

// local uploaded image (developer-provided file path)
const ASSET_URL = "/mnt/data/A_digital_image_of_outer_space_showcases_a_vast_ex.png";

export default function FromSprit() {
  const mountRef = useRef(null);
  const audioAnalyserRef = useRef(null);
  const [active, setActive] = useState("sec1");
  const [enableMic, setEnableMic] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ---------- Scene / Camera / Renderer ----------
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#02010a", 0.06); // very dark - keeps contrast for gold

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      400
    );
    camera.position.set(0, 0, 28);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    mount.appendChild(renderer.domElement);

    // ---------- Composer + Bloom ----------
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.0,
      0.35,
      0.05
    );
    bloomPass.threshold = 0.12;
    bloomPass.strength = 0.9;
    bloomPass.radius = 0.6;
    composer.addPass(bloomPass);

    // ---------- Lights ----------
    const amb = new THREE.AmbientLight(0xd6b86b, 0.28); // warm ambient gold
    scene.add(amb);
    const pLight = new THREE.PointLight(0xd6b86b, 1.0);
    pLight.position.set(6, 8, 6);
    scene.add(pLight);

    // ---------- Sacred Geometry (rings removed to declutter) ----------
    const sacredGroup = new THREE.Group();
    scene.add(sacredGroup);

    
    const icoGeo = new THREE.IcosahedronGeometry(3.2, 1);
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(icoGeo),
      new THREE.LineBasicMaterial({ color: 0xd6b86b, transparent: true, opacity: 0.95 })
    );
    sacredGroup.add(wire);
    sacredGroup.position.set(0, -1.5, 0);

    // ---------- Particle System (posA: vortex / posB: human) ----------
    const safeParticleCount = Math.max(1600, Math.floor((window.innerWidth * window.innerHeight) / 80000));
    const PARTICLE_COUNT = Math.min(safeParticleCount, 6000);
    const pointsGeo = new THREE.BufferGeometry();
    const posA = new Float32Array(PARTICLE_COUNT * 3);
    const posB = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = Math.random() * Math.PI * 6;
      const r = Math.pow(Math.random(), 0.8) * (12 + Math.random() * 6);
      posA[i * 3 + 0] = Math.cos(t) * r * (0.8 + Math.random() * 0.4);
      posA[i * 3 + 1] = (Math.random() - 0.5) * 6;
      posA[i * 3 + 2] = Math.sin(t) * r * (0.8 + Math.random() * 0.4);
    }

    const partition = (idx) => {
      const ratio = idx / PARTICLE_COUNT;
      if (ratio < 0.18) return "head";
      if (ratio < 0.45) return "torso";
      if (ratio < 0.62) return "leftArm";
      if (ratio < 0.79) return "rightArm";
      if (ratio < 0.90) return "leftLeg";
      return "rightLeg";
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const part = partition(i);
      let x = 0, y = 0, z = 0;
      if (part === "head") {
        const u = Math.random() * Math.PI * 2;
        const v = Math.acos(2 * Math.random() - 1);
        const rad = 0.9 * Math.pow(Math.random(), 0.6);
        x = Math.sin(v) * Math.cos(u) * rad;
        y = 2.6 + Math.cos(v) * rad;
        z = Math.sin(v) * Math.sin(u) * rad;
      } else if (part === "torso") {
        x = (Math.random() - 0.5) * 1.6;
        y = 0.3 + (Math.random() - 0.5) * 1.8;
        z = (Math.random() - 0.5) * 0.9;
      } else if (part === "leftArm") {
        x = -1.6 + (Math.random() - 0.5) * 0.4;
        y = 0.6 + (Math.random() - 0.5) * 1.2;
        z = (Math.random() - 0.5) * 0.6;
      } else if (part === "rightArm") {
        x = 1.6 + (Math.random() - 0.5) * 0.4;
        y = 0.6 + (Math.random() - 0.5) * 1.2;
        z = (Math.random() - 0.5) * 0.6;
      } else if (part === "leftLeg") {
        x = -0.5 + (Math.random() - 0.5) * 0.6;
        y = -2.6 + Math.random() * 1.4;
        z = (Math.random() - 0.5) * 0.6;
      } else {
        x = 0.5 + (Math.random() - 0.5) * 0.6;
        y = -2.6 + Math.random() * 1.4;
        z = (Math.random() - 0.5) * 0.6;
      }
      posB[i * 3 + 0] = x + (Math.random() - 0.5) * 0.08;
      posB[i * 3 + 1] = y + (Math.random() - 0.5) * 0.08;
      posB[i * 3 + 2] = z + (Math.random() - 0.5) * 0.08;
    }

    pointsGeo.setAttribute("position", new THREE.BufferAttribute(posA, 3));
    pointsGeo.setAttribute("posB", new THREE.BufferAttribute(posB, 3));

    // Shader material for morph
    const pointsMat = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: true,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uPointSize: { value: 3.2 },
        uSound: { value: 0.0 },
        uColorA: { value: new THREE.Color("#d6b86b") }, // warm gold
        uColorB: { value: new THREE.Color("#d6b86b") }, // brighter gold for mix
      },
      vertexShader: `
        attribute vec3 posB;
        uniform float uMorph;
        uniform float uTime;
        uniform float uPointSize;
        uniform float uSound;
        varying float vDepth;
        varying float vMix;
        void main() {
          vec3 a = position;
          vec3 b = posB;
          float wob = sin(uTime * 0.8 + position.x * 2.0 + position.y * 1.2) * 0.12;
          vec3 spiritOffset = vec3(a.x * 0.02, wob, a.z * 0.02);
          vec3 p = mix(a + spiritOffset, b, uMorph);
          float depth = - (modelViewMatrix * vec4(p, 1.0)).z;
          float size = uPointSize * (1.0 + (1.0 - smoothstep(0.0, 20.0, depth)) * 1.4);
          size *= (1.0 + uSound * 1.5);
          gl_PointSize = size;
          vDepth = depth;
          vMix = uMorph;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying float vDepth;
        varying float vMix;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float alpha = smoothstep(0.5, 0.0, d);
          vec3 c = mix(uColorA, uColorB, vMix);
          float depthFade = 1.0 - smoothstep(0.0, 40.0, vDepth);
          gl_FragColor = vec4(c * (0.6 + 0.4 * depthFade), alpha * (0.85 * depthFade));
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(pointsGeo, pointsMat);
    scene.add(points);

    // ---------- Runes ----------
    const runesGroup = new THREE.Group();
    scene.add(runesGroup);

    const runePlanes = [];
    const runeMats = [];
    for (let i = 0; i < 8; i++) {
      const geo = new THREE.PlaneGeometry(1.6, 1.6);
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          // changed runes to golden HSL (around hue ~0.12)
          uColor: { value: new THREE.Color().setHSL(0.12 + Math.random() * 0.03, 0.85, 0.55) },
          uGlow: { value: 0.8 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);} 
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uGlow;
          varying vec2 vUv;
          void main(){
            vec2 uv = vUv - 0.5;
            float r = length(uv) * 2.0;
            float circle = smoothstep(0.45, 0.42, r);
            float cross = smoothstep(0.02, 0.0, abs(uv.x)) * smoothstep(0.02, 0.0, abs(uv.y));
            float lines = smoothstep(0.48, 0.45, r) * 0.6 + cross * 0.8;
            float glow = pow(max(0.0, 1.0 - r * 1.2), 3.0) * uGlow;
            vec3 c = uColor * (0.6 * lines + glow);
            float a = clamp(lines + glow, 0.0, 1.0);
            gl_FragColor = vec4(c, a);
          }
        `,
        blending: THREE.AdditiveBlending,
      });

      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / 8) * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * 9.2, -0.6 + Math.sin(angle) * 1.6, Math.sin(angle) * 4.2);
      mesh.lookAt(0, 0, 0);
      runesGroup.add(mesh);
      runePlanes.push(mesh);
      runeMats.push(mat);
    }

    // ---------- Fog billboard (base) ----------
    const fogTexture = new THREE.TextureLoader().load(ASSET_URL);
    fogTexture.wrapS = fogTexture.wrapT = THREE.RepeatWrapping;
    fogTexture.repeat.set(1, 1);
    const fogPlane = new THREE.Mesh(new THREE.PlaneGeometry(40, 26), new THREE.MeshBasicMaterial({ map: fogTexture, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false }));
    fogPlane.position.set(0, 0, -4);
    scene.add(fogPlane);

    // ---------- Layered parallax fog images (optional: will silently skip if assets missing) ----------
    const texLoader = new THREE.TextureLoader();
    const fogLayers = [];
    const fogPaths = ["/mnt/data/fog1.png", "/mnt/data/fog2.png", "/mnt/data/fog3.png"];
    fogPaths.forEach((path, idx) => {
      texLoader.load(
        path,
        (tex) => {
          const sizeMult = 1 + idx * 0.2;
          const geom = new THREE.PlaneGeometry(40 * sizeMult, 25 * sizeMult);
          const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0.45 - idx * 0.12 });
          const mesh = new THREE.Mesh(geom, mat);
          mesh.position.set(0, 0, -12 - idx * 6);
          scene.add(mesh);
          fogLayers.push(mesh);
        },
        undefined,
        () => {
          // load error — ignore
        }
      );
    });

    // ---------- HEX GRID ----------
    // Hex grid parameters (tweak to taste)
    const HEX_RADIUS = 1.6; // tile radius
    const ROWS = 10;
    const COLS = 18;
    const HEX_GROUP_Z = -34; // backplane
    const hexGroup = new THREE.Group();
    hexGroup.name = "hexGrid";
    hexGroup.position.set(0, -2.0, HEX_GROUP_Z);
    scene.add(hexGroup);

    // create a single hex geometry (cylinder with 6 segments)
    const hexGeo = new THREE.CylinderGeometry(HEX_RADIUS, HEX_RADIUS, 0.12, 6, 1, false);
    hexGeo.translate(0, 0, 0); // center
    // subtle wooden/metallic-ish emissive material to match theme (golden)
    const hexMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#d6b86b"),
      emissive: new THREE.Color("#eae3c3"),
      emissiveIntensity: 0.06,
      roughness: 0.55,
      metalness: 0.4,
      transparent: true,
      opacity: 0.98,
      side: THREE.DoubleSide,
    });

    // build hex tiling (offset columns)
    // for (let row = 0; row < ROWS; row++) {
    //   for (let col = 0; col < COLS; col++) {
    //     const hex = new THREE.Mesh(hexGeo, hexMat.clone());
    //     // hex spacing math (hex grid)
    //     const xOffset = HEX_RADIUS * 1.75;
    //     const yOffset = HEX_RADIUS * 1.5;
    //     const x = (col - COLS / 2) * xOffset + (row % 2 === 0 ? 0 : xOffset * 0.5);
    //     const y = (row - ROWS / 2) * yOffset;
    //     hex.position.set(x, y, 0);
    //     // random subtle scale variance and rotation
    //     const s = 0.85 + Math.random() * 0.35;
    //     hex.scale.set(s, 1.0, s);
    //     hex.rotation.x = Math.PI / 2; // make it flat like a tile
    //     // give slightly staggered emissive intensity per tile
    //     hex.material.emissiveIntensity = 0.02 + Math.random() * 0.06;
    //     hexGroup.add(hex);
    //   }
    // }

    // initial subtle tilt
    // hexGroup.rotation.x = 0.18;
    // hexGroup.rotation.y = -0.05;

    // ---------- WebAudio (mic) ----------
    // let analyser = null;
    // let dataArray = null;
    // const initAudio = async () => {
    //   try {
    //     const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    //     const source = audioCtx.createMediaStreamSource(stream);
    //     analyser = audioCtx.createAnalyser();
    //     analyser.fftSize = 256;
    //     dataArray = new Uint8Array(analyser.frequencyBinCount);
    //     source.connect(analyser);
    //     audioAnalyserRef.current = analyser;
    //     setEnableMic(true);
    //   } catch (e) {
    //     console.warn("Audio init failed:", e);
    //     audioAnalyserRef.current = null;
    //     setEnableMic(false);
    //   }
    // };

    // ---------- GSAP Timeline & ScrollTriggers ----------
    const introTL = gsap.timeline();
    introTL.to(camera.position, { z: 14, duration: 1.2 }).to(camera.position, { z: 8, duration: 1.6 });

    const morphTween = gsap.to(pointsMat.uniforms.uMorph, {
      value: 1,
      ease: "none",
      paused: true,
    });

    ScrollTrigger.create({
      trigger: "#sec2",
      start: "top bottom",
      end: "top top",
      scrub: 1.6,
      onUpdate: (self) => {
        morphTween.progress(self.progress);
      },
    });

    ScrollTrigger.create({
      trigger: "#sec2",
      start: "top bottom",
      end: "top top",
      scrub: 2.0,
      onUpdate: (self) => {
        camera.position.z = 8 - 5 * self.progress; // camera z moves 8 -> 3
      },
    });

    gsap.to(sacredGroup.rotation, {
      y: Math.PI * 0.8,
      scrollTrigger: { trigger: "#sec3", start: "top bottom", end: "top top", scrub: 2.2 },
    });

    runePlanes.forEach((mesh, i) => {
      gsap.to(mesh.rotation, {
        z: Math.PI * (i % 2 === 0 ? 2.0 : -1.8),
        scrollTrigger: {
          trigger: "#sec3",
          start: "top bottom",
          end: "top top",
          scrub: 1.6,
        },
      });
    });

    // Hex grid ScrollTrigger:
    // - when user scrolls into sec3, hex grid gently moves forward (z -> -18), rises and rotates.
    // - scrub ties it to the scroll.
    ScrollTrigger.create({
      trigger: "#sec2",
      start: "top bottom",
      end: "top top",
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress; // 0 -> 1
        // position lerp: z from HEX_GROUP_Z -> -18, y from -2 -> 2
        const zTarget = THREE.MathUtils.lerp(HEX_GROUP_Z, -18, p);
        const yTarget = THREE.MathUtils.lerp(-1.8, 1.0, p);
        hexGroup.position.z = zTarget;
        hexGroup.position.y = yTarget;
        // rotation: small spin based on progress
        hexGroup.rotation.z = THREE.MathUtils.lerp(0.02, 0.9, p);
        // subtle scale pop
        const s = THREE.MathUtils.lerp(0.92, 1.06, p);
        hexGroup.scale.set(s, s, s);
        // increase emissive intensity slightly across tiles
        hexGroup.children.forEach((tile, idx) => {
          // vary by index + progress so it looks like waves
          const base = 0.02 + (idx % 6) * 0.003;
          tile.material.emissiveIntensity = base + p * 0.12;
        });
      },
    });

    // Fog parallax update using ScrollTrigger (works even when fogLayers load async)
    ScrollTrigger.create({
      trigger: '#sec2',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        fogLayers.forEach((mesh, idx) => {
          mesh.position.y = (p - 0.5) * -2.0 * (1 + idx * 0.4);
          mesh.position.z = -12 - idx * 6 + p * (1.5 + idx * 0.5);
        });
        // subtle background fog movement
        fogPlane.position.y = (p - 0.5) * -0.6  ;
      }
    });

    // ---------- Render / Animation ----------
    let rafId = null;
    const clock = new THREE.Clock();

    const render = () => {
      rafId = requestAnimationFrame(render);
      const t = clock.getElapsedTime();

      pointsMat.uniforms.uTime.value = t * 0.6;

      // sound analysis
      let soundVal = 0;
      if (audioAnalyserRef.current && dataArray) {
        audioAnalyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        soundVal = (sum / dataArray.length) / 255;
      }
      pointsMat.uniforms.uSound.value = soundVal;
      pointsMat.uniforms.uPointSize.value = 2.8 + soundVal * 5.0;

      sacredGroup.rotation.x += 0.0008;
      sacredGroup.rotation.y += 0.001;
      runesGroup.rotation.y += 0.0008;

      const morphT = pointsMat.uniforms.uMorph.value || 0;
      points.rotation.y += 0.0007 * (1.0 - morphT);

      // idle hexGroup animation: very slow rotation & slight bob
      hexGroup.rotation.y += 0.0006;
      hexGroup.position.x = Math.sin(t * 0.12) * 0.25;

      composer.render();
    };
    render();

    // ---------- Resize handler ----------
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ---------- CLEANUP ----------
    const cleanup = () => {
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);

      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf(camera.position);

      try {
        pointsGeo.dispose();
        pointsMat.dispose();
        runeMats.forEach((m) => m.dispose && m.dispose());
        icoGeo.dispose && icoGeo.dispose();
        wire.geometry && wire.geometry.dispose && wire.geometry.dispose();
        wire.material && wire.material.dispose && wire.material.dispose();

        // dispose hex grid geometry & materials
        hexGroup.children.forEach((tile) => {
          if (tile.geometry) tile.geometry.dispose && tile.geometry.dispose();
          if (tile.material) tile.material.dispose && tile.material.dispose();
        });

        hexGeo.dispose && hexGeo.dispose();

        composer.dispose && composer.dispose();
        renderer.forceContextLoss && renderer.forceContextLoss();
        renderer.dispose && renderer.dispose();
      } catch (e) {}

      try {
        if (audioAnalyserRef.current && audioAnalyserRef.current.context) {
          audioAnalyserRef.current.context.close && audioAnalyserRef.current.context.close();
        }
      } catch (e) {}

      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };

    return cleanup;
  }, []);

  

  // ---------- Floating Menu + section observer ----------
  useEffect(() => {
    const ids = ["sec1", "sec2", "sec3"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.5 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // click => smooth scroll
  const handleNavClick = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // request mic on demand
  const enableMicHandler = async () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);
      audioAnalyserRef.current = analyser;
      setEnableMic(true);
    } catch (e) {
      console.warn("Mic denied:", e);
      setEnableMic(false);
    }
  };

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Three canvas mount */}
      <div ref={mountRef} style={{ position: "fixed", inset: 0, zIndex: -1 }} />

      {/* Floating Menu */}
      <Navbar />
      <section className="hero-section">
      {/* Background Video */}
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src="/banner.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="hero-overlay">
        <h1 className="hero-title">Awaken Your Inner Consciousness</h1>
        <p className="hero-subtitle">
          Experience Spiritual Alignment, Healing & Universal Energy
        </p>

        <div className="hero-buttons">
          <button className="hero-btn">Book a Healing Session</button>
          <button className="hero-btn">Explore Courses</button>
          <button className="hero-btn">Join Membership</button>
        </div>
      </div>
    </section>

     <PersonalGuidance />

      {/* Titles + sections */}
      <div style={{ position: "scroll", zIndex: 50 }}>
        <section id="sec1" style={sectionStyle}>
          <CosmicCards />
        </section>

        <section id="sec2" style={sectionStyle}>
          <h1 className="guidance-main-title">AS SEEN IN</h1>
          <p style={pStyle}>
            I help people achieve the unbelievable through direct experiences so they know Nature’s Intelligence, themselves, and open to the wonder of life.

I guide individuals to manifest the extraordinary persons they are designed to be through a personalized journey of consciousness, frequencies, energetics, plants, and proprietary methods to liberate their highest performance with joy, love, & abundance!
          </p>
        </section>

        <section id="sec3" style={sectionStyle}>
          <h1 className="guidance-main-title" >BECOMING HUMAN</h1>
          <p style={pStyle}>
            Liberation is transforming fear into love...
using creativity to allow
our fate to meet our destiny...
so that our multi-dimensional essence
can express itself
as a unique & unified consciousness
comunning with the Universe in DIVINE AWe
          </p>
        </section>

        <section  id="sec4" style={{ background: "black", minHeight: "300px" }}></section>
      </div>
    </div>
  );
}

// small helpers for menu visuals
const menuBtn = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "8px 12px",
  borderRadius: 10,
  border: "none",
  background: "transparent",
  color: "rgba(220,220,255,0.9)",
  cursor: "pointer",
  transition: "all 180ms ease",
};

const dot = (active) => ({
  width: 10,
  height: 10,
  borderRadius: 6,
  background: active ? "#d6b86b" : "transparent",
  //   boxShadow: active ? "0 0 10px #6d1dcfe6" : "none",
  border: "1px solid rgba(255,255,255,0.06)",
});

const sectionStyle = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  alignItems: "left",
  textAlign: "left",
  padding: "8rem",
  color: "white",
  fontFamily: "'Poppins', sans-serif",
  textShadow: "0 0 20px rgba(0,0,0,0.25)",
};

const h1Style = {
  fontSize: "clamp(42px, 6vw, 92px)",
  fontWeight: 300,
  letterSpacing: "0.12em",
  margin: 0,
  color: "#ffffff",
};

const pStyle = {
  marginTop: 18,
  maxWidth: 900,
  opacity: 0.92,
  fontSize: "clamp(15px, 1.15vw, 20px)",
  lineHeight: 1.6,
  color: "rgba(255,255,255,0.92)",
};
