import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#d0f9e3] text-[#002147] py-6 text-center">
      <h2 className="text-2xl font-semibold mb-2">Informações de Contato</h2>
      <div className="flex justify-center gap-6 flex-wrap items-center mb-4">
        <div className="flex items-center gap-2">
          <img src="https://img.icons8.com/ios-filled/24/002147/phone.png" alt="Telefone" />
          <span>(11) 99999-9999</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="https://img.icons8.com/ios-filled/24/002147/new-post.png" alt="Email" />
          <span>contato@exemplo.com</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="https://img.icons8.com/ios-filled/24/002147/marker.png" alt="Localização" />
          <span>São Paulo, Brasil</span>
        </div>
      </div>
      <p className="text-sm">&copy; 2025 - Todos os direitos reservados</p>
    </footer>
  );
};

export default Footer;