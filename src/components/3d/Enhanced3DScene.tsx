import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { Component } from '../../types';
import { COMPONENT_3D_POSITIONS, COMPONENT_3D_SIZES } from '../../utils/constants';

interface Enhanced3DSceneProps {
  selectedComponents: Record<string, Component>;
  className?: string;
}

// GLTFLoader для загрузки .glb/.gltf моделей
class GLTFLoader {
  load(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const loader = new THREE.FileLoader();
      loader.setResponseType('arraybuffer');
      loader.load(
        url,
        (data) => {
          try {
            // Простая заглушка - в реальном проекте нужен полный GLTFLoader
            console.log('Модель загружена:', url);
            resolve({ scene: new THREE.Group() });
          } catch (error) {
            reject(error);
          }
        },
        undefined,
        reject
      );
    });
  }
}

export function Enhanced3DScene({ selectedComponents, className = '' }: Enhanced3DSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number | null>(null);
  const componentMeshesRef = useRef<Record<string, THREE.Group>>({});
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  // Создание продвинутых 3D моделей
  const createAdvancedComponentMesh = useMemo(() => {
    return (component: Component) => {
      const group = new THREE.Group();
      const category = component.category;
      const color = new THREE.Color(component.color || '#3b82f6');
      const [width, height, depth] = COMPONENT_3D_SIZES[category] || [0.5, 0.5, 0.5];

      let mainMesh: THREE.Mesh;

      switch (category) {
        case 'cpu':
          // Детализированный процессор
          const cpuGroup = new THREE.Group();
          
          // Основание CPU
          const cpuBase = new THREE.Mesh(
            new THREE.BoxGeometry(width, height * 0.3, depth),
            new THREE.MeshPhongMaterial({ 
              color: color,
              shininess: 100,
              emissive: color.clone().multiplyScalar(0.1)
            })
          );
          cpuGroup.add(cpuBase);
          
          // Контакты CPU
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
              const contact = new THREE.Mesh(
                new THREE.BoxGeometry(0.02, height * 0.1, 0.02),
                new THREE.MeshPhongMaterial({ color: 0xffd700 })
              );
              contact.position.set(
                (i - 1.5) * 0.15, 
                -height * 0.2, 
                (j - 1.5) * 0.15
              );
              cpuGroup.add(contact);
            }
          }
          
          // Крышка CPU
          const cpuLid = new THREE.Mesh(
            new THREE.BoxGeometry(width * 0.8, height * 0.1, depth * 0.8),
            new THREE.MeshPhongMaterial({ color: color.clone().multiplyScalar(1.2) })
          );
          cpuLid.position.y = height * 0.2;
          cpuGroup.add(cpuLid);
          
          mainMesh = cpuGroup as any;
          break;

        case 'gpu':
          // Детализированная видеокарта
          const gpuGroup = new THREE.Group();
          
          // Основная плата
          const gpuBoard = new THREE.Mesh(
            new THREE.BoxGeometry(width, height * 0.1, depth),
            new THREE.MeshPhongMaterial({ color: 0x2a5530 })
          );
          gpuGroup.add(gpuBoard);
          
          // GPU чип
          const gpuChip = new THREE.Mesh(
            new THREE.BoxGeometry(width * 0.3, height * 0.3, depth * 0.3),
            new THREE.MeshPhongMaterial({ 
              color: color,
              emissive: color.clone().multiplyScalar(0.2)
            })
          );
          gpuChip.position.y = height * 0.2;
          gpuGroup.add(gpuChip);
          
          // Кулеры
          for (let i = 0; i < 2; i++) {
            const fan = new THREE.Mesh(
              new THREE.CylinderGeometry(width * 0.15, width * 0.15, height * 0.1, 8),
              new THREE.MeshPhongMaterial({ color: 0x333333 })
            );
            fan.position.set((i - 0.5) * width * 0.4, height * 0.4, 0);
            fan.rotation.x = Math.PI / 2;
            gpuGroup.add(fan);
          }
          
          // Радиатор
          const heatsink = new THREE.Mesh(
            new THREE.BoxGeometry(width * 0.8, height * 0.6, depth * 0.2),
            new THREE.MeshPhongMaterial({ color: 0x888888 })
          );
          heatsink.position.set(0, height * 0.3, depth * 0.3);
          gpuGroup.add(heatsink);
          
          mainMesh = gpuGroup as any;
          break;

        case 'ram':
          // Детализированная память
          const ramGroup = new THREE.Group();
          
          // Основная плата
          const ramBoard = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshPhongMaterial({ color: 0x2a5530 })
          );
          ramGroup.add(ramBoard);
          
          // Чипы памяти
          for (let i = 0; i < 8; i++) {
            const chip = new THREE.Mesh(
              new THREE.BoxGeometry(width * 0.8, height * 0.1, depth * 0.15),
              new THREE.MeshPhongMaterial({ color: 0x333333 })
            );
            chip.position.set(0, (i - 3.5) * height * 0.1, depth * 0.3);
            ramGroup.add(chip);
          }
          
          // RGB подсветка
          const rgbStrip = new THREE.Mesh(
            new THREE.BoxGeometry(width * 0.9, height * 0.05, depth * 0.05),
            new THREE.MeshPhongMaterial({ 
              color: color,
              emissive: color.clone().multiplyScalar(0.3)
            })
          );
          rgbStrip.position.set(0, height * 0.4, depth * 0.4);
          ramGroup.add(rgbStrip);
          
          mainMesh = ramGroup as any;
          break;

        case 'storage':
          // SSD/HDD
          const storageGroup = new THREE.Group();
          
          const isNVMe = String(component.specs?.type || '').includes('NVMe');
          
          if (isNVMe) {
            // NVMe SSD
            const nvmeBoard = new THREE.Mesh(
              new THREE.BoxGeometry(width, height, depth),
              new THREE.MeshPhongMaterial({ color: 0x2a5530 })
            );
            storageGroup.add(nvmeBoard);
            
            // Контроллер
            const controller = new THREE.Mesh(
              new THREE.BoxGeometry(width * 0.3, height * 2, depth * 0.3),
              new THREE.MeshPhongMaterial({ color: 0x333333 })
            );
            controller.position.set(width * 0.2, 0, 0);
            storageGroup.add(controller);
            
            // NAND чипы
            for (let i = 0; i < 4; i++) {
              const nand = new THREE.Mesh(
                new THREE.BoxGeometry(width * 0.15, height * 2, depth * 0.15),
                new THREE.MeshPhongMaterial({ color: 0x444444 })
              );
              nand.position.set(-width * 0.2, 0, (i - 1.5) * depth * 0.2);
              storageGroup.add(nand);
            }
          } else {
            // Обычный SSD/HDD
            const driveCase = new THREE.Mesh(
              new THREE.BoxGeometry(width, height, depth),
              new THREE.MeshPhongMaterial({ color: color })
            );
            storageGroup.add(driveCase);
            
            // Наклейка
            const label = new THREE.Mesh(
              new THREE.BoxGeometry(width * 0.8, height * 0.01, depth * 0.3),
              new THREE.MeshPhongMaterial({ color: 0xffffff })
            );
            label.position.set(0, height * 0.51, 0);
            storageGroup.add(label);
          }
          
          mainMesh = storageGroup as any;
          break;

        case 'psu':
          // Блок питания
          const psuGroup = new THREE.Group();
          
          // Корпус БП
          const psuCase = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshPhongMaterial({ color: 0x222222 })
          );
          psuGroup.add(psuCase);
          
          // Вентилятор
          const psuFan = new THREE.Mesh(
            new THREE.CylinderGeometry(width * 0.3, width * 0.3, height * 0.1, 8),
            new THREE.MeshPhongMaterial({ color: 0x333333 })
          );
          psuFan.position.set(0, height * 0.4, 0);
          psuFan.rotation.x = Math.PI / 2;
          psuGroup.add(psuFan);
          
          // Кабели
          for (let i = 0; i < 3; i++) {
            const cable = new THREE.Mesh(
              new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8),
              new THREE.MeshPhongMaterial({ color: 0x000000 })
            );
            cable.position.set((i - 1) * 0.1, -height * 0.5, depth * 0.4);
            psuGroup.add(cable);
          }
          
          mainMesh = psuGroup as any;
          break;

        default:
          mainMesh = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshPhongMaterial({ 
              color: color,
              shininess: 100,
              emissive: color.clone().multiplyScalar(0.1)
            })
          );
      }

      group.add(mainMesh);
      group.castShadow = true;
      group.receiveShadow = true;
      
      return group;
    };
  }, []);

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
    scene.background = new THREE.Color(0x0a0f1c);
    scene.fog = new THREE.Fog(0x0a0f1c, 5, 15);
    sceneRef.current = scene;

    // Создание камеры
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(6, 4, 6);
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
    renderer.useLegacyLights = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Освещение
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Цветные точечные источники света
    const pointLight1 = new THREE.PointLight(0x3b82f6, 1, 15);
    pointLight1.position.set(-5, 3, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.8, 12);
    pointLight2.position.set(5, -2, -5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x10b981, 0.6, 10);
    pointLight3.position.set(0, 5, 0);
    scene.add(pointLight3);

    // Материнская плата (платформа)
    const motherboardGeometry = new THREE.BoxGeometry(4, 0.1, 3);
    const motherboardMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x1a365d,
      shininess: 50
    });
    const motherboard = new THREE.Mesh(motherboardGeometry, motherboardMaterial);
    motherboard.position.set(0, -0.5, 0);
    motherboard.receiveShadow = true;
    motherboard.castShadow = true;
    scene.add(motherboard);

    // Добавляем сетку
    const gridHelper = new THREE.GridHelper(10, 10, 0x333333, 0x333333);
    gridHelper.position.y = -1;
    scene.add(gridHelper);

    // Анимационный цикл
    const clock = new THREE.Clock();
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      const deltaTime = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Обновляем миксер анимаций
      if (mixerRef.current) {
        mixerRef.current.update(deltaTime);
      }

      // Вращение камеры вокруг сцены
      camera.position.x = Math.cos(elapsedTime * 0.2) * 8;
      camera.position.z = Math.sin(elapsedTime * 0.2) * 8;
      camera.position.y = 4 + Math.sin(elapsedTime * 0.1) * 1;
      camera.lookAt(0, 0, 0);

      // Анимация компонентов
      Object.values(componentMeshesRef.current).forEach((group, index) => {
        group.rotation.y += 0.005;
        group.position.y += Math.sin(elapsedTime * 1.5 + index) * 0.003;
        
        // Пульсация для подсветки
        group.children.forEach(child => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
            const intensity = 0.1 + Math.sin(elapsedTime * 2 + index) * 0.05;
            child.material.emissive.setScalar(intensity);
          }
        });
      });

      // Анимация освещения
      pointLight1.intensity = 1 + Math.sin(elapsedTime * 1.5) * 0.3;
      pointLight2.intensity = 0.8 + Math.cos(elapsedTime * 2) * 0.2;
      pointLight3.intensity = 0.6 + Math.sin(elapsedTime * 1.8) * 0.2;

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
    Object.values(componentMeshesRef.current).forEach(group => {
      sceneRef.current!.remove(group);
      group.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    });
    componentMeshesRef.current = {};

    // Добавляем новые меши
    Object.entries(selectedComponents).forEach(([category, component]) => {
      const group = createAdvancedComponentMesh(component);
      const [x, y, z] = getComponentPosition(category);
      
      group.position.set(x, y, z);
      
      // Добавляем случайное небольшое вращение для разнообразия
      group.rotation.set(
        Math.random() * 0.2 - 0.1,
        Math.random() * 0.2 - 0.1,
        Math.random() * 0.2 - 0.1
      );

      // Анимация появления
      group.scale.set(0, 0, 0);
      const startTime = Date.now();
      const animateAppearance = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / 500, 1); // 500ms анимация
        const scale = progress * progress * (3 - 2 * progress); // easeInOut
        group.scale.set(scale, scale, scale);
        
        if (progress < 1) {
          requestAnimationFrame(animateAppearance);
        }
      };
      animateAppearance();

      sceneRef.current!.add(group);
      componentMeshesRef.current[category] = group;
    });
  }, [selectedComponents, createAdvancedComponentMesh]);

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden relative ${className}`}
      style={{ minHeight: '400px' }}
    >
      {/* Overlay с информацией */}
      <div className="absolute top-4 left-4 glass-card rounded-lg p-3">
        <div className="text-white text-sm font-medium mb-1">3D Визуализация</div>
        <div className="text-gray-400 text-xs">
          Компонентов: {Object.keys(selectedComponents).length}/8
        </div>
      </div>
      
      {/* Подсказка если нет компонентов */}
      {Object.keys(selectedComponents).length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🖥️</div>
            <div className="text-white text-lg font-medium mb-2">Выберите компоненты</div>
            <div className="text-gray-400 text-sm">
              Они появятся в 3D сцене автоматически
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Enhanced3DScene;