"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Suspense, useState } from "react";
import { CameraRig } from "./CameraRig";
import { ChromeLogo } from "./ChromeLogo";
import { Particles } from "./Particles";

export default function HeroScene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [quality, setQuality] = useState(1);
  const compact = typeof window !== "undefined" && window.innerWidth < 720;

  return (
    <Canvas
      camera={{ position: [0, 0, 7.4], fov: compact ? 52 : 42 }}
      dpr={[1, compact ? 1.15 : Math.min(1.5, quality * 1.5)]}
      gl={{ antialias: !compact, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.55 }}
    >
      <PerformanceMonitor onDecline={() => setQuality(0.72)} />
      <fog attach="fog" args={["#050505", 8, 20]} />
      <ambientLight intensity={0.35} />
      <spotLight position={[0, 6, 5]} intensity={58} angle={0.35} penumbra={0.85} color="#ffffff" />
      <spotLight position={[-5, -1, 4]} intensity={42} angle={0.5} penumbra={1} color="#b00016" />
      <pointLight position={[4, 1, 2]} intensity={22} color="#ff193d" />
      <Suspense fallback={null}>
        <Environment resolution={96}>
          <Lightformer intensity={4} color="white" position={[0, 4, -3]} scale={[10, 1, 1]} />
          <Lightformer intensity={7} color="#b9001d" position={[-5, 0, 2]} rotation={[0, Math.PI / 2, 0]} scale={[7, 1, 1]} />
          <Lightformer intensity={2} color="#ffffff" position={[5, -2, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[5, 0.5, 1]} />
        </Environment>
        <ChromeLogo compact={compact} />
      </Suspense>
      {!reducedMotion && <Particles count={compact ? 70 : 170} />}
      <CameraRig reducedMotion={reducedMotion} />
    </Canvas>
  );
}

