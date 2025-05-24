import { useState } from 'react';
import { Icons } from '../ui/Icons';
import type { User } from '../../types';

interface HeaderProps {
  budget: number;
  totalPrice: number;
  onBudgetChange: (budget: number) => void;
  onResetBuild: () => void;
  onLogout: () => void;
  user?: User;
  selectedComponentsCount: number;
  isOverBudget: boolean;
}

export function Header({
  budget,
  totalPrice,
  onBudgetChange,
  onResetBuild,
  onLogout,
  user,
  selectedComponentsCount,
  isOverBudget
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget.toString());

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget = parseInt(budgetInput.replace(/\s/g, '')) || 0;
    onBudgetChange(newBudget);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU');
  };

  return (
    <header className="glass-card border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Icons.Monitor className="icon-lg text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">PC Builder Pro</h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                Создавайте идеальные конфигурации ПК
              </p>
            </div>
          </div>
          
          {/* Десктопное меню */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Бюджет */}
            <form onSubmit={handleBudgetSubmit} className="flex items-center space-x-2 text-sm">
              <label className="text-gray-300 font-medium">Бюджет:</label>
              <input
                type="text"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                onBlur={handleBudgetSubmit}
                className="input-field w-28 px-3 py-1.5 text-sm"
                placeholder="2 000 000"
              />
              <span className="text-gray-300">₸</span>
            </form>

            {/* Статистика */}
            <div className="flex items-center space-x-3 text-sm">
              <div className="text-center">
                <div className="text-gray-400 text-xs">Потрачено:</div>
                <div className={`font-bold text-sm ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
                  ₸{formatPrice(totalPrice)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-gray-400 text-xs">Компонентов:</div>
                <div className="font-bold text-blue-400 text-sm">
                  {selectedComponentsCount}/8
                </div>
              </div>
            </div>

            {/* Действия */}
            <div className="flex items-center space-x-2">
              {selectedComponentsCount > 0 && (
                <button
                  onClick={onResetBuild}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
                >
                  <Icons.Reset className="icon-sm" />
                  <span>Сбросить</span>
                </button>
              )}

              {/* Профиль пользователя */}
              {user && (
                <div className="flex items-center space-x-2 px-3 py-1.5 glass-card rounded-lg">
                  <Icons.User className="icon-sm text-gray-400" />
                  <span className="text-gray-300 text-sm">{user.name}</span>
                </div>
              )}

              <button
                onClick={onLogout}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-500/10 text-gray-400 rounded-lg hover:bg-gray-500/20 transition-colors text-sm"
              >
                <Icons.Back className="icon-sm" />
                <span>Выйти</span>
              </button>
            </div>
          </div>

          {/* Мобильное меню */}
          <button 
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? 
              <Icons.Close className="icon-md" /> : 
              <Icons.Menu className="icon-md" />
            }
          </button>
        </div>
      </div>

      {/* Мобильное выпадающее меню */}
      {isMenuOpen && (
        <div className="lg:hidden glass-card border-t border-white/10 p-4 animate-fade-in">
          <div className="space-y-4">
            {/* Бюджет */}
            <form onSubmit={handleBudgetSubmit} className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Бюджет (₸)
              </label>
              <input
                type="text"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="input-field w-full px-3 py-2"
                placeholder="2 000 000"
              />
            </form>

            {/* Статистика */}
            <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/10">
              <div className="text-center">
                <div className="text-gray-400 text-xs">Потрачено</div>
                <div className={`font-bold ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
                  ₸{formatPrice(totalPrice)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs">Компонентов</div>
                <div className="font-bold text-blue-400">
                  {selectedComponentsCount}/8
                </div>
              </div>
            </div>

            {/* Пользователь */}
            {user && (
              <div className="flex items-center space-x-2 py-2">
                <Icons.User className="icon-md text-gray-400" />
                <span className="text-gray-300">{user.name}</span>
                <span className="text-gray-500 text-sm">({user.email})</span>
              </div>
            )}

            {/* Действия */}
            <div className="flex flex-col space-y-2">
              {selectedComponentsCount > 0 && (
                <button
                  onClick={() => {
                    onResetBuild();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Icons.Reset className="icon-sm" />
                  <span>Сбросить сборку</span>
                </button>
              )}

              <button
                onClick={() => {
                  onLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
              >
                <Icons.Back className="icon-sm" />
                <span>Выйти из аккаунта</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;