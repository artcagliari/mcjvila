"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function CameraRig({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    const strength = reducedMotion ? 0.05 : 0.36;
    target.current.set(pointer.x * strength, pointer.y * strength * 0.55, 7.4);
    camera.position.lerp(target.current, reducedMotion ? 0.025 : 0.045);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

