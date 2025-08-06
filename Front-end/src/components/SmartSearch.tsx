import React, { useState, useEffect, useRef } from 'react';
import { extractCityName, normalizeForSearch } from '../utils/searchUtils';

interface SmartSearchProps {
  destinations: { value: string; label: string; flag: string }[];
  onSelect: (destination: string) => void;
  placeholder?: string;
  value?: string;
}

const SmartSearch: React.FC<SmartSearchProps> = ({
  destinations,
  onSelect,
  placeholder = "Para onde você quer ir?",
  value = ""
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState(destinations);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Atualizar query quando value prop mudar
  useEffect(() => {
    if (value) {
      // Encontrar o destino completo correspondente ao value (nome da cidade)
      const fullDestination = destinations.find(dest => 
        extractCityName(dest.label).toLowerCase() === value.toLowerCase()
      );
      if (fullDestination) {
        setQuery(fullDestination.label);
      } else {
        setQuery(value);
      }
    }
  }, [value, destinations]);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredDestinations(destinations.slice(0, 10)); // Mostrar apenas 10 iniciais
      return;
    }

    const normalizedQuery = normalizeForSearch(query);
    
    const filtered = destinations.filter(dest => {
      const normalizedLabel = normalizeForSearch(dest.label);
      const cityName = normalizeForSearch(extractCityName(dest.label));
      
      // Busca no nome completo ou apenas na cidade
      return normalizedLabel.includes(normalizedQuery) || 
             cityName.includes(normalizedQuery);
    });

    // Ordenar resultados: cidades que começam com o termo primeiro
    filtered.sort((a, b) => {
      const aCityName = normalizeForSearch(extractCityName(a.label));
      const bCityName = normalizeForSearch(extractCityName(b.label));
      
      const aStartsWith = aCityName.startsWith(normalizedQuery);
      const bStartsWith = bCityName.startsWith(normalizedQuery);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return a.label.localeCompare(b.label);
    });

    setFilteredDestinations(filtered.slice(0, 8)); // Limitar a 8 resultados
    setHighlightedIndex(-1);
  }, [query, destinations]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (destination: string) => {
    const cityName = extractCityName(destination);
    setQuery(destination);
    onSelect(cityName); // Enviar apenas o nome da cidade
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredDestinations.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredDestinations.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredDestinations.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(filteredDestinations[highlightedIndex].label);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const normalizedText = normalizeForSearch(text);
    const normalizedQuery = normalizeForSearch(query);
    const index = normalizedText.indexOf(normalizedQuery);
    
    if (index === -1) return text;
    
    const beforeMatch = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const afterMatch = text.slice(index + query.length);
    
    return (
      <>
        {beforeMatch}
        <span className="bg-yellow-200 font-semibold">{match}</span>
        {afterMatch}
      </>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all pr-10"
        />
        
        {/* Ícone de busca */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          </svg>
        </div>
        
        {/* Indicador de resultados */}
        {query && isOpen && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {filteredDestinations.length} {filteredDestinations.length === 1 ? 'resultado' : 'resultados'}
          </div>
        )}
      </div>
      
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-xl shadow-xl mt-1 z-30 max-h-80 overflow-y-auto">
          {filteredDestinations.length > 0 ? (
            <>
              {filteredDestinations.map((dest, index) => (
                <button
                  key={dest.value}
                  onClick={() => handleSelect(dest.label)}
                  className={`w-full p-3 text-left hover:bg-purple-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                    index === highlightedIndex ? 'bg-purple-50 border-purple-200' : ''
                  }`}
                >
                  <span className="text-xl flex-shrink-0">{dest.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-800 font-medium text-sm">
                      {highlightMatch(extractCityName(dest.label), query)}
                    </div>
                    <div className="text-gray-500 text-xs truncate">
                      {dest.label}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </button>
              ))}
              
              {/* Dica de navegação */}
              <div className="p-2 text-xs text-gray-500 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <span>Use ↑↓ para navegar, Enter para selecionar</span>
                  <span className="text-purple-600 font-medium">ESC para fechar</span>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 text-center">
              <div className="text-gray-500 mb-2">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="text-sm text-gray-500">
                Nenhum destino encontrado para <strong>"{query}"</strong>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Tente buscar por uma cidade ou país diferente
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
