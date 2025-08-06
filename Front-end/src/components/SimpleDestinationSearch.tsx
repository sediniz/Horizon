import React from 'react';
import SmartSearch from './SmartSearch';

// Destinos mais populares para uso rápido
export const popularDestinations = [
  { value: 'sao-paulo', label: 'São Paulo, SP', flag: '🇧🇷' },
  { value: 'rio-de-janeiro', label: 'Rio de Janeiro, RJ', flag: '🇧🇷' },
  { value: 'salvador', label: 'Salvador, BA', flag: '🇧🇷' },
  { value: 'brasilia', label: 'Brasília, DF', flag: '🇧🇷' },
  { value: 'gramado', label: 'Gramado, RS', flag: '🇧🇷' },
  { value: 'buzios', label: 'Búzios, RJ', flag: '🇧🇷' },
  { value: 'paris', label: 'Paris, França', flag: '🇫🇷' },
  { value: 'londres', label: 'Londres, Inglaterra', flag: '🇬🇧' },
  { value: 'nova-york', label: 'Nova York, EUA', flag: '🇺🇸' },
  { value: 'dubai', label: 'Dubai, Emirados Árabes', flag: '🇦🇪' },
  { value: 'tokyo', label: 'Tóquio, Japão', flag: '🇯🇵' },
  { value: 'cancun', label: 'Cancún, México', flag: '🇲🇽' },
];

// Componente SmartSearch simplificado para uso em filtros
interface SimpleSearchProps {
  onSelect: (destination: string) => void;
  placeholder?: string;
  value?: string;
  compact?: boolean;
}

export const SimpleDestinationSearch: React.FC<SimpleSearchProps> = ({ 
  onSelect, 
  placeholder = "Buscar destino...", 
  value = "",
  compact = false 
}) => {
  return (
    <div className={compact ? "text-sm" : ""}>
      <SmartSearch
        destinations={popularDestinations}
        onSelect={onSelect}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
};

export default SimpleDestinationSearch;
