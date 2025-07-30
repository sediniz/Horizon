import React, { useEffect, useRef, useState } from 'react';
import logo2 from '../../assets/logo2.png';
import planeIcon from '../../assets/aviao.png';

const Header: React.FC = () => {
  const [planeStyle, setPlaneStyle] = useState({
    left: 0,
    top: 0,
    transform: 'translate(-50%, -50%) scaleX(1)',
  });

  const logoRef = useRef<HTMLImageElement>(null);
  const viagensRef = useRef<HTMLButtonElement>(null);
  const reservasRef = useRef<HTMLButtonElement>(null);
  const perfilRef = useRef<HTMLButtonElement>(null);

  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const targets = [
      viagensRef.current,
      logoRef.current,
      reservasRef.current,
      perfilRef.current,
    ];

    let index = 0;

    const flyTo = () => {
      const target = targets[index];
      if (target) {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + window.scrollY - 16; // Ajuste refinado (~16px acima da borda superior)


        setPlaneStyle({
          left: centerX,
          top: centerY,
          transform: `translate(-50%, -50%) scaleX(${direction})`,
        });

        setDirection(direction * -1); // Inverte direção
        index = (index + 1) % targets.length;
      }

      setTimeout(flyTo, 4000); // Próximo destino em 4s
    };

    flyTo();
  }, []);

  return (
    <div className="relative w-full bg-white/20 backdrop-blur-md shadow-md py-4 px-6 z-50">
      {/* Avião animado com imagem */}
      <img
        src={planeIcon}
        alt="Avião"
        className="absolute transition-all duration-1000 ease-in-out pointer-events-none z-50"
        style={{
          position: 'absolute',
          ...planeStyle,
          width: '40px',
        }}
      />

      {/* Linha decorativa */}
      <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 rounded-full" />

      {/* Conteúdo do header */}
      <div className="flex justify-between items-center relative">
        <img ref={logoRef} src={logo2} alt="Logo2" className="h-20 object-contain" />

        <div className="flex gap-4 items-center">
          <button
            ref={viagensRef}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
          >
            Viagens
          </button>
          <button
            ref={reservasRef}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
          >
            Reservas
          </button>
        </div>

        <button
          ref={perfilRef}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
        >
          Perfil
        </button>
      </div>
    </div>
  );
};

export default Header;