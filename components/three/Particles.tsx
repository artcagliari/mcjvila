"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Particles({ count = 160 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    const randomAt = (index: number) => {
      const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
      return value - Math.floor(value);
    };
    for (let i = 0; i < count; i += 1) {
      array[i * 3] = (randomAt(i * 3) - 0.5) * 16;
      array[i * 3 + 1] = (randomAt(i * 3 + 1) - 0.5) * 9;
      array[i * 3 + 2] = (randomAt(i * 3 + 2) - 0.5) * 9;
    }
    return array;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.018;
    ref.current.rotation.x = state.pointer.y * 0.025;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.016} transparent opacity={0.52} sizeAttenuation />
    </points>
  );
}
