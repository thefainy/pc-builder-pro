import type { Component, ComponentCategory } from '../types';

// Категории компонентов
export const COMPONENT_CATEGORIES = [
  { id: 'cpu', name: 'Процессор', icon: 'Cpu' },
  { id: 'gpu', name: 'Видеокарта', icon: 'Gpu' },
  { id: 'ram', name: 'Память', icon: 'Ram' },
  { id: 'storage', name: 'Накопитель', icon: 'Storage' },
  { id: 'psu', name: 'Блок питания', icon: 'Psu' },
  { id: 'motherboard', name: 'Материнская плата', icon: 'Motherboard' },
  { id: 'cooler', name: 'Охлаждение', icon: 'Cooler' },
  { id: 'case', name: 'Корпус', icon: 'Case' },
] as const;

// Моковые данные компонентов
export const MOCK_COMPONENTS: Component[] = [
  // Процессоры
  {
    id: 'cpu-1',
    name: 'Intel Core i7-13700K',
    brand: 'Intel',
    price: 185000,
    category: 'cpu',
    rating: 4.8,
    color: '#3b82f6',
    availability: 'in_stock',
    description: 'Мощный 16-ядерный процессор для игр и работы',
    features: ['16 ядер', '24 потока', 'Частота до 5.4 ГГц', 'Разблокированный множитель'],
    specs: {
      cores: '16',
      threads: '24',
      frequency: '3.4 ГГц',
      boost: '5.4 ГГц',
      cache: '30 МБ',
      tdp: '125 Вт',
      socket: 'LGA1700',
      power: '125'
    }
  },
  {
    id: 'cpu-2',
    name: 'AMD Ryzen 7 7700X',
    brand: 'AMD',
    price: 162000,
    category: 'cpu',
    rating: 4.7,
    color: '#ef4444',
    availability: 'in_stock',
    description: '8-ядерный процессор на архитектуре Zen 4',
    features: ['8 ядер', '16 потоков', 'Частота до 5.4 ГГц', 'Техпроцесс 5 нм'],
    specs: {
      cores: '8',
      threads: '16',
      frequency: '4.5 ГГц',
      boost: '5.4 ГГц',
      cache: '32 МБ',
      tdp: '105 Вт',
      socket: 'AM5',
      power: '105'
    }
  },
  {
    id: 'cpu-3',
    name: 'Intel Core i5-13600K',
    brand: 'Intel',
    price: 133000,
    category: 'cpu',
    rating: 4.6,
    color: '#3b82f6',
    availability: 'in_stock',
    description: 'Оптимальный выбор для игр и повседневных задач',
    features: ['14 ядер', '20 потоков', 'Частота до 5.1 ГГц', 'Отличное соотношение цена/качество'],
    specs: {
      cores: '14',
      threads: '20',
      frequency: '3.5 ГГц',
      boost: '5.1 ГГц',
      cache: '24 МБ',
      tdp: '125 Вт',
      socket: 'LGA1700',
      power: '125'
    }
  },

  // Видеокарты
  {
    id: 'gpu-1',
    name: 'NVIDIA RTX 4070',
    brand: 'NVIDIA',
    price: 259000,
    category: 'gpu',
    rating: 4.9,
    color: '#10b981',
    availability: 'in_stock',
    description: 'Отличная видеокарта для игр в 1440p с RTX',
    features: ['12 ГБ GDDR6X', 'Ray Tracing 3.0', 'DLSS 3.0', 'AV1 кодирование'],
    specs: {
      memory: '12 ГБ GDDR6X',
      power: '200',
      boost: '2475 МГц',
      memory_speed: '21 Гбит/с',
      bus: '192 бит',
      cuda_cores: '5888'
    }
  },
  {
    id: 'gpu-2',
    name: 'AMD RX 7800 XT',
    brand: 'AMD',
    price: 237000,
    category: 'gpu',
    rating: 4.8,
    color: '#ef4444',
    availability: 'in_stock',
    description: 'Мощная видеокарта с большим объемом памяти',
    features: ['16 ГБ GDDR6', 'Ray Tracing', 'FSR 3.0', 'AV1 кодирование'],
    specs: {
      memory: '16 ГБ GDDR6',
      power: '263',
      boost: '2430 МГц',
      memory_speed: '19.5 Гбит/с',
      bus: '256 бит',
      stream_processors: '3840'
    }
  },
  {
    id: 'gpu-3',
    name: 'NVIDIA RTX 4060 Ti',
    brand: 'NVIDIA',
    price: 207000,
    category: 'gpu',
    rating: 4.7,
    color: '#10b981',
    availability: 'in_stock',
    description: 'Идеальный выбор для игр в 1080p и 1440p',
    features: ['8 ГБ GDDR6X', 'Ray Tracing 3.0', 'DLSS 3.0', 'Энергоэффективность'],
    specs: {
      memory: '8 ГБ GDDR6X',
      power: '165',
      boost: '2535 МГц',
      memory_speed: '18 Гбит/с',
      bus: '128 бит',
      cuda_cores: '4352'
    }
  },

  // Память
  {
    id: 'ram-1',
    name: 'Corsair Vengeance DDR5-5600 32GB',
    brand: 'Corsair',
    price: 59000,
    category: 'ram',
    rating: 4.6,
    color: '#8b5cf6',
    availability: 'in_stock',
    description: 'Высокоскоростная память DDR5 для современных систем',
    features: ['32 ГБ (2x16 ГБ)', 'DDR5-5600', 'RGB подсветка', 'Тайминги CL36'],
    specs: {
      capacity: '32 ГБ',
      speed: 'DDR5-5600',
      modules: '2x16 ГБ',
      timings: 'CL36-36-36-76',
      voltage: '1.25 В',
      power: '15'
    }
  },
  {
    id: 'ram-2',
    name: 'G.Skill Trident Z5 DDR5-6000 16GB',
    brand: 'G.Skill',
    price: 33000,
    category: 'ram',
    rating: 4.7,
    color: '#f59e0b',
    availability: 'in_stock',
    description: 'Премиальная память с высокой частотой',
    features: ['16 ГБ (2x8 ГБ)', 'DDR5-6000', 'RGB подсветка', 'Низкие тайминги'],
    specs: {
      capacity: '16 ГБ',
      speed: 'DDR5-6000',
      modules: '2x8 ГБ',
      timings: 'CL30-38-38-96',
      voltage: '1.35 В',
      power: '12'
    }
  },

  // Накопители
  {
    id: 'storage-1',
    name: 'Samsung 980 PRO 1TB',
    brand: 'Samsung',
    price: 55000,
    category: 'storage',
    rating: 4.8,
    color: '#06b6d4',
    availability: 'in_stock',
    description: 'Флагманский NVMe SSD с максимальной производительностью',
    features: ['1 ТБ NVMe', 'Скорость до 7000 МБ/с', 'TLC NAND', '5 лет гарантии'],
    specs: {
      capacity: '1 ТБ',
      type: 'NVMe SSD',
      interface: 'PCIe 4.0 x4',
      read_speed: '7000 МБ/с',
      write_speed: '5000 МБ/с',
      power: '8'
    }
  },
  {
    id: 'storage-2',
    name: 'WD Black SN850X 2TB',
    brand: 'Western Digital',
    price: 89000,
    category: 'storage',
    rating: 4.7,
    color: '#000000',
    availability: 'in_stock',
    description: 'Игровой SSD с большим объемом и высокой скоростью',
    features: ['2 ТБ NVMe', 'Скорость до 7300 МБ/с', 'Игровая оптимизация', 'RGB подсветка'],
    specs: {
      capacity: '2 ТБ',
      type: 'NVMe SSD',
      interface: 'PCIe 4.0 x4',
      read_speed: '7300 МБ/с',
      write_speed: '6600 МБ/с',
      power: '10'
    }
  },

  // Блоки питания
  {
    id: 'psu-1',
    name: 'Corsair RM850x',
    brand: 'Corsair',
    price: 67000,
    category: 'psu',
    rating: 4.8,
    color: '#facc15',
    availability: 'in_stock',
    description: 'Премиальный блок питания с полной модульностью',
    features: ['850 Вт', '80+ Gold', 'Полностью модульный', '10 лет гарантии'],
    specs: {
      power: '850',
      efficiency: '80+ Gold',
      modular: 'Полностью',
      warranty: '10 лет',
      fan_size: '135 мм',
      cables: 'Плоские'
    }
  },
  {
    id: 'psu-2',
    name: 'EVGA SuperNOVA 750W',
    brand: 'EVGA',
    price: 55000,
    category: 'psu',
    rating: 4.6,
    color: '#f97316',
    availability: 'in_stock',
    description: 'Надежный БП с отличным соотношением цена/качество',
    features: ['750 Вт', '80+ Gold', 'Полумодульный', '7 лет гарантии'],
    specs: {
      power: '750',
      efficiency: '80+ Gold',
      modular: 'Полумодульный',
      warranty: '7 лет',
      fan_size: '140 мм',
      cables: 'Стандартные'
    }
  }
];

