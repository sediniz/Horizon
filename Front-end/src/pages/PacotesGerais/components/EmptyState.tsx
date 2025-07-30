import React from 'react';

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pacote encontrado</h3>
      <p className="text-gray-600 mb-4">Tente ajustar os filtros para encontrar mais opções</p>
      <button
        onClick={onClearFilters}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Limpar Filtros
      </button>
    </div>
  );
};

export default EmptyState;
