import { useState } from 'react';
import { Icons } from './Icons';

interface SaveBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description?: string; isPublic: boolean }) => Promise<void>;
  isLoading?: boolean;
}

export function SaveBuildModal({ isOpen, onClose, onSave, isLoading = false }: SaveBuildModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название сборки обязательно';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Название должно содержать минимум 3 символа';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Название не должно превышать 100 символов';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Описание не должно превышать 500 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSave({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        isPublic: formData.isPublic
      });

      // Сбрасываем форму после успешного сохранения
      setFormData({ name: '', description: '', isPublic: false });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Ошибка сохранения сборки' 
      });
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: '', description: '', isPublic: false });
      setErrors({});
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl max-w-md w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Icons.Heart className="w-6 h-6 mr-3 text-pink-400" />
            Сохранить сборку
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <Icons.Close className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Название */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название сборки *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`input-field w-full ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Например: Игровая сборка 2024"
              disabled={isLoading}
              maxLength={100}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Описание (опционально)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`input-field w-full resize-none ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Опишите вашу сборку..."
              rows={3}
              disabled={isLoading}
              maxLength={500}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-sm text-red-400">{errors.description}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400">
                {formData.description.length}/500
              </span>
            </div>
          </div>

          {/* Публичность */}
          <div className="glass-card rounded-lg p-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="mt-1"
                disabled={isLoading}
              />
              <div>
                <div className="text-white font-medium">Сделать сборку публичной</div>
                <div className="text-gray-400 text-sm">
                  Другие пользователи смогут просматривать и копировать вашу сборку
                </div>
              </div>
            </label>
          </div>

          {/* Ошибка отправки */}
          {errors.submit && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-spinner"></div>
                  <span>Сохранение...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Icons.Heart className="w-4 h-4" />
                  <span>Сохранить</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SaveBuildModal;