import React, { useEffect, useState } from 'react';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Troca automática com efeito suave a cada 4 segundos
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  // Função para ir para o próximo slide
  const nextSlide = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsVisible(true);
    }, 300);
  };

  // Função para ir para o slide anterior
  const prevSlide = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setIsVisible(true);
    }, 300);
  };

  // Altera manualmente para um slide específico
  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsVisible(true);
    }, 300);
  };

  // Pausa/retoma autoplay ao passar mouse
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto my-8 group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Container da imagem com overlay gradiente */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        {/* Imagem principal */}
        <img
          src={images[currentIndex]}
          alt={`Destino ${currentIndex + 1}`}
          className={`w-full h-[500px] object-cover transition-all duration-300 ease-in-out ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
        
        {/* Overlay gradiente para melhor legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Botão anterior */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
          aria-label="Slide anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Botão próximo */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
          aria-label="Próximo slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicador de slide atual */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Indicadores (bolinhas) melhorados */}
      <div className="flex justify-center items-center gap-3 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative transition-all duration-300 ${
              currentIndex === index 
                ? 'w-8 h-3 bg-blue-600 rounded-full' 
                : 'w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          >
            {currentIndex === index && (
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse opacity-75" />
            )}
          </button>
        ))}
      </div>

      {/* Indicador de autoplay */}
      <div className="flex justify-center mt-4">
        <div className={`text-sm text-gray-500 flex items-center gap-2 ${
          isAutoPlaying ? 'opacity-100' : 'opacity-50'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`} />
          {isAutoPlaying ? 'Reprodução automática ativa' : 'Pausado'}
        </div>
      </div>
    </div>
  );
};

export default Carousel;