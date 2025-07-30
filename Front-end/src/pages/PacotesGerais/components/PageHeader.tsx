import React from 'react';

const PageHeader: React.FC = () => {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Todos os Pacotes</h1>
        <p className="text-gray-600">Encontre o destino perfeito para sua próxima viagem</p>
      </div>
    </div>
  );
};

export default PageHeader;
