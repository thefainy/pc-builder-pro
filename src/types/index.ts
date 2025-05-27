// Типы для компонентов ПК
export interface Component {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: ComponentCategory;
  rating: number;
  image?: string;
  specs: ComponentSpecs;
  color: string;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order';
  description?: string;
  features?: string[];
}

export type ComponentCategory = 'cpu' | 'gpu' | 'ram' | 'storage' | 'psu' | 'motherboard' | 'cooler' | 'case';

export interface ComponentSpecs {
  [key: string]: string | number;
}

// Типы для сборки ПК
export interface PCBuild {
  id: string;
  name: string;
  description?: string;
  selectedComponents: Record<ComponentCategory, Component>;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags?: string[];
}

// Состояние приложения
// Состояние приложения (ЕДИНСТВЕННОЕ определение)
export interface AppState {
  selectedComponents: Record<string, Component>;
  budget: number;
  currentPage: 'auth' | 'builder' | 'profile' | 'builds' | 'build-gallery';
  isLoggedIn: boolean;
  user?: User;
  components: Component[];
  builds: PCBuild[];
  myBuilds: PCBuild[];
  publicBuilds: PCBuild[];
  currentBuild: PCBuild | null;
  buildsLoading: boolean;
  filters: ComponentFilters;
  searchTerm: string;
  activeCategory: ComponentCategory;
}

// Фильтры компонентов
export interface ComponentFilters {
  brand?: string[];
  priceRange?: [number, number];
  rating?: number;
  availability?: ('in_stock' | 'out_of_stock' | 'pre_order')[];
  sortBy?: 'price' | 'rating' | 'name' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

// Пользователь
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  currency: 'KZT' | 'USD' | 'RUB';
  theme: 'dark' | 'light';
  defaultBudget: number;
  notifications: boolean;
}

// Действия для редьюсера
export type AppAction = 
  | { type: 'ADD_COMPONENT'; category: string; component: Component }
  | { type: 'REMOVE_COMPONENT'; category: string }
  | { type: 'SET_BUDGET'; budget: number }
  | { type: 'RESET_BUILD' }
  | { type: 'SET_PAGE'; page: AppState['currentPage'] }
  | { type: 'LOGIN'; user: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_SEARCH'; searchTerm: string }
  | { type: 'SET_CATEGORY'; category: ComponentCategory }
  | { type: 'SET_FILTERS'; filters: Partial<ComponentFilters> }
  | { type: 'SAVE_BUILD'; build: PCBuild }
  | { type: 'LOAD_BUILDS'; builds: PCBuild[] }
  | { type: 'SET_COMPONENTS'; components: Component[] }
  | { type: 'SET_MY_BUILDS'; builds: PCBuild[] }        // НОВОЕ
  | { type: 'SET_PUBLIC_BUILDS'; builds: PCBuild[] }    // НОВОЕ
  | { type: 'SET_CURRENT_BUILD'; build: PCBuild | null } // НОВОЕ
  | { type: 'SET_BUILDS_LOADING'; loading: boolean };   // НОВОЕ

// 3D модели
export interface Component3DModel {
  category: ComponentCategory;
  geometry: 'box' | 'cylinder' | 'sphere' | 'custom';
  dimensions: [number, number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  emissiveIntensity?: number;
}

// API типы
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ComponentsResponse extends ApiResponse<Component[]> {}
export interface BuildsResponse extends ApiResponse<PCBuild[]> {}
export interface UserResponse extends ApiResponse<User> {}


// Уведомления
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Совместимость компонентов
export interface CompatibilityCheck {
  isCompatible: boolean;
  warnings: string[];
  recommendations?: string[];
}

// Анализ сборки
export interface BuildAnalysis {
  totalPrice: number;
  powerConsumption: number;
  performanceScore: number;
  balanceScore: number; // Насколько сбалансирована сборка
  bottlenecks: string[];
  recommendations: string[];
  compatibility: CompatibilityCheck;
}
// ДОБАВЬТЕ эти типы в ваш существующий файл src/types/index.ts

// Типы для сборок
export interface PCBuild {
  id: string;
  name: string;
  description?: string;
  totalPrice: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  components: BuildComponent[];
}

export interface BuildComponent {
  category: ComponentCategory;
  component: {
    id: string;
    name: string;
    brand: string;
    model: string;
    price: number;
    currency: string;
    image?: string;
    specs: Record<string, any>;
  };
  quantity: number;
}

export interface BuildsListResponse {
  builds: PCBuild[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

