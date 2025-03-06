
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { ArrowLeft, Heart, MinusCircle, PlusCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }
  
  const isFavorited = isFavorite(product.id);
  
  const handleFavoriteClick = () => {
    if (isFavorited) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else if (e.target.value === '') {
      setQuantity(1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6 -ml-2 gap-1" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-muted rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover aspect-square"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
          
          {product.rating && (
            <div className="flex gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating!) ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              ))}
              <span className="text-sm text-muted-foreground ml-1">({product.rating})</span>
            </div>
          )}
          
          <p className="text-2xl font-semibold mt-6">${product.price.toFixed(2)}</p>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          
          <div className="mt-8 border-t pt-8">
            <div className="flex items-center mb-6">
              <span className="text-sm font-medium mr-4">Quantity</span>
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                
                <Input
                  type="number"
                  className="w-16 text-center mx-2"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                />
                
                <Button variant="ghost" size="icon" onClick={increaseQuantity}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                className="flex-1 gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleFavoriteClick}
                className={isFavorited ? 'text-red-500 hover:text-red-600' : ''}
              >
                <Heart className="h-4 w-4" fill={isFavorited ? "currentColor" : "none"} />
                <span className="sr-only">
                  {isFavorited ? "Remove from favorites" : "Add to favorites"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
