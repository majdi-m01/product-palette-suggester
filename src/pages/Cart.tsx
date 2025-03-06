
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, Trash2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

const CartItem = ({ 
  item, 
  updateQuantity, 
  removeFromCart 
}: { 
  item: { product: any; quantity: number }; 
  updateQuantity: (id: string, qty: number) => void; 
  removeFromCart: (id: string) => void; 
}) => {
  return (
    <div className="flex border-b py-4">
      <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
        <Link to={`/products/${item.product.id}`}>
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
      <div className="ml-4 flex-1">
        <div className="flex justify-between mb-1">
          <Link to={`/products/${item.product.id}`}>
            <h3 className="font-medium hover:text-primary">{item.product.name}</h3>
          </Link>
          <button
            onClick={() => removeFromCart(item.product.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{item.product.category}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="font-semibold">${item.product.price.toFixed(2)}</p>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              className="w-12 text-center mx-1"
              value={item.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value > 0) {
                  updateQuantity(item.product.id, value);
                }
              }}
              min="1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-right text-sm mt-1">
          Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  
  if (cartItems.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">
          You don't have any items in your cart yet.
        </p>
        <Link to="/shop">
          <Button className="gap-2">
            Start Shopping <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }
  
  const TAX_RATE = 0.1; // 10%
  const SHIPPING_COST = 10;
  
  const taxAmount = subtotal * TAX_RATE;
  const total = subtotal + taxAmount + SHIPPING_COST;
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-1">
            {cartItems.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))}
          </div>
          <div className="mt-6 flex">
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-muted-foreground"
            >
              Clear Cart
            </Button>
            <div className="flex-1"></div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-muted rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items ({totalItems})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${SHIPPING_COST.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full mt-6 gap-2" disabled={!isAuthenticated}>
              {isAuthenticated ? (
                <>
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                "Login to Checkout"
              )}
            </Button>
            {!isAuthenticated && (
              <p className="text-sm text-center mt-4 text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>{" "}
                or{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Register
                </Link>{" "}
                to complete your purchase
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
