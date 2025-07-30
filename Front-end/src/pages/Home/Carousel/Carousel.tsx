import React, { useEffect, useState } from 'react';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const nextSlide = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsVisible(true);
    }, 300);
  };

  const prevSlide = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setIsVisible(true);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;

    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsVisible(true);
    }, 300);
  };

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <div
      className="relative w-full group mt-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden shadow-2xl">
        <img
          src={images[currentIndex]}
          alt={`Destino ${currentIndex + 1}`}
          className={`w-full h-[500px] object-cover transition-all duration-300 ease-in-out ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
          aria-label="Slide anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
          aria-label="Próximo slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bolinhas de navegação */}
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