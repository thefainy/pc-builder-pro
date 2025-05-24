import { Icons } from './Icons';
import type { Component } from '../../types';
import { CURRENCIES, AVAILABILITY_STATUS } from '../../utils/constants';

interface ComponentCardProps {
  component: Component;
  onSelect: () => void;
  isSelected: boolean;
  currency?: 'KZT' | 'USD' | 'RUB';
}

export function ComponentCard({ 
  component, 
  onSelect, 
  isSelected,
  currency = 'KZT'
}: ComponentCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cpu': return <Icons.Cpu className="icon-md" />;
      case 'gpu': return <Icons.Gpu className="icon-md" />;
      case 'ram': return <Icons.Ram className="icon-md" />;
      case 'storage': return <Icons.Storage className="icon-md" />;
      case 'psu': return <Icons.Psu className="icon-md" />;
      case 'motherboard': return <Icons.Motherboard className="icon-md" />;
      case 'cooler': return <Icons.Settings className="icon-md" />;
      case 'case': return <Icons.Monitor className="icon-md" />;
      default: return <Icons.Monitor className="icon-md" />;
    }
  };

  const getAvailabilityInfo = (availability: Component['availability']) => {
    const status = AVAILABILITY_STATUS[availability];
    return status;
  };

  const availabilityInfo = getAvailabilityInfo(component.availability);
  const currencySymbol = CURRENCIES[currency].symbol;

  return (
    <div 
      className={`component-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div 
          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
            isSelected 
              ? 'bg-blue-500 text-white' 
              : 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20'
          }`}
        >
          {getCategoryIcon(component.category)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
            {component.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs font-medium">{component.brand}</span>
            
            <div className="flex items-center gap-1">
              <Icons.Star className="icon-sm text-yellow-400 fill-current" />
              <span className="text-gray-300 text-xs font-medium">{component.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price and Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="text-green-400 font-bold text-lg">
            {currencySymbol}{component.price.toLocaleString()}
          </div>
          {isSelected && (
            <div className="text-blue-400 text-xs font-medium">✓ Выбрано</div>
          )}
        </div>
        
        <div 
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: `${availabilityInfo.color}15`,
            color: availabilityInfo.color 
          }}
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: availabilityInfo.color }} />
          <span>{availabilityInfo.name}</span>
        </div>
      </div>

      {/* Specs */}
      {component.specs && (
        <div className="space-y-1 mb-3">
          {Object.entries(component.specs).slice(0, 3).map(([key, value]) => (
            <div key={key} className="flex justify-between text-xs">
              <span className="text-gray-400 capitalize">{key}:</span>
              <span className="text-gray-300 font-medium">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Features */}
      {component.features && component.features.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto">
          {component.features.slice(0, 2).map((feature, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 line-clamp-1"
            >
              {feature}
            </span>
          ))}
          {component.features.length > 2 && (
            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
              +{component.features.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default ComponentCard;