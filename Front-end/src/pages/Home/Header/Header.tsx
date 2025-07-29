import React from 'react';
import logo from '../../../assets/Logo.png';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center px-10 py-5 bg-gray-100">
      <div className="header-left">
        <img src={logo} alt="Logo da Agência" className="w-30" />
      </div>

      <div className="flex gap-6">
        <button className="bg-transparent border border-gray-700 px-3.5 py-2 rounded-md cursor-pointer font-medium hover:bg-gray-200 transition-colors duration-200">
          Viagens
        </button>
        <button className="bg-transparent border border-gray-700 px-3.5 py-2 rounded-md cursor-pointer font-medium hover:bg-gray-200 transition-colors duration-200">
          Reservas
        </button>
      </div>

      <div>
        <button className="bg-blue-500 text-white border-0 px-3.5 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors duration-200">
          Perfil
        </button>
      </div>
    </header>
  );
};

export default Header;