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
          <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
          </svg>
        );
      case 'pool':
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" strokeMiterlimit="10">
            <path d="M22.5,14.86V22.5H1.5V14.86h1a3.46,3.46,0,0,0,4.77,0h0a3.45,3.45,0,0,0,4.76,0h0a3.45,3.45,0,0,0,4.76,0h0a3.46,3.46,0,0,0,4.77,0h1Z"/>
            <path d="M7.23,14.86V4.36A2.86,2.86,0,0,1,10.09,1.5"/>
            <path d="M14.86,15.79V4.36A2.86,2.86,0,0,1,17.73,1.5"/>
            <line x1="7.23" y1="6.27" x2="14.86" y2="6.27"/>
            <line x1="7.23" y1="11.05" x2="14.86" y2="11.05"/>
          </svg>
        );
      case 'ac':
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" strokeMiterlimit="10">
            <path d="M22.5,3.41v7.64A1.9,1.9,0,0,1,20.59,13H17.73V10.09H6.27V13H3.41a1.9,1.9,0,0,1-1.91-1.9V3.41A1.9,1.9,0,0,1,3.41,1.5H20.59A1.9,1.9,0,0,1,22.5,3.41Z"/>
            <line x1="8.18" y1="12.95" x2="6.27" y2="12.95"/>
            <line x1="17.73" y1="12.95" x2="15.82" y2="12.95"/>
            <path d="M10.09,13v4.78a1.91,1.91,0,0,1-1.91,1.91h0a1.92,1.92,0,0,1-1.91-1.91h0"/>
            <path d="M13.91,13v7.64a1.9,1.9,0,0,0,1.91,1.91h0a1.91,1.91,0,0,0,1.91-1.91h0"/>
            <line x1="17.73" y1="5.32" x2="19.64" y2="5.32"/>
            <line x1="4.36" y1="5.32" x2="15.82" y2="5.32"/>
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
          <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" strokeMiterlimit="10">
            <path d="M8.17,1.5h7.65a0,0,0,0,1,0,0V8.2A3.83,3.83,0,0,1,12,12h0A3.83,3.83,0,0,1,8.17,8.2V1.5a0,0,0,0,1,0,0Z"/>
            <line x1="8.17" y1="5.33" x2="18.7" y2="5.33"/>
            <path d="M4.35,23.5V19.67A7.65,7.65,0,0,1,12,12h0a7.65,7.65,0,0,1,7.65,7.65V23.5"/>
            <line x1="9.13" y1="17.76" x2="11.04" y2="17.76"/>
            <line x1="9.13" y1="21.59" x2="11.04" y2="21.59"/>
            <polyline points="8.93 12.66 12.96 15.85 12.96 23.5"/>
          </svg>
        );
      case 'room-service':
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" strokeMiterlimit="10">
            <path d="M5.28,7.2H18.67a1.91,1.91,0,0,1,1.91,1.91v6.7a0,0,0,0,1,0,0H5.28a0,0,0,0,1,0,0V7.2A0,0,0,0,1,5.28,7.2Z"/>
            <circle cx="5.28" cy="20.59" r="1.91"/>
            <circle cx="20.59" cy="20.59" r="1.91"/>
            <line x1="5.28" y1="18.67" x2="5.28" y2="15.8"/>
            <line x1="20.59" y1="18.67" x2="20.59" y2="15.8"/>
            <polyline points="5.28 8.15 5.28 3.37 0.5 1.46"/>
            <path d="M12.93,2.41h0a3.83,3.83,0,0,1,3.83,3.83v1a0,0,0,0,1,0,0H9.11a0,0,0,0,1,0,0v-1a3.83,3.83,0,0,1,3.83-3.83Z"/>
            <line x1="12.93" y1="0.5" x2="12.93" y2="2.41"/>
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
          <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" strokeMiterlimit="10">
            <path d="M8.18,16.8,5,13.57A2,2,0,0,0,3.52,13h0a2,2,0,0,0-2,2h0a2,2,0,0,0,.59,1.43l4.18,4.18H20.59A1.9,1.9,0,0,0,22.5,18.7h0a1.9,1.9,0,0,0-1.91-1.9Z"/>
            <line x1="6.27" y1="23.48" x2="6.27" y2="20.61"/>
            <line x1="19.64" y1="23.48" x2="19.64" y2="20.61"/>
            <polygon points="20.59 8.21 3.41 8.21 12 1.52 20.59 8.21"/>
            <line x1="12" y1="16.8" x2="12" y2="8.2"/>
            <line x1="12" y1="23.48" x2="12" y2="20.61"/>
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
