import logo from '../../../assets/logo.png';


const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Esquerda: Logo */}
      <div className="flex items-center">
        <img
          src={logo}
          alt="Logo da Agência"
          className="h-10 w-auto"
        />
      </div>

      {/* Centro: Botões de navegação */}
      <div className="flex gap-4">
        <button className="text-gray-700 hover:text-blue-600 font-medium">Viagens</button>
        <button className="text-gray-700 hover:text-blue-600 font-medium">Reservas</button>
      </div>

      {/* Direita: Perfil */}
      <div>
        <button className="text-gray-700 hover:text-blue-600 font-medium">Perfil</button>
      </div>
    </header>
  );
};

export default Header;
