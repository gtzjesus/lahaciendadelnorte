'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshoptDecoder } from 'meshoptimizer';

export default function VanillaShedViewer() {
  const container = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!container.current) return;

    const width = container.current.clientWidth;
    const height = 700;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    camera.position.set(0, 3, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    container.current.innerHTML = '';
    container.current.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    const pivot = new THREE.Group();
    scene.add(pivot);

    const modelsURLs = [
      '/3D/shed-optimized.glb',
      '/3D/shed3-optimized.glb',
      '/3D/shed2-optimized.glb',
    ];

    const models: THREE.Object3D[] = [];
    let currentIndex = 0;
    let switchTimer = 0;
    let rotationSpeed = 0.01;
    let targetSpeed = 0.01;
    const displayDuration = 6000;
    const transitionDuration = 1000;

    const loadModel = (url: string): Promise<THREE.Object3D> => {
      return new Promise((resolve, reject) => {
        loader.load(
          url,
          (gltf) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const scale = 4 / Math.max(size.x, size.y, size.z);
            model.scale.setScalar(scale);
            model.position.sub(center.multiplyScalar(scale));
            model.visible = false;
            resolve(model);
          },
          undefined,
          reject
        );
      });
    };

    Promise.all(modelsURLs.map(loadModel))
      .then((loadedModels) => {
        loadedModels.forEach((model) => {
          pivot.add(model);
          models.push(model);
        });

        // 👇 Force render each model once to warm up the GPU
        models.forEach((model) => {
          model.visible = true;
          renderer.render(scene, camera); // GPU upload
          model.visible = false;
        });

        models[0].visible = true;

        setLoading(false);
        animate();
      })
      .catch(console.error);

    const animate = () => {
      requestAnimationFrame(animate);

      rotationSpeed += (targetSpeed - rotationSpeed) * 0.05;
      pivot.rotation.y += rotationSpeed;
      switchTimer += 16.6;

      if (switchTimer >= displayDuration - transitionDuration) {
        targetSpeed = 0.04;
      }

      if (switchTimer >= displayDuration && models.length > 1) {
        models[currentIndex].visible = false;
        currentIndex = (currentIndex + 1) % models.length;
        models[currentIndex].visible = true;
        targetSpeed = 0.01;
        switchTimer = 0;
      }

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      if (!container.current) return;
      const newWidth = container.current.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.current?.contains(renderer.domElement)) {
        container.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <span className="uppercase text-black text-center text-xl animate-pulse">
            La Hacienda Del Norte Custom Storage <br />
            Loading 3D...
          </span>
        </div>
      )}
      <div ref={container} className="w-full h-[700px]" />
    </div>
  );
}
