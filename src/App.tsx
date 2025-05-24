import { useState, useEffect } from 'react';
import AuthPage from './pages/auth/AuthPage';
import BuilderPage from './pages/builder/BuilderPage';
import type { User } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<'auth' | 'builder'>('auth');
  const [user, setUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем сохраненную сессию при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem('pcbuilder_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setCurrentPage('builder');
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('pcbuilder_user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('builder');
    
    // Сохраняем пользователя в localStorage
    localStorage.setItem('pcbuilder_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(undefined);
    setCurrentPage('auth');
    
    // Очищаем сохраненные данные
    localStorage.removeItem('pcbuilder_user');
    localStorage.removeItem('pcbuilder_build');
  };

  // Показываем загрузочный экран
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-medium mb-2">PC Builder Pro</h2>
          <p className="text-gray-400">Загрузка приложения...</p>
        </div>
      </div>
    );
  }

  // Рендерим соответствующую страницу
  switch (currentPage) {
    case 'auth':
      return <AuthPage onLogin={handleLogin} />;
    
    case 'builder':
      return <BuilderPage user={user} onLogout={handleLogout} />;
    
    default:
      return <AuthPage onLogin={handleLogin} />;
  }
}

export default App;