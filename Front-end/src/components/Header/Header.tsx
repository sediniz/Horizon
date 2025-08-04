import React, { useEffect, useRef, useState } from 'react';
import HorizonLogoBorda from '../../assets/HorizonLogoBorda.png';
import LogoSemTexto from '../../assets/LogoSemTexto.png';
import planeIcon from '../../assets/aviao.png';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { MdBookmarkBorder } from "react-icons/md";
import { FaGlobeAmericas } from "react-icons/fa";
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../AuthModal/AuthModal';





const Header: React.FC = () => {
  const { usuario, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const [circlingPlaneStyle, setCirclingPlaneStyle] = useState({
    left: 0,
    top: 0,
    transform: 'translate(-50%, -50/%) rotate(0deg)',
  });

  const logoRef = useRef<HTMLImageElement>(null);
  const mobileLogoRef = useRef<HTMLImageElement>(null);

  // Detectar se é mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Animação do avião circulando a logo
  useEffect(() => {
    let animationId: number;
    let angle = 0;
    const radiusX = 90; // Circunferência vertical
    const radiusY = 40; // Circunferência horizontal
    const speed = 0.03; // Velocidade de rotação

    const circleAroundLogo = () => {
      // Só anima se não for mobile e se o logo desktop estiver visível
      if (!isMobile && logoRef.current) {
        const logoRect = logoRef.current.getBoundingClientRect();
        const logoCenterX = logoRect.left + logoRect.width / 2;
        const logoCenterY = logoRect.top + logoRect.height / 2;

        // Movimento circular de dentro para fora (vertical)
        const x = logoCenterX + Math.cos(angle) * radiusX;
        const y = logoCenterY + Math.sin(angle) * radiusY;
        const rotation = (angle * 180) / Math.PI + 90; // Orientação do avião

        setCirclingPlaneStyle({
          left: x,
          top: y,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        });

        angle += speed;
        if (angle > Math.PI * 2) angle = 0; // Reinicia após um círculo completo
      }

      animationId = requestAnimationFrame(circleAroundLogo);
    };

    circleAroundLogo();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isMobile]);

  // Event listener para fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.relative')) {
          setShowUserDropdown(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserDropdown]);

  // Funções para o sistema de autenticação
  const handlePerfilClick = () => {
    console.log(' Botão perfil clicado. Está autenticado?', isAuthenticated);
    if (isAuthenticated) {
      navigate('/perfil');
    } else {
      console.log(' Abrindo modal de autenticação');
      setIsAuthModalOpen(true);
      console.log(' Estado após setIsAuthModalOpen:', !isAuthModalOpen); // será o inverso pois ainda não atualizou
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    navigate('/perfil');
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate('/');
  };

  return (
    <div className="sticky top-0 w-full bg-white/20 backdrop-blur-md shadow-md py-4 px-6 z-50 min-h-[6rem]">
      {/* Avião circulando a logo - apenas no desktop */}
      {!isMobile && (
        <img
          src={planeIcon}
          alt="Avião Circulando"
          className="fixed pointer-events-none z-50 opacity-75"
          style={{
            ...circlingPlaneStyle,
            width: '28px',
          }}
        />
      )}

      {/* Linha decorativa */}
      <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 rounded-full" />

      {/* Conteúdo do header */}
      <div className="flex justify-between items-center relative">
        <Link to="/">
          {/* Logo grande para desktop */}
          <img 
            ref={logoRef} 
            src={HorizonLogoBorda} 
            alt="Horizon - Expanda seus Horizontes" 
            className="hidden md:block object-contain cursor-pointer flex-shrink-0"
            style={{ 
              height: '80px', 
              minHeight: '80px', 
              width: 'auto',
              minWidth: '80px'
            }}
          />
          {/* Logo pequena para mobile */}
          <img 
            ref={mobileLogoRef}
            src={LogoSemTexto} 
            alt="Horizon" 
            className="block md:hidden object-contain cursor-pointer flex-shrink-0"
            style={{ 
              height: '48px', 
              minHeight: '48px',
              width: 'auto',
              minWidth: '48px'
            }}
          />
        </Link>

        <div className="flex gap-4 items-center">
          <Link to="/pacotes">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-lg hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer">
    <FaGlobeAmericas className="w-5 h-5 text-blue-600" />
    Viagens
  </div>
</Link>

          <Link to="/reservas">
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-lg hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer">
    <MdBookmarkBorder className="w-5 h-5 text-blue-600" />
    Reservas
  </div>
</Link>

        </div>

        {/* Botão de Perfil com Dropdown para usuário logado */}
        <div className="relative">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
              >
                <FaUser className="w-5 h-5" />
                {usuario?.nome || 'Perfil'}
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-60">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-800">{usuario?.nome}</p>
                    <p className="text-sm text-gray-600">{usuario?.email}</p>
                  </div>
                  
                  <Link 
                    to="/perfil" 
                    onClick={() => setShowUserDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FaUser className="w-4 h-4" />
                      Meu Perfil
                    </div>
                  </Link>

                  <Link 
                    to="/reservas" 
                    onClick={() => setShowUserDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <MdBookmarkBorder className="w-4 h-4" />
                      Minhas Reservas
                    </div>
                  </Link>

                  <hr className="my-2" />
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sair
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handlePerfilClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
            >
              <FaUser className="w-5 h-5" />
              Entrar
            </button>
          )}
        </div>

      </div>

      {/* Modal de Autenticação */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Header;