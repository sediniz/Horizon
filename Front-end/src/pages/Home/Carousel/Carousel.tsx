import { useState } from 'react';

type CarouselProps = {
  images: string[];
};

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setImageError(false);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="flex items-center justify-center gap-5 p-5 bg-[#fafafa] rounded-[10px] my-5">
      <button
        onClick={prevSlide}
        className="bg-[#0080ff] text-white text-2xl px-4 py-2 rounded-[6px] transition-colors duration-300 hover:bg-[#0066cc]"
      >
        &#8249;
      </button>

      {imageError ? (
        <div className="w-[500px] h-[300px] bg-[#f0f0f0] border-2 border-dashed border-[#ccc] rounded-[8px] flex flex-col items-center justify-center text-[#666] text-base">
          <p className="my-1">Imagem não encontrada</p>
          <p className="my-1">Slide {currentIndex + 1} de {images.length}</p>
        </div>
      ) : (
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          onError={handleImageError}
          className="w-[500px] h-[300px] object-cover rounded-[8px] shadow-md"
        />
      )}

      <button
        onClick={nextSlide}
        className="bg-[#0080ff] text-white text-2xl px-4 py-2 rounded-[6px] transition-colors duration-300 hover:bg-[#0066cc]"
      >
        &#8250;
      </button>
    </div>
  );
};

export default Carousel;