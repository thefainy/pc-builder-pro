import React, { useState } from 'react';
import { Icons } from '../../components/ui/Icons';
import type { User } from '../../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Имя обязательно';
      } else if (formData.name.length < 2) {
        newErrors.name = 'Имя должно содержать минимум 2 символа';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Подтвердите пароль';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Имитация запроса к серверу
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Создаем пользователя
      const user: User = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        createdAt: new Date(),
        preferences: {
          currency: 'KZT',
          theme: 'dark',
          defaultBudget: 2000000,
          notifications: true
        }
      };

      onLogin(user);
    } catch (error) {
      setErrors({ submit: 'Произошла ошибка при авторизации' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = () => {
    const user: User = {
      id: 'demo-user',
      email: 'demo@pcbuilder.pro',
      name: 'Демо Пользователь',
      createdAt: new Date(),
      preferences: {
        currency: 'KZT',
        theme: 'dark',
        defaultBudget: 2000000,
        notifications: true
      }
    };
    onLogin(user);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData(prev => ({
      ...prev,
      confirmPassword: '',
      name: ''
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Логотип и заголовок */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-2xl mb-6 animate-float">
            <Icons.Monitor className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">PC Builder Pro</h1>
          <p className="text-gray-400 text-lg">
            Создавайте идеальные конфигурации ПК
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-500">
            <Icons.Chart className="w-4 h-4" />
            <span>Анализ совместимости</span>
            <span>•</span>
            <Icons.Chart className="w-4 h-4" />
            <span>3D визуализация</span>
          </div>
        </div>

        {/* Форма авторизации */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          {/* Переключатель режимов */}
          <div className="flex mb-8 p-1 glass-card rounded-lg">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-md transition-all font-medium ${
                isLogin 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Вход
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-md transition-all font-medium ${
                !isLogin 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Имя (только для регистрации) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Полное имя *
                </label>
                <div className="relative">
                  <Icons.User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`input-field w-full pl-10 pr-4 py-3 ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="Введите ваше полное имя"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email адрес *
              </label>
              <div className="relative">
                <Icons.Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`input-field w-full pl-10 pr-4 py-3 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Введите ваш email"
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Пароль */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Пароль *
              </label>
              <div className="relative">
                <Icons.Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`input-field w-full pl-10 pr-12 py-3 ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Введите пароль"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? 
                    <Icons.EyeOff className="w-5 h-5" /> : 
                    <Icons.Eye className="w-5 h-5" />
                  }
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Подтверждение пароля (только для регистрации) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Подтвердите пароль *
                </label>
                <div className="relative">
                  <Icons.Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className={`input-field w-full pl-10 pr-4 py-3 ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="Подтвердите пароль"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Ошибка отправки */}
            {errors.submit && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Кнопка отправки */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                isSubmitting 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : 'btn-primary'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-spinner"></div>
                  <span>{isLogin ? 'Вход...' : 'Регистрация...'}</span>
                </div>
              ) : (
                isLogin ? 'Войти в аккаунт' : 'Создать аккаунт'
              )}
            </button>
          </form>

          {/* Забыли пароль */}
          {isLogin && (
            <div className="mt-6 text-center">
              <button 
                type="button"
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                Забыли пароль?
              </button>
            </div>
          )}

          {/* Переключение режима */}
          <div className="mt-6 text-center">
            <span className="text-gray-400 text-sm">
              {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            </span>
            <button
              type="button"
              onClick={switchMode}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </div>
        </div>

        {/* Быстрый вход */}
        <div className="mt-6 glass-card rounded-lg p-4">
          <p className="text-gray-400 text-sm text-center mb-3">
            Демо доступ для тестирования:
          </p>
          <button
            onClick={handleQuickLogin}
            className="w-full bg-green-500/20 text-green-400 py-2 rounded-lg text-sm hover:bg-green-500/30 transition-colors flex items-center justify-center space-x-2"
          >
            <Icons.Check className="w-4 h-4" />
            <span>🚀 Быстрый вход без регистрации</span>
          </button>
        </div>

        {/* Возможности приложения */}
        <div className="mt-6 glass-card rounded-lg p-4">
          <h3 className="text-white font-medium mb-3 text-center">Возможности PC Builder Pro</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2 text-gray-300">
              <Icons.Chart className="w-4 h-4 text-blue-400" />
              <span>3D визуализация</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Icons.Check className="w-4 h-4 text-green-400" />
              <span>Проверка совместимости</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Icons.Money className="w-4 h-4 text-yellow-400" />
              <span>Контроль бюджета</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Icons.Star className="w-4 h-4 text-purple-400" />
              <span>Рейтинги компонентов</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;