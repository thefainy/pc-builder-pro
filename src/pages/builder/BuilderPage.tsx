import React, { useState, useEffect } from 'react';
import { useBuild } from '../../hooks/useBuild';
import { Icons } from '../../components/ui/Icons';
import ComponentCard from '../../components/ui/ComponentCard';
import Enhanced3DScene from '../../components/3d/Enhanced3DScene'; // Новая 3D сцена
import Header from '../../components/layout/Header';
import { COMPONENT_CATEGORIES, MOCK_COMPONENTS } from '../../utils/constants';
import type { ComponentCategory, User } from '../../types';

interface BuilderPageProps {
  user?: User;
  onLogout: () => void;
}

export function BuilderPage({ user, onLogout }: BuilderPageProps) {
  const {
    state,
    totalPrice,
    budgetPercentage,
    selectedComponentsCount,
    isOverBudget,
    filteredComponents,
    buildAnalysis,
    actions
  } = useBuild();

  const [showAnalysis, setShowAnalysis] = useState(false);

  // Инициализация компонентов
  useEffect(() => {
    actions.setComponents(MOCK_COMPONENTS);
  }, [actions]);

  const getIconComponent = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{className?: string}>;
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <Icons.Monitor className="w-4 h-4" />;
  };

  const getBudgetProgressClass = () => {
    if (budgetPercentage > 100) return 'danger';
    if (budgetPercentage > 80) return 'warning';
    return 'safe';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Заголовок */}
      <Header
        budget={state.budget}
        totalPrice={totalPrice}
        onBudgetChange={actions.setBudget}
        onResetBuild={actions.resetBuild}
        onLogout={onLogout}
        user={user}
        selectedComponentsCount={selectedComponentsCount}
        isOverBudget={isOverBudget}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* 3D Визуализация и анализ */}
          <div className="xl:col-span-1 space-y-6">
            {/* 3D Сцена */}
            <div className="glass-card rounded-xl overflow-hidden h-80 xl:h-96">
              <Enhanced3DScene selectedComponents={state.selectedComponents} />
            </div>
            
            {/* Прогресс бюджета */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300 text-sm font-medium">Использование бюджета</span>
                <span className="text-white text-sm font-bold">{Math.round(budgetPercentage)}%</span>
              </div>
              
              <div className="budget-bar mb-3">
                <div 
                  className={`budget-progress ${getBudgetProgressClass()}`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">
                  Остаток: ₸{Math.max(0, state.budget - totalPrice).toLocaleString()}
                </span>
                <span className={isOverBudget ? 'text-red-400' : 'text-green-400'}>
                  {isOverBudget ? 'Превышение!' : 'В рамках бюджета'}
                </span>
              </div>
            </div>

            {/* Анализ сборки */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium flex items-center">
                  <Icons.Chart className="w-4 h-4 mr-2" />
                  Анализ сборки
                </h3>
                <button
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {showAnalysis ? 'Скрыть' : 'Показать'}
                </button>
              </div>

              {showAnalysis && selectedComponentsCount > 0 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Производительность:</span>
                      <div className="text-blue-400 font-medium">{buildAnalysis.performanceScore}/100</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Баланс:</span>
                      <div className="text-green-400 font-medium">{buildAnalysis.balanceScore}/100</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Потребление:</span>
                      <div className="text-yellow-400 font-medium">{buildAnalysis.powerConsumption}W</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Компоненты:</span>
                      <div className="text-purple-400 font-medium">{selectedComponentsCount}/8</div>
                    </div>
                  </div>

                  {buildAnalysis.compatibility.warnings.length > 0 && (
                    <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Icons.Warning className="w-4 h-4 text-yellow-400 mr-2" />
                        <span className="text-yellow-400 font-medium text-sm">Предупреждения</span>
                      </div>
                      {buildAnalysis.compatibility.warnings.map((warning, index) => (
                        <p key={index} className="text-yellow-300 text-xs">{warning}</p>
                      ))}
                    </div>
                  )}

                  {buildAnalysis.compatibility.recommendations && buildAnalysis.compatibility.recommendations.length > 0 && (
                    <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Icons.Info className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="text-blue-400 font-medium text-sm">Рекомендации</span>
                      </div>
                      {buildAnalysis.compatibility.recommendations.map((rec, index) => (
                        <p key={index} className="text-blue-300 text-xs">{rec}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedComponentsCount === 0 && (
                <div className="text-center py-4">
                  <Icons.Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Выберите компоненты для анализа</p>
                </div>
              )}
            </div>
          </div>

          {/* Выбор компонентов */}
          <div className="xl:col-span-3 space-y-6">
            {/* Категории */}
            <div className="flex flex-wrap gap-2">
              {COMPONENT_CATEGORIES.map((category) => {
                const isActive = state.activeCategory === category.id;
                const hasSelected = state.selectedComponents[category.id];
                
                return (
                  <button
                    key={category.id}
                    onClick={() => actions.setCategory(category.id as ComponentCategory)}
                    className={`category-tab ${isActive ? 'active' : ''}`}
                  >
                    {getIconComponent(category.icon)}
                    <span className="text-sm font-medium">{category.name}</span>
                    {hasSelected && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border border-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Поиск и фильтры */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 icon-sm" />
                <input
                  type="text"
                  placeholder="Поиск компонентов..."
                  value={state.searchTerm}
                  onChange={(e) => actions.setSearch(e.target.value)}
                  className="input-field w-full pl-9 pr-4 py-2.5"
                />
              </div>
              
              <button className="btn-secondary flex items-center space-x-2">
                <Icons.Filter className="icon-sm" />
                <span>Фильтры</span>
              </button>
            </div>

            {/* Счетчик результатов */}
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Найдено {filteredComponents.length} компонентов в категории "{COMPONENT_CATEGORIES.find(c => c.id === state.activeCategory)?.name}"
              </p>
              
              {state.selectedComponents[state.activeCategory] && (
                <button
                  onClick={() => actions.removeComponent(state.activeCategory)}
                  className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1"
                >
                  <Icons.Close className="icon-sm" />
                  <span>Убрать выбранный</span>
                </button>
              )}
            </div>

            {/* Сетка компонентов */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComponents.map((component) => (
                <ComponentCard
                  key={component.id}
                  component={component}
                  onSelect={() => actions.addComponent(state.activeCategory, component)}
                  isSelected={state.selectedComponents[state.activeCategory]?.id === component.id}
                  currency="KZT"
                />
              ))}
            </div>

            {/* Пустое состояние */}
            {filteredComponents.length === 0 && (
              <div className="text-center py-12">
                <Icons.Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">Компоненты не найдены</h3>
                <p className="text-gray-400 mb-4">
                  Попробуйте изменить поисковый запрос или выбрать другую категорию
                </p>
                <button
                  onClick={() => actions.setSearch('')}
                  className="btn-primary"
                >
                  Очистить поиск
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Сводка выбранных компонентов */}
        {selectedComponentsCount > 0 && (
          <div className="mt-8 glass-card rounded-xl p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Icons.Cart className="w-6 h-6 mr-3" />
                Ваша сборка ({selectedComponentsCount}/8 компонентов)
              </h2>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-400">₸{totalPrice.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Общая стоимость</div>
                </div>
                
                <button className="btn-primary flex items-center space-x-2">
                  <Icons.Heart className="w-4 h-4" />
                  <span>Сохранить сборку</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(state.selectedComponents).map(([category, component]) => {
                const categoryInfo = COMPONENT_CATEGORIES.find(cat => cat.id === category);
                
                return (
                  <div key={category} className="glass-card rounded-lg p-4 hover:bg-white/10 transition-colors group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                          {categoryInfo && getIconComponent(categoryInfo.icon)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-white font-medium text-sm line-clamp-2">{component.name}</h4>
                          <p className="text-gray-400 text-xs">{categoryInfo?.name}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Icons.Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-gray-400 text-xs">{component.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-green-400 font-bold text-sm">₸{component.price.toLocaleString()}</p>
                      <button
                        onClick={() => actions.removeComponent(category)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                        title="Удалить компонент"
                      >
                        <Icons.Close className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Рекомендации по завершению сборки */}
            {selectedComponentsCount < 5 && (
              <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center mb-2">
                  <Icons.Info className="w-5 h-5 text-blue-400 mr-2" />
                  <h3 className="text-blue-400 font-medium">Рекомендации для завершения сборки</h3>
                </div>
                <p className="text-blue-300 text-sm">
                  Для полноценной сборки рекомендуется выбрать минимум: процессор, видеокарту, память, накопитель и блок питания.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BuilderPage;