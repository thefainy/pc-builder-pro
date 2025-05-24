import { useReducer, useCallback, useMemo } from 'react';
import type { AppState, AppAction, Component, ComponentCategory, BuildAnalysis, CompatibilityCheck } from '../types';

const initialState: AppState = {
  selectedComponents: {},
  budget: 2000000, // 2 млн тенге
  currentPage: 'builder',
  isLoggedIn: false,
  components: [],
  builds: [],
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
    
    default:
      return state;
  }
}

export function useBuild() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Вычисляемые значения
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

  // Действия
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
    
    login: useCallback((user: any) => {
      dispatch({ type: 'LOGIN', user });
    }, []),
    
    logout: useCallback(() => {
      dispatch({ type: 'LOGOUT' });
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
    }, [])
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