import React, { useState } from 'react';

interface RatingProps {
  rating: number;
  maxStars?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  color?: string;
}

const Rating: React.FC<RatingProps> = ({ 
  rating, 
  maxStars = 5, 
  size = 'md', 
  showNumber = false,
  interactive = false,
  onRatingChange,
  color = 'text-yellow-400'
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (interactive) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      <div 
        className={`flex ${sizeClasses[size]} ${color}`}
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(maxStars)].map((_, index) => {
          const starRating = index + 1;
          return (
            <span
              key={index}
              className={`transition-colors duration-200 ${
                interactive ? 'cursor-pointer hover:text-yellow-300' : ''
              }`}
              onClick={() => handleStarClick(starRating)}
              onMouseEnter={() => handleStarHover(starRating)}
            >
              {starRating <= displayRating ? '★' : '☆'}
            </span>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      )}
    </div>
  );
};

export default Rating;
