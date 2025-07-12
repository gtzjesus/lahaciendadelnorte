'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function VanillaShedViewer() {
  const container = useRef<HTMLDivElement>(null);

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

    while (container.current.firstChild) {
      container.current.removeChild(container.current.firstChild);
    }
    container.current.appendChild(renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    const loader = new GLTFLoader();
    const pivot = new THREE.Group();
    scene.add(pivot);

    const modelsURLs = ['/3D/shed.glb', '/3D/shed2.glb', '/3D/shed3.glb'];
    const models: THREE.Object3D[] = [];

    let rotationSpeed = 0.01;
    let targetSpeed = 0.01;

    const loadModel = (url: string): Promise<THREE.Object3D> => {
      return new Promise((resolve, reject) => {
        loader.load(
          url,
          (gltf) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 4 / (maxDim || 1);
            model.scale.setScalar(scale);
            model.position.sub(center.multiplyScalar(scale));
            resolve(model);
          },
          undefined,
          (error) => {
            console.error('GLTF load error:', error);
            reject(error);
          }
        );
      });
    };

    Promise.all(modelsURLs.map(loadModel))
      .then((loadedModels) => {
        loadedModels.forEach((model, i) => {
          model.visible = i === 0;
          pivot.add(model);
          models.push(model);
        });

        let currentIndex = 0;
        let switchTimer = 0;
        const displayDuration = 6000; // 6 seconds
        const transitionDuration = 1000; // last 1s spins faster

        const animate = () => {
          requestAnimationFrame(animate);

          // Handle smooth speed transition
          rotationSpeed += (targetSpeed - rotationSpeed) * 0.05;
          pivot.rotation.y += rotationSpeed;

          switchTimer += 16.6; // ~1 frame at 60fps

          // Speed up before switch
          if (switchTimer >= displayDuration - transitionDuration) {
            targetSpeed = 0.04;
          }

          // Switch models
          if (switchTimer >= displayDuration) {
            models[currentIndex].visible = false;
            currentIndex = (currentIndex + 1) % models.length;
            models[currentIndex].visible = true;

            switchTimer = 0;
            targetSpeed = 0.01; // back to normal speed
          }

          renderer.render(scene, camera);
        };
        animate();
      })
      .catch((error) => {
        console.error('Error loading models', error);
      });

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

  return <div ref={container} className="" />;
}
