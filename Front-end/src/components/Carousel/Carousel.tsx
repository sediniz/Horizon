import { useState } from 'react';
import './Carousel.css';

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
    <div className="carousel">
      <button onClick={prevSlide} className="carousel-arrow carousel-arrow-left">
        &#8249;
      </button>

      {imageError ? (
        <div className="carousel-placeholder">
          <p>Imagem não encontrada</p>
          <p>Slide {currentIndex + 1} de {images.length}</p>
        </div>
      ) : (
        <img 
          src={images[currentIndex]} 
          alt={`Slide ${currentIndex + 1}`} 
          className="carousel-image"
          onError={handleImageError}
        />
      )}

      <button onClick={nextSlide} className="carousel-arrow carousel-arrow-right">
        &#8250;
      </button>
    </div>
  );
};

export default Carousel;