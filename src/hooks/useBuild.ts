import { useReducer, useCallback, useMemo, useEffect } from 'react';
import type { AppState, AppAction, Component, ComponentCategory, BuildAnalysis, CompatibilityCheck } from '../types';
import { ApiClient, convertBackendUser, convertBackendComponent } from '../utils/api';

const initialState: AppState = {
  selectedComponents: {},
  budget: 2000000, // 2 млн тенге
  currentPage: 'auth',
  isLoggedIn: false,
  components: [],
  builds: [],
  myBuilds: [],          // ДОБАВЛЕНО
  publicBuilds: [],      // ДОБАВЛЕНО
  currentBuild: null,    // ДОБАВЛЕНО
  buildsLoading: false,  // ДОБАВЛЕНО
  filters: {
    sortBy: 'popularity',
    sortOrder: 'desc'
  },
  searchTerm: '',
  activeCategory: 'cpu'
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_COMPONENT':
      return {
        ...state,
        selectedComponents: {
          ...state.selectedComponents,
          [action.category]: action.component
        }
      };
    
    case 'REMOVE_COMPONENT':
      const newComponents = { ...state.selectedComponents };
      delete newComponents[action.category];
      return { ...state, selectedComponents: newComponents };
    
    case 'SET_BUDGET':
      return { ...state, budget: action.budget };
    
    case 'RESET_BUILD':
      return { ...state, selectedComponents: {} };
    
    case 'SET_PAGE':
      return { ...state, currentPage: action.page };
    
    case 'LOGIN':
      return { 
        ...state, 
        isLoggedIn: true, 
        user: action.user,
        currentPage: 'builder'
      };
    
    case 'LOGOUT':
      return { 
        ...state, 
        isLoggedIn: false, 
        user: undefined,
        currentPage: 'auth'
      };
    
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.searchTerm };
    
    case 'SET_CATEGORY':
      return { ...state, activeCategory: action.category };
    
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.filters }
      };
    
    case 'SAVE_BUILD':
      return {
        ...state,
        builds: [...state.builds.filter(b => b.id !== action.build.id), action.build]
      };
    
    case 'LOAD_BUILDS':
      return { ...state, builds: action.builds };
    
    case 'SET_COMPONENTS':
      return { ...state, components: action.components };
    
    // НОВЫЕ CASES
    case 'SET_MY_BUILDS':
      return { ...state, myBuilds: action.builds };
    
    case 'SET_PUBLIC_BUILDS':
      return { ...state, publicBuilds: action.builds };
    
    case 'SET_CURRENT_BUILD':
      return { ...state, currentBuild: action.build };
    
    case 'SET_BUILDS_LOADING':
      return { ...state, buildsLoading: action.loading };
    
    default:
      return state;
  }
}

