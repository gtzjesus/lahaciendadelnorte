'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

/* eslint-disable  @typescript-eslint/no-explicit-any */
function ShedModel(props: any) {
  const { scene } = useGLTF('/3D/shed.glb'); // public path
  return <primitive object={scene} {...props} />;
}

export default function ShedViewer() {
  return (
    <div className="w-full h-[600px]">
      <Canvas camera={{ position: [5, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Suspense fallback={null}>
          <ShedModel />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
