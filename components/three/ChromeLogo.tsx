"use client";

import { Float, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export function ChromeLogo({ compact = false }: { compact?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const layers = useMemo(() => Array.from({ length: 18 }, (_, index) => index), []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.08, 0.045);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.035, 0.045);
  });

  return (
    <Float speed={1.05} rotationIntensity={0.08} floatIntensity={0.16}>
      <group ref={group} scale={compact ? 0.68 : 1}>
        {layers.map((layer) => (
          <Text
            key={layer}
            font="/fonts/geist-heavy.ttf"
            fontSize={2.15}
            letterSpacing={-0.1}
            anchorX="center"
            anchorY="middle"
            position={[0, 0, -layer * 0.018]}
          >
            JVILA
            <meshPhysicalMaterial
              color={layer === 0 ? "#f4f4f4" : layer < 5 ? "#9c9c9c" : "#252525"}
              metalness={1}
              roughness={layer === 0 ? 0.12 : 0.32}
              clearcoat={1}
              clearcoatRoughness={0.08}
            />
          </Text>
        ))}
      </group>
    </Float>
  );
}

