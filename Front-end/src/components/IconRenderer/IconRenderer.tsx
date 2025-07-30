import React from 'react';

interface IconRendererProps {
  iconName: string;
  className?: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({ iconName, className = "w-5 h-5" }) => {
  const getIconSVG = (name: string) => {
    switch (name) {
      case 'wifi':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5.12.25.12.55 0 .8C19.17 15.87 15.79 18 12 18s-7.17-2.13-8.82-5.5c-.12-.25-.12-.55 0-.8C4.83 8.13 8.21 6 12 6zm0-2C7.03 4 2.73 6.8 1 11c.03.04.04.09.08.13C2.73 17.2 7.03 20 12 20s9.27-2.8 11-7.87c.04-.04.05-.09.08-.13C21.27 6.8 16.97 4 12 4zm0 5c-1.38 0-2.5 1.12-2.5 2.5S10.62 14 12 14s2.5-1.12 2.5-2.5S13.38 9 12 9z"/>
          </svg>
        );
      case 'pool':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 17h20v2H2zm1.15-4.05L4 11.47l.85 1.48c.54.97 1.54 1.55 2.65 1.55s2.11-.58 2.65-1.55L12 10.47l1.85 2.48c.54.97 1.54 1.55 2.65 1.55s2.11-.58 2.65-1.55L20 11.47l.85 1.48c.54.97 1.54 1.55 2.65 1.55v2c-1.67 0-3.15-.91-3.92-2.37L18 12.65l-1.58 1.48c-.77 1.46-2.25 2.37-3.92 2.37s-3.15-.91-3.92-2.37L7 12.65l-1.58 1.48C4.65 15.59 3.17 16.5 1.5 16.5v-2c1.11 0 2.11-.58 2.65-1.55zM9.5 8C10.33 8 11 7.33 11 6.5S10.33 5 9.5 5 8 5.67 8 6.5 8.67 8 9.5 8z"/>
          </svg>
        );
      case 'ac':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 'restaurant':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
          </svg>
        );
      case 'spa':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.55 12c-1.07-.71-2.25-1.27-3.53-1.61 1.28.34 2.46.9 3.53 1.61zm9.43-1.61c-1.28.34-2.46.9-3.53 1.61 1.07-.71 2.25-1.27 3.53-1.61zM12 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 17.25c-3.58-.78-6.25-3.89-6.25-7.75 0-1.78.6-3.41 1.59-4.72C6.62 8.25 8.98 9.5 12 9.5s5.38-1.25 6.16-2.72c.99 1.31 1.59 2.94 1.59 4.72 0 3.86-2.67 6.97-6.25 7.75z"/>
          </svg>
        );
      case 'gym':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z"/>
          </svg>
        );
      case 'concierge':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        );
      case 'room-service':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H9v-7H1v11h18V7z"/>
          </svg>
        );
      case 'bar':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 5V3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9zM7.43 7L5.66 5h12.69l-1.78 2H7.43z"/>
          </svg>
        );
      case 'car':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
        );
      case 'all-inclusive':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 11H7v3h2v-3zm4 0h-2v3h2v-3zm4 0h-2v3h2v-3zm2-7H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM5 18V6h14v12H5z"/>
          </svg>
        );
      case 'beach':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.127 14.56l1.43 1.43c3.39-3.4 3.39-8.95 0-12.34l-1.43 1.43c2.59 2.58 2.59 6.78 0 9.48z"/>
            <path d="M17.42 10.19l1.43 1.43c1.19-1.2 1.19-3.14 0-4.34l-1.43 1.43c.39.39.39 1.02 0 1.48z"/>
            <circle cx="9" cy="13" r="8"/>
          </svg>
        );
      case 'sports':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'entertainment':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        );
      default:
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
    }
  };

  return getIconSVG(iconName);
};

export default IconRenderer;
