'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function VanillaShedViewer() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const width = container.current.clientWidth;
    const height = 600;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f0f0f0');

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    camera.position.set(0, 2, 7);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);

    // Clear any existing canvas in container to prevent duplicates
    while (container.current.firstChild) {
      container.current.removeChild(container.current.firstChild);
    }
    container.current.appendChild(renderer.domElement);

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // Load model
    const loader = new GLTFLoader();
    const pivot = new THREE.Group();
    scene.add(pivot);

    loader.load(
      '/3D/shed.glb',
      (gltf) => {
        const model = gltf.scene;

        // Center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / (maxDim || 1);
        model.scale.setScalar(scale);

        // Center model on origin
        model.position.sub(center.multiplyScalar(scale));

        // Position model slightly down so it rests on “floor”

        // Add model to pivot for rotation
        pivot.add(model);
      },
      undefined,
      (error) => {
        console.error('GLTF load error:', error);
      }
    );

    // Animation loop: spin pivot slowly on Y axis
    const animate = () => {
      requestAnimationFrame(animate);
      pivot.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!container.current) return;
      const newWidth = container.current.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.current?.contains(renderer.domElement)) {
        container.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={container} className="w-full h-[600px] rounded-lg bg-white" />
  );
}
