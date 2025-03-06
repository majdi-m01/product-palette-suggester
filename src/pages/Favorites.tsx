
import React from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";

const Favorites = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  
  if (favorites.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Favorites List is Empty</h1>
        <p className="text-muted-foreground mb-8">
          You haven't added any products to your favorites yet.
        </p>
        <Link to="/shop">
          <Button className="gap-2">
            Browse Products <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Favorites</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <Link to={`/products/${product.id}`}>
              <div className="aspect-square relative overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
              </div>
            </Link>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-medium text-lg truncate hover:text-primary">{product.name}</h3>
                  </Link>
                  <p className="text-muted-foreground text-sm truncate">
                    {product.category}
                  </p>
                </div>
                <p className="font-semibold">${product.price.toFixed(2)}</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => removeFromFavorites(product.id)}
                className="rounded-full text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove from favorites</span>
              </Button>
              <Button 
                className="flex-1 rounded-full"
                onClick={() => addToCart(product)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
