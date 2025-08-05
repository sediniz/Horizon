import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Tipos
interface FavoritosContextType {
  favoritos: number[]; // Array de IDs dos pacotes favoritados
  adicionarFavorito: (pacoteId: number) => void;
  removerFavorito: (pacoteId: number) => void;
  isFavorito: (pacoteId: number) => boolean;
  toggleFavorito: (pacoteId: number) => void;
  totalFavoritos: number;
}

// Criar o Context
const FavoritosContext = createContext<FavoritosContextType | undefined>(undefined);

// Provider Component
export const FavoritosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favoritos, setFavoritos] = useState<number[]>([]);

  // Carregar favoritos do localStorage ao inicializar
  useEffect(() => {
    try {
      const favoritosSalvos = localStorage.getItem('horizon-favoritos');
      if (favoritosSalvos) {
        const favoritosArray = JSON.parse(favoritosSalvos);
        setFavoritos(Array.isArray(favoritosArray) ? favoritosArray : []);
        console.log('❤️ Favoritos carregados do localStorage:', favoritosArray);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos do localStorage:', error);
      setFavoritos([]);
    }
  }, []);

  // Salvar favoritos no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem('horizon-favoritos', JSON.stringify(favoritos));
      console.log('💾 Favoritos salvos no localStorage:', favoritos);
    } catch (error) {
      console.error('Erro ao salvar favoritos no localStorage:', error);
    }
  }, [favoritos]);

  // Adicionar pacote aos favoritos
  const adicionarFavorito = (pacoteId: number) => {
    setFavoritos(prev => {
      if (!prev.includes(pacoteId)) {
        console.log(`❤️ Adicionando pacote ${pacoteId} aos favoritos`);
        return [...prev, pacoteId];
      }
      return prev;
    });
  };

  // Remover pacote dos favoritos
  const removerFavorito = (pacoteId: number) => {
    setFavoritos(prev => {
      const novosFavoritos = prev.filter(id => id !== pacoteId);
      console.log(`💔 Removendo pacote ${pacoteId} dos favoritos`);
      return novosFavoritos;
    });
  };

  // Verificar se um pacote é favorito
  const isFavorito = (pacoteId: number): boolean => {
    return favoritos.includes(pacoteId);
  };

  // Toggle favorito (adiciona se não tem, remove se tem)
  const toggleFavorito = (pacoteId: number) => {
    if (isFavorito(pacoteId)) {
      removerFavorito(pacoteId);
    } else {
      adicionarFavorito(pacoteId);
    }
  };

  const value: FavoritosContextType = {
    favoritos,
    adicionarFavorito,
    removerFavorito,
    isFavorito,
    toggleFavorito,
    totalFavoritos: favoritos.length
  };

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
};

// Hook personalizado para usar o Context
export const useFavoritos = (): FavoritosContextType => {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de um FavoritosProvider');
  }
  return context;
};

export default FavoritosContext;
