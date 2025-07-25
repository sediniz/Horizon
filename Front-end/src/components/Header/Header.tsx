import './Header.css';
import logo from '../../assets/Logo.png';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Logo da Agência" className="header-logo" />
      </div>

      <div className="header-center">
        <button>Viagens</button>
        <button>Reservas</button>
      </div>

      <div className="header-right">
        <button>Perfil</button>
      </div>
    </header>
  );
};

export default Header;