// Цвета для категорий
export const CATEGORY_COLORS: Record<ComponentCategory, string> = {
  cpu: '#3b82f6',
  gpu: '#10b981',
  ram: '#8b5cf6',
  storage: '#06b6d4',
  psu: '#facc15',
  motherboard: '#ef4444',
  cooler: '#14b8a6',
  case: '#64748b'
};

// Позиции компонентов в 3D сцене
export const COMPONENT_3D_POSITIONS: Record<ComponentCategory, [number, number, number]> = {
  cpu: [0, 0.5, 0],
  gpu: [0, -0.8, 1],
  ram: [-1.2, 0.2, -0.5],
  storage: [1, -0.2, -0.5],
  psu: [0, -1.5, 0],
  motherboard: [0, 0, 0],
  cooler: [0, 0.8, 0],
  case: [0, 0, 0]
};

// Размеры компонентов в 3D
export const COMPONENT_3D_SIZES: Record<ComponentCategory, [number, number, number]> = {
  cpu: [0.8, 0.2, 0.8],
  gpu: [2, 0.4, 0.6],
  ram: [0.15, 0.8, 0.05],
  storage: [0.6, 0.1, 0.4],
  psu: [1, 0.6, 0.8],
  motherboard: [3, 0.1, 2.5],
  cooler: [0.6, 0.6, 0.6],
  case: [4, 3, 3]
};

