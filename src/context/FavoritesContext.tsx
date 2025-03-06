
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { toast } from '@/components/ui/use-toast';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  
  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
      }
    }
  }, []);
  
  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  const addToFavorites = (product: Product) => {
    if (!favorites.some(fav => fav.id === product.id)) {
      setFavorites(prevFavorites => [...prevFavorites, product]);
      toast({
        title: "Added to favorites",
        description: `${product.name} has been added to your favorites.`
      });
    }
  };
  
  const removeFromFavorites = (productId: string) => {
    setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== productId));
    toast({
      title: "Removed from favorites",
      description: "Item has been removed from your favorites."
    });
  };
  
  const isFavorite = (productId: string) => {
    return favorites.some(product => product.id === productId);
  };
  
  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
