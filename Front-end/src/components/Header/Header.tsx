import React from 'react';
import logo2 from '../../assets/logo2.png';

const Header: React.FC = () => {
  return (
    <div className=" top-0 left-0 right-0 z-50 w-full">
      {/* Faixa de fundo translúcida */}
      
      {/* Conteúdo do header */}
      <div className="flex justify-between items-center px-6 pt-2 pb-0">

        {/* Logo */}
        <img
          src={logo2}
          alt="Logo2"
          className="h-20 object-contain"
        />

        {/* Botões centrais */}
        <div className="flex gap-4">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Viagens
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Reservas
          </button>
        </div>

        {/* Botão Perfil */}
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
          Perfil
        </button>
      </div>
    </div>
  );
};

export default Header;