// Валюты
export const CURRENCIES = {
  KZT: { symbol: '₸', name: 'Тенге' },
  USD: { symbol: '$', name: 'Доллар' },
  RUB: { symbol: '₽', name: 'Рубль' }
};

// Фильтры по умолчанию
export const DEFAULT_FILTERS = {
  brand: [],
  priceRange: [0, 500000] as [number, number],
  rating: 0,
  availability: ['in_stock'],
  sortBy: 'popularity' as const,
  sortOrder: 'desc' as const
};

// Бренды
export const BRANDS = {
  Intel: { name: 'Intel', color: '#0071c5' },
  AMD: { name: 'AMD', color: '#ed1c24' },
  NVIDIA: { name: 'NVIDIA', color: '#76b900' },
  Corsair: { name: 'Corsair', color: '#f2c41d' },
  'G.Skill': { name: 'G.Skill', color: '#ff6600' },
  Kingston: { name: 'Kingston', color: '#e4002b' },
  Samsung: { name: 'Samsung', color: '#1428a0' },
  'Western Digital': { name: 'WD', color: '#0033a0' },
  EVGA: { name: 'EVGA', color: '#00ff00' }
};

// Статусы наличия
export const AVAILABILITY_STATUS = {
  in_stock: { name: 'В наличии', color: '#10b981', icon: 'Check' },
  out_of_stock: { name: 'Нет в наличии', color: '#ef4444', icon: 'X' },
  pre_order: { name: 'Предзаказ', color: '#f59e0b', icon: 'Clock' }
};

// Рекомендуемые конфигурации
export const RECOMMENDED_BUILDS = {
  budget: {
    name: 'Бюджетная сборка',
    budget: 800000,
    description: 'Оптимальная сборка для офисных задач и легких игр',
    components: ['cpu-3', 'gpu-3', 'ram-2', 'storage-1', 'psu-2']
  },
  gaming: {
    name: 'Игровая сборка',
    budget: 1500000,
    description: 'Мощная сборка для современных игр в высоком качестве',
    components: ['cpu-1', 'gpu-1', 'ram-1', 'storage-2', 'psu-1']
  },
  workstation: {
    name: 'Рабочая станция',
    budget: 2500000,
    description: 'Профессиональная сборка для работы и творчества',
    components: ['cpu-1', 'gpu-2', 'ram-1', 'storage-1', 'psu-1']
  }
};