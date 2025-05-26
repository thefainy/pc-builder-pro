/**
 * Проверяет валидность токена (примерная проверка)
 */
export function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  } catch {
    return false;
  }
}// API клиент для работы с backend
const API_BASE_URL = 'http://localhost:3000/api';

interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

interface BackendUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isVerified: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: BackendUser;
  tokens: AuthTokens;
}

export class ApiClient {
  private static getAuthHeader(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('accessToken');
    return token ? `Bearer ${token}` : null;
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const authHeader = this.getAuthHeader();
    if (authHeader) {
      config.headers = {
        ...config.headers,
        Authorization: authHeader,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'API Error');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ==================
  // AUTH METHODS
  // ==================

  static async register(userData: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async getCurrentUser(): Promise<ApiResponse<BackendUser>> {
    return this.request('/auth/me');
  }

  static async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  }): Promise<ApiResponse<BackendUser>> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async refreshTokens(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  static async logout(): Promise<ApiResponse<{ message: string }>> {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // ==================
  // COMPONENTS METHODS
  // ==================

  /**
   * Получить все компоненты с фильтрами
   */
  static async getComponents(params?: {
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    components: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/components${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(url);
  }

  /**
   * Получить компонент по ID
   */
  static async getComponentById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/components/${id}`);
  }

  /**
   * Получить популярные компоненты
   */
  static async getPopularComponents(limit?: number): Promise<ApiResponse<any[]>> {
    const url = `/components/popular${limit ? `?limit=${limit}` : ''}`;
    return this.request(url);
  }

  /**
   * Получить компоненты по категории
   */
  static async getComponentsByCategory(category: string, limit?: number): Promise<ApiResponse<any[]>> {
    const url = `/components/category/${category}${limit ? `?limit=${limit}` : ''}`;
    return this.request(url);
  }

  /**
   * Создать компонент (только админ)
   */
  static async createComponent(componentData: {
    name: string;
    brand: string;
    model: string;
    category: string;
    price: number;
    specs: Record<string, any>;
    images?: string[];
    description?: string;
    features?: string[];
    inStock?: boolean;
  }): Promise<ApiResponse<any>> {
    return this.request('/components', {
      method: 'POST',
      body: JSON.stringify(componentData),
    });
  }

  /**
   * Обновить компонент (только админ)
   */
  static async updateComponent(id: string, updateData: any): Promise<ApiResponse<any>> {
    return this.request(`/components/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  /**
   * Удалить компонент (только админ)
   */
  static async deleteComponent(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/components/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Получить статистику компонентов (только админ)
   */
  static async getComponentsStats(): Promise<ApiResponse<{
    total: number;
    inStock: number;
    outOfStock: number;
    byCategory: Record<string, number>;
    averagePrice: number;
  }>> {
    return this.request('/components/stats');
  }

  // ==================
  // UTILITY FUNCTIONS
  // ==================

  /**
   * Проверяет здоровье API
   */
  static async healthCheck(): Promise<{ status: string; database: string }> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return await response.json();
    } catch (error) {
      throw new Error('Не удается подключиться к серверу');
    }
  }

  /**
   * Сохраняет токены в localStorage
   */
  static saveTokens(tokens: AuthTokens): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  /**
   * Очищает токены из localStorage
   */
  static clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Получает сохраненные токены
   */
  static getSavedTokens(): AuthTokens | null {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }
    
    return null;
  }
}

// ==================
// UTILITY FUNCTIONS
// ==================

/**
 * Конвертирует BackendUser в ваш тип User
 */
export function convertBackendUser(backendUser: BackendUser): import('../types').User {
  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.firstName && backendUser.lastName 
      ? `${backendUser.firstName} ${backendUser.lastName}`
      : backendUser.username,
    avatar: backendUser.avatar,
    createdAt: backendUser.createdAt ? new Date(backendUser.createdAt) : new Date(),
    preferences: {
      currency: 'KZT',
      theme: 'dark',
      defaultBudget: 2000000,
      notifications: true
    }
  };
}

/**
 * Конвертирует Backend компонент в формат фронтенда
 */
export function convertBackendComponent(backendComponent: any): import('../types').Component {
  return {
    id: backendComponent.id,
    name: backendComponent.name,
    brand: backendComponent.brand,
    price: backendComponent.price,
    category: backendComponent.category.toLowerCase() as any,
    rating: backendComponent.rating || 4.5,
    image: backendComponent.images?.[0],
    specs: backendComponent.specs || {},
    color: getCategoryColor(backendComponent.category.toLowerCase()),
    availability: backendComponent.inStock ? 'in_stock' as const : 'out_of_stock' as const,
    description: backendComponent.description,
    features: backendComponent.features || []
  };
}

/**
 * Получает цвет для категории компонента
 */
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    cpu: '#3b82f6',
    gpu: '#10b981',
    ram: '#8b5cf6',
    storage: '#06b6d4',
    psu: '#facc15',
    motherboard: '#ef4444',
    cooling: '#14b8a6',
    case: '#64748b'
  };
  
  return colors[category] || '#64748b';
}