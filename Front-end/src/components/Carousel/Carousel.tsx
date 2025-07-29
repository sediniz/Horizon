import React, { useEffect, useState } from 'react';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Troca automática com efeito suave a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false); // inicia fade-out

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsVisible(true); // inicia fade-in
      }, 500); // tempo da transição
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Altera manualmente
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Imagem com fade */}
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className={`w-full h-[400px] object-cover rounded-lg transition-opacity duration-500 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Bolinhas de navegação */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full ${
              currentIndex === index ? 'bg-black' : 'bg-gray-400'
            } hover:bg-black transition duration-300`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;