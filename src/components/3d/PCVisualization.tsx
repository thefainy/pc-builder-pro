import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { Component } from '../../types';
import { COMPONENT_3D_POSITIONS, COMPONENT_3D_SIZES } from '../../utils/constants';

interface PCVisualizationProps {
  selectedComponents: Record<string, Component>;
  className?: string;
}

export function PCVisualization({ selectedComponents, className = '' }: PCVisualizationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number | null>(null);
  const componentMeshesRef = useRef<Record<string, THREE.Mesh>>({});

  // Создание 3D модели компонента
  const createComponentMesh = useMemo(() => {
    return (component: Component) => {
      const category = component.category;
      const color = new THREE.Color(component.color || '#3b82f6');
      const [width, height, depth] = COMPONENT_3D_SIZES[category] || [0.5, 0.5, 0.5];

      let geometry: THREE.BufferGeometry;

      switch (category) {
        case 'cpu':
          geometry = new THREE.BoxGeometry(width, height, depth);
          break;
        case 'gpu':
          geometry = new THREE.BoxGeometry(width, height, depth);
          break;
        case 'ram':
          geometry = new THREE.BoxGeometry(width, height, depth);
          break;
        case 'storage':
          geometry = new THREE.BoxGeometry(width, height, depth);
          break;
        case 'psu':
          geometry = new THREE.BoxGeometry(width, height, depth);
          break;
        case 'motherboard':
          geometry = new THREE.BoxGeometry(width, height, depth);
          break;
        case 'cooler':
          geometry = new THREE.BoxGeometry(width, height, depth); // Заменяем на Box
          break;
        case 'case':
          geometry = new THREE.BoxGeometry(width, height, depth);
          break;
        default:
          geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      }

      const material = new THREE.MeshPhongMaterial({
        color: color,
        shininess: 100,
        emissive: color.clone().multiplyScalar(0.1),
        transparent: true,
        opacity: 0.9
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      return mesh;
    };
  }, []);

  // Получение позиции компонента
  const getComponentPosition = (category: string): [number, number, number] => {
    return COMPONENT_3D_POSITIONS[category as keyof typeof COMPONENT_3D_POSITIONS] || [0, 0, 0];
  };

  // Инициализация сцены
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Создание сцены
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    // Создание камеры
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(5, 4, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Создание рендерера
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Убираем устаревшие свойства
    renderer.useLegacyLights = false;

    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Освещение
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // Точечные источники света для эффекта
    const pointLight1 = new THREE.PointLight(0x3b82f6, 1, 15);
    pointLight1.position.set(-5, 3, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.8, 12);
    pointLight2.position.set(5, -2, -5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x10b981, 0.6, 10);
    pointLight3.position.set(0, 5, 0);
    scene.add(pointLight3);

    // Материнская плата (базовая платформа)
    const motherboardGeometry = new THREE.BoxGeometry(3, 0.1, 2.5);
    const motherboardMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x1a365d,
      shininess: 50
    });
    const motherboard = new THREE.Mesh(motherboardGeometry, motherboardMaterial);
    motherboard.position.set(0, 0, 0);
    motherboard.receiveShadow = true;
    motherboard.castShadow = true;
    scene.add(motherboard);

    // Добавляем детали материнской платы
    const slotGeometry = new THREE.BoxGeometry(2.5, 0.05, 0.2);
    const slotMaterial = new THREE.MeshPhongMaterial({ color: 0x2a4a6d });
    
    for (let i = 0; i < 4; i++) {
      const slot = new THREE.Mesh(slotGeometry, slotMaterial);
      slot.position.set(0, 0.08, -0.8 + i * 0.4);
      scene.add(slot);
    }

    // Анимационный цикл
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Вращение камеры вокруг сцены
      camera.position.x = Math.cos(time * 0.3) * 6;
      camera.position.z = Math.sin(time * 0.3) * 6;
      camera.position.y = 3 + Math.sin(time * 0.2) * 1;
      camera.lookAt(0, 0, 0);

      // Анимация компонентов
      Object.values(componentMeshesRef.current).forEach((mesh, index) => {
        mesh.rotation.y += 0.005;
        mesh.position.y += Math.sin(time * 1.5 + index) * 0.003;
        
        // Пульсация свечения
        const material = mesh.material as THREE.MeshPhongMaterial;
        const baseEmissive = new THREE.Color(material.color).multiplyScalar(0.1);
        const pulseIntensity = 0.05 + Math.sin(time * 2 + index) * 0.02;
        material.emissive = baseEmissive.multiplyScalar(pulseIntensity);
      });

      // Анимация освещения
      pointLight1.intensity = 1 + Math.sin(time * 1.5) * 0.3;
      pointLight2.intensity = 0.8 + Math.cos(time * 2) * 0.2;
      pointLight3.intensity = 0.6 + Math.sin(time * 1.8) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // Обработка изменения размера
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Очистка
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Обновление компонентов при изменении выбора
  useEffect(() => {
    if (!sceneRef.current) return;

    // Удаляем старые меши компонентов
    Object.values(componentMeshesRef.current).forEach(mesh => {
      sceneRef.current!.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    componentMeshesRef.current = {};

    // Добавляем новые меши
    Object.entries(selectedComponents).forEach(([category, component]) => {
      const mesh = createComponentMesh(component);
      const [x, y, z] = getComponentPosition(category);
      
      mesh.position.set(x, y, z);
      
      // Добавляем случайное небольшое вращение для разнообразия
      mesh.rotation.set(
        Math.random() * 0.2 - 0.1,
        Math.random() * 0.2 - 0.1,
        Math.random() * 0.2 - 0.1
      );

      sceneRef.current!.add(mesh);
      componentMeshesRef.current[category] = mesh;
    });
  }, [selectedComponents, createComponentMesh]);

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full bg-gradient-to-br from-dark-900 to-dark-800 rounded-xl overflow-hidden ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
}

export default PCVisualization;