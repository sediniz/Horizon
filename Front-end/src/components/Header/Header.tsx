import React, { useEffect, useRef, useState } from 'react';
import LogoTexto from '../../assets/LogoTexto.png';
import planeIcon from '../../assets/aviao.png';

const Header: React.FC = () => {
  const [circlingPlaneStyle, setCirclingPlaneStyle] = useState({
    left: 0,
    top: 0,
    transform: 'translate(-50%, -50/%) rotate(0deg)',
  });

  const logoRef = useRef<HTMLImageElement>(null);

  // Animação do avião circulando a logo
  useEffect(() => {
    let animationId: number;
    let angle = 0;
    const radiusX = 90; // Circunferência vertical
    const radiusY = 40; // Circunferência horizontal
    const speed = 0.03; // Velocidade de rotação

    const circleAroundLogo = () => {
      if (logoRef.current) {
        const logoRect = logoRef.current.getBoundingClientRect();
        const logoCenterX = logoRect.left + logoRect.width / 2;
        const logoCenterY = logoRect.top + logoRect.height / 2 + window.scrollY;

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
  }, []);

  return (
    <div className="relative w-full bg-white/20 backdrop-blur-md shadow-md py-4 px-6 z-50">
      {/* Avião circulando a logo */}
      <img
        src={planeIcon}
        alt="Avião Circulando"
        className="absolute pointer-events-none z-40 opacity-75"
        style={{
          position: 'absolute',
          ...circlingPlaneStyle,
          width: '28px',
        }}
      />

      {/* Linha decorativa */}
      <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 rounded-full" />

      {/* Conteúdo do header */}
      <div className="flex justify-between items-center relative">
        <img ref={logoRef} src={LogoTexto} alt="Horizon - Expanda seus Horizontes" className="h-20 object-contain" />

        <div className="flex gap-4 items-center">
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
          >
            Viagens
          </button>
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
          >
            Reservas
          </button>
        </div>

        <button
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
        >
          Perfil
        </button>
      </div>
    </div>
  );
};

export default Header;