export function useBuild() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ==================
  // ИНИЦИАЛИЗАЦИЯ
  // ==================

  useEffect(() => {
    // Проверяем сохраненную сессию при загрузке
    const checkSavedSession = async () => {
      const tokens = ApiClient.getSavedTokens();
      
      if (tokens?.accessToken) {
        try {
          const response = await ApiClient.getCurrentUser();
          const user = convertBackendUser(response.data!);
          
          dispatch({ type: 'LOGIN', user });
        } catch (error) {
          console.error('Ошибка восстановления сессии:', error);
          ApiClient.clearTokens();
          // Остаемся на странице auth
        }
      }
    };

    // Загружаем компоненты из API
    const loadComponents = async () => {
      try {
        console.log('🔄 Загружаем компоненты из API...');
        const response = await ApiClient.getComponents({ limit: 100 });
        
        if (response.data && response.data.components) {
          // Конвертируем backend компоненты в frontend формат
          const convertedComponents = response.data.components.map(convertBackendComponent);
          dispatch({ type: 'SET_COMPONENTS', components: convertedComponents });
          console.log('✅ Загружено компонентов:', convertedComponents.length);
        }
      } catch (error) {
        console.error('⚠️ Ошибка загрузки компонентов из API:', error);
        // Оставляем пустой массив - компоненты загрузятся из констант или моков
        console.log('📦 Используем локальные данные компонентов');
      }
    };

    checkSavedSession();
    loadComponents();
  }, []);

  // ==================
  // ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ
  // ==================

  const totalPrice = useMemo(() => {
    return Object.values(state.selectedComponents).reduce((sum, comp) => sum + comp.price, 0);
  }, [state.selectedComponents]);

  const budgetPercentage = useMemo(() => {
    return (totalPrice / state.budget) * 100;
  }, [totalPrice, state.budget]);

  const selectedComponentsCount = useMemo(() => {
    return Object.keys(state.selectedComponents).length;
  }, [state.selectedComponents]);

  const isOverBudget = useMemo(() => {
    return totalPrice > state.budget;
  }, [totalPrice, state.budget]);

  // Фильтрация компонентов
  const filteredComponents = useMemo(() => {
    return state.components.filter(component => {
      // Фильтр по категории
      if (component.category !== state.activeCategory) return false;
      
      // Поиск по названию
      if (state.searchTerm && !component.name.toLowerCase().includes(state.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Фильтр по бренду
      if (state.filters.brand?.length && !state.filters.brand.includes(component.brand)) {
        return false;
      }
      
      // Фильтр по цене
      if (state.filters.priceRange) {
        const [min, max] = state.filters.priceRange;
        if (component.price < min || component.price > max) return false;
      }
      
      // Фильтр по рейтингу
      if (state.filters.rating && component.rating < state.filters.rating) {
        return false;
      }
      
      // Фильтр по наличию
      if (state.filters.availability?.length && !state.filters.availability.includes(component.availability)) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      const { sortBy, sortOrder } = state.filters;
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [state.components, state.activeCategory, state.searchTerm, state.filters]);

  // Проверка совместимости
  const checkCompatibility = useCallback((): CompatibilityCheck => {
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    const cpu = state.selectedComponents.cpu;
    const gpu = state.selectedComponents.gpu;
    const psu = state.selectedComponents.psu;
    
    // Проверка мощности БП
    if (psu && gpu) {
      const gpuPower = parseInt(gpu.specs.power as string) || 0;
      const cpuPower = parseInt(cpu?.specs.power as string) || 65;
      const totalPower = gpuPower + cpuPower + 100; // +100W для остальных компонентов
      const psuPower = parseInt(psu.specs.power as string) || 0;
      
      if (psuPower < totalPower * 1.2) {
        warnings.push('Мощность блока питания может быть недостаточной');
        recommendations.push(`Рекомендуется БП мощностью не менее ${Math.ceil(totalPower * 1.2)}W`);
      }
    }
    
    // Проверка баланса CPU/GPU
    if (cpu && gpu) {
      const cpuPrice = cpu.price;
      const gpuPrice = gpu.price;
      const ratio = gpuPrice / cpuPrice;
      
      if (ratio > 3) {
        warnings.push('Видеокарта слишком мощная для данного процессора');
        recommendations.push('Рассмотрите более мощный процессор или менее дорогую видеокарту');
      } else if (ratio < 0.5) {
        warnings.push('Процессор слишком мощный для данной видеокарты');
        recommendations.push('Рассмотрите более мощную видеокарту или менее дорогой процессор');
      }
    }
    
    return {
      isCompatible: warnings.length === 0,
      warnings,
      recommendations
    };
  }, [state.selectedComponents]);

  // Анализ сборки
  const buildAnalysis = useMemo((): BuildAnalysis => {
    const compatibility = checkCompatibility();
    
    // Расчет потребления энергии
    const powerConsumption = Object.values(state.selectedComponents).reduce((total, component) => {
      const power = parseInt(component.specs.power as string) || 0;
      return total + power;
    }, 0);
    
    // Расчет баланса сборки (0-100)
    const componentPrices = Object.values(state.selectedComponents).map(c => c.price);
    const avgPrice = componentPrices.reduce((sum, price) => sum + price, 0) / componentPrices.length;
    const variance = componentPrices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / componentPrices.length;
    const balanceScore = Math.max(0, 100 - (variance / 10000)); // Упрощенная формула
    
    // Расчет производительности (упрощенный)
    const performanceScore = Object.values(state.selectedComponents).reduce((score, component) => {
      return score + (component.rating * 10);
    }, 0) / Object.keys(state.selectedComponents).length || 0;
    
    return {
      totalPrice,
      powerConsumption,
      performanceScore: Math.round(performanceScore),
      balanceScore: Math.round(balanceScore),
      bottlenecks: compatibility.warnings,
      recommendations: compatibility.recommendations || [],
      compatibility
    };
  }, [state.selectedComponents, totalPrice, checkCompatibility]);

  // ==================
  // API ACTIONS
  // ==================

  const authActions = {
    /**
     * Реальная регистрация через API
     */
    register: useCallback(async (userData: {
      email: string;
      password: string;
      name: string;
    }) => {
      try {
        // Разделяем имя на firstName и lastName
        const nameParts = userData.name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || undefined;
        
        // Генерируем username из email
        const username = userData.email.split('@')[0].toLowerCase();

        const response = await ApiClient.register({
          email: userData.email,
          username,
          password: userData.password,
          firstName,
          lastName
        });

        const { user, tokens } = response.data!;
        
        // Сохраняем токены
        ApiClient.saveTokens(tokens);
        
        // Конвертируем и логиним пользователя
        const convertedUser = convertBackendUser(user);
        
        // ВАЖНО: Обновляем состояние через dispatch
        dispatch({ type: 'LOGIN', user: convertedUser });
        
        return convertedUser;
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    }, []),

    /**
     * Реальный логин через API
     */
    login: useCallback(async (credentials: {
      email: string;
      password: string;
    }) => {
      try {
        const response = await ApiClient.login(credentials);
        const { user, tokens } = response.data!;
        
        // Сохраняем токены
        ApiClient.saveTokens(tokens);
        
        // Конвертируем и логиним пользователя
        const convertedUser = convertBackendUser(user);
        
        // ВАЖНО: Обновляем состояние через dispatch
        dispatch({ type: 'LOGIN', user: convertedUser });
        
        return convertedUser;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    }, []),

    /**
     * Выход из системы
     */
    logout: useCallback(async () => {
      try {
        await ApiClient.logout();
      } catch (error) {
        console.error('Logout error:', error);
        // Продолжаем выход даже если API недоступно
      } finally {
        ApiClient.clearTokens();
        dispatch({ type: 'LOGOUT' });
      }
    }, [])
  };

  // ==================
  // НОВЫЕ BUILDS ACTIONS
  // ==================

  const buildActions = {
    /**
     * Сохранить текущую сборку
     */
    saveBuild: useCallback(async (buildData: {
      name: string;
      description?: string;
      isPublic?: boolean;
    }) => {
      try {
        // Конвертируем selectedComponents в формат API
        const components: Record<string, { componentId: string; quantity: number }> = {};
        
        Object.entries(state.selectedComponents).forEach(([category, component]) => {
          components[category] = {
            componentId: component.id,
            quantity: 1
          };
        });

        if (Object.keys(components).length === 0) {
          throw new Error('Добавьте хотя бы один компонент в сборку');
        }

        const response = await ApiClient.createBuild({
          name: buildData.name,
          description: buildData.description,
          isPublic: buildData.isPublic || false,
          components
        });

        // Обновляем список сборок
        await buildActions.loadMyBuilds();

        return response.data;
      } catch (error) {
        console.error('Save build error:', error);
        throw error;
      }
    }, [state.selectedComponents]),

    /**
     * Загрузить мои сборки
     */
    loadMyBuilds: useCallback(async (page: number = 1, limit: number = 10) => {
      try {
        dispatch({ type: 'SET_BUILDS_LOADING', loading: true });
        
        const response = await ApiClient.getMyBuilds(page, limit);
        
        dispatch({ type: 'SET_MY_BUILDS', builds: response.data?.builds || [] });
        
        return response.data;
      } catch (error) {
        console.error('Load my builds error:', error);
        dispatch({ type: 'SET_MY_BUILDS', builds: [] });
        throw error;
      } finally {
        dispatch({ type: 'SET_BUILDS_LOADING', loading: false });
      }
    }, []),

    /**
     * Загрузить публичные сборки
     */
    loadPublicBuilds: useCallback(async (params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: string;
    }) => {
      try {
        dispatch({ type: 'SET_BUILDS_LOADING', loading: true });
        
        const response = await ApiClient.getPublicBuilds(params);
        
        dispatch({ type: 'SET_PUBLIC_BUILDS', builds: response.data?.builds || [] });
        
        return response.data;
      } catch (error) {
        console.error('Load public builds error:', error);
        dispatch({ type: 'SET_PUBLIC_BUILDS', builds: [] });
        throw error;
      } finally {
        dispatch({ type: 'SET_BUILDS_LOADING', loading: false });
      }
    }, []),

    /**
     * Загрузить сборку по ID
     */
    loadBuild: useCallback(async (id: string) => {
      try {
        const response = await ApiClient.getBuildById(id);
        
        const build = response.data;
        dispatch({ type: 'SET_CURRENT_BUILD', build });
        
        return build;
      } catch (error) {
        console.error('Load build error:', error);
        throw error;
      }
    }, []),

    /**
     * Загрузить сборку в конструктор
     */
    loadBuildToBuilder: useCallback(async (id: string) => {
      try {
        const build = await buildActions.loadBuild(id);
        
        // Очищаем текущую сборку
        dispatch({ type: 'RESET_BUILD' });
        
        // Загружаем компоненты сборки
        const selectedComponents: Record<string, Component> = {};
        
        for (const buildComponent of build.components) {
          // Загружаем полную информацию о компоненте
          try {
            const componentResponse = await ApiClient.getComponentById(buildComponent.component.id);
            const fullComponent = convertBackendComponent(componentResponse.data);
            selectedComponents[buildComponent.category.toLowerCase()] = fullComponent;
          } catch (componentError) {
            console.warn(`Не удалось загрузить компонент ${buildComponent.component.id}:`, componentError);
          }
        }
        
        // Устанавливаем компоненты
        Object.entries(selectedComponents).forEach(([category, component]) => {
          dispatch({ type: 'ADD_COMPONENT', category, component });
        });
        
        return build;
      } catch (error) {
        console.error('Load build to builder error:', error);
        throw error;
      }
    }, []),

    /**
     * Скопировать публичную сборку
     */
    copyBuild: useCallback(async (id: string, name: string) => {
      try {
        const response = await ApiClient.copyBuild(id, name);
        
        // Обновляем список своих сборок
        await buildActions.loadMyBuilds();
        
        return response.data;
      } catch (error) {
        console.error('Copy build error:', error);
        throw error;
      }
    }, []),

    /**
     * Удалить сборку
     */
    deleteBuild: useCallback(async (id: string) => {
      try {
        await ApiClient.deleteBuild(id);
        
        // Обновляем список сборок
        await buildActions.loadMyBuilds();
        
        return true;
      } catch (error) {
        console.error('Delete build error:', error);
        throw error;
      }
    }, []),

    /**
     * Обновить сборку
     */
    updateBuild: useCallback(async (id: string, updateData: {
      name?: string;
      description?: string;
      isPublic?: boolean;
    }) => {
      try {
        const response = await ApiClient.updateBuild(id, updateData);
        
        // Обновляем список сборок
        await buildActions.loadMyBuilds();
        
        return response.data;
      } catch (error) {
        console.error('Update build error:', error);
        throw error;
      }
    }, [])
  };

  // ==================
  // ОБЫЧНЫЕ ACTIONS
  // ==================

  const actions = {
    addComponent: useCallback((category: string, component: Component) => {
      dispatch({ type: 'ADD_COMPONENT', category, component });
    }, []),
    
    removeComponent: useCallback((category: string) => {
      dispatch({ type: 'REMOVE_COMPONENT', category });
    }, []),
    
    setBudget: useCallback((budget: number) => {
      dispatch({ type: 'SET_BUDGET', budget });
    }, []),
    
    resetBuild: useCallback(() => {
      dispatch({ type: 'RESET_BUILD' });
    }, []),
    
    setPage: useCallback((page: AppState['currentPage']) => {
      dispatch({ type: 'SET_PAGE', page });
    }, []),
    
    setSearch: useCallback((searchTerm: string) => {
      dispatch({ type: 'SET_SEARCH', searchTerm });
    }, []),
    
    setCategory: useCallback((category: ComponentCategory) => {
      dispatch({ type: 'SET_CATEGORY', category });
    }, []),
    
    setFilters: useCallback((filters: any) => {
      dispatch({ type: 'SET_FILTERS', filters });
    }, []),
    
    setComponents: useCallback((components: Component[]) => {
      dispatch({ type: 'SET_COMPONENTS', components });
    }, []),

    // Добавляем auth actions
    ...authActions,
    
    // Добавляем build actions
    ...buildActions
  };

  return {
    state,
    totalPrice,
    budgetPercentage,
    selectedComponentsCount,
    isOverBudget,
    filteredComponents,
    buildAnalysis,
    actions
  };
}