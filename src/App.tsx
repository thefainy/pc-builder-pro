import { useState, useEffect } from 'react';
import AuthPage from './pages/auth/AuthPage';
import BuilderPage from './pages/builder/BuilderPage';
import { useBuild } from './hooks/useBuild';
import { ApiClient } from './utils/api';
import type { User } from './types';

function App() {
  const { state, actions } = useBuild();
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  
  // Локальное состояние для авторизации (более надежно)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Проверяем подключение к API при загрузке
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        await ApiClient.healthCheck();
        setApiStatus('connected');
        console.log('✅ API подключено успешно');
      } catch (error) {
        setApiStatus('disconnected');
        console.warn('⚠️ API недоступно, работаем в demo режиме:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkApiConnection();
  }, []);

  // Синхронизируем с useBuild состоянием
  useEffect(() => {
    if (state.isLoggedIn && state.user) {
      setCurrentUser(state.user);
      setIsLoggedIn(true);
    } else if (!state.isLoggedIn) {
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
  }, [state.isLoggedIn, state.user]);

  const handleLogin = (userData: User) => {
    console.log('🎯 App: handleLogin called with:', userData);
    
    // Обновляем локальное состояние немедленно
    setCurrentUser(userData);
    setIsLoggedIn(true);
    
    // Сохраняем в localStorage для совместимости
    localStorage.setItem('pcbuilder_user', JSON.stringify(userData));
    
    console.log('✅ Login state updated locally');
  };

  const handleLogout = async () => {
    console.log('🚪 App: handleLogout called');
    
    // Очищаем локальное состояние немедленно
    setCurrentUser(null);
    setIsLoggedIn(false);
    
    // Выходим через useBuild (очистит токены если API доступно)
    if (actions.logout) {
      await actions.logout();
    }
    
    // Дополнительно очищаем localStorage
    localStorage.removeItem('pcbuilder_user');
    localStorage.removeItem('pcbuilder_build');
    
    console.log('✅ Logout completed');
  };

  // Показываем загрузочный экран
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-medium mb-2">PC Builder Pro</h2>
          <p className="text-gray-400">Загрузка приложения...</p>
          
          {apiStatus === 'checking' && (
            <p className="text-gray-500 text-sm mt-2">Проверяем подключение к серверу...</p>
          )}
        </div>
      </div>
    );
  }

  // Показываем статус API в dev режиме
  const ApiStatusIndicator = () => {
    // Проверяем dev режим через import.meta.env (Vite)
    if (import.meta.env.MODE !== 'development') return null;
    
    return (
      <div className={`fixed top-4 right-4 px-3 py-1 rounded-full text-xs font-medium z-50 ${
        apiStatus === 'connected' 
          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
          : 'bg-red-500/20 text-red-400 border border-red-500/30'
      }`}>
        {apiStatus === 'connected' ? '🟢 API Online' : '🔴 API Offline'}
        <span className="ml-2 text-xs">
          {isLoggedIn ? '👤' : '🚪'}
        </span>
      </div>
    );
  };

  // Debug info
  console.log('🐛 App render - Local isLoggedIn:', isLoggedIn, 'useBuild isLoggedIn:', state.isLoggedIn, 'user:', currentUser?.email);

  // Рендерим соответствующую страницу
  return (
    <>
      <ApiStatusIndicator />
      
      {!isLoggedIn ? (
        <AuthPage onLogin={handleLogin} />
      ) : (
        <BuilderPage user={currentUser} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;