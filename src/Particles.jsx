import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

export default function Particles({ count = 2000 }) {
  const mesh = useRef();
  const { mouse } = useThree();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;

      scales[i] = Math.random() * 1.5 + 0.5; // random size for twinkle
    }

    return { arr, scales };
  }, []);

  // GSAP PULSE ANIMATION
  useMemo(() => {
    gsap.to(positions.scales, {
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      onUpdate: () => {
        if (mesh.current) {
          mesh.current.material.size = 0.05 + (Math.random() * 0.03);
        }
      },
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    mesh.current.rotation.y = t * 0.015; // slow rotation

    const pos = mesh.current.geometry.attributes.position;
    const arr = pos.array;

    // MOUSE FORCE
    const mouseX = mouse.x * 5;
    const mouseY = mouse.y * 5;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const x = arr[ix];
      const y = arr[ix + 1];

      const dx = x - mouseX;
      const dy = y - mouseY;

      const dist = Math.sqrt(dx * dx + dy * dy);

      // Mouse repulsion force
      const force = Math.max(0, 2 - dist);
      if (force > 0.01) {
        arr[ix] += (dx / dist) * force * 0.03;
        arr[ix + 1] += (dy / dist) * force * 0.03;
      }

      // Random twinkling
      arr[ix + 2] += Math.sin(t * 2 + i) * 0.001;
    }

    pos.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions.arr}
          count={positions.arr.length / 3}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.05}
        sizeAttenuation
        color={"#d4af37"}
        transparent
        opacity={0.9}
      />
    </points>
  );
}
