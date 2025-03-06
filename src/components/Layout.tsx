import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, ShoppingCart, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { categories } from "@/data/products";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Categories", path: "/categories" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="flex flex-col gap-4 mt-8">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-lg font-medium py-2 ${
                location.pathname === item.path ? "text-primary" : "hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
          
          {isAuthenticated && (
            <>
              <div className="border-t my-2 pt-2"></div>
              <Link
                to="/account"
                className="text-lg font-medium py-2 hover:text-primary"
              >
                My Account
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-lg font-medium py-2 hover:text-primary"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={logout}
                className="text-lg font-medium py-2 hover:text-primary text-left flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container max-w-7xl mx-auto p-4 flex justify-between items-center">
          {isMobile && <MobileMenu />}
          
          <Link to="/" className="text-xl font-bold">
            ProductPalette
          </Link>
          
          {!isMobile && (
            <nav className="flex-1 flex justify-center">
              <ul className="flex space-x-8">
                {navigationItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`text-sm font-medium transition-colors ${
                        location.pathname === item.path
                          ? "text-primary"
                          : "hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/favorites">
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
                <span className="sr-only">Favorites</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user?.name}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account">My Account</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/login">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-muted">
        <div className="container max-w-7xl mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">ProductPalette</h3>
              <p className="text-sm text-muted-foreground">
                Curated collection of minimalist design products for modern living.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Shop</h4>
              <ul className="space-y-2">
                <li><Link to="/shop" className="text-sm hover:underline">All Products</Link></li>
                {categories.map(category => (
                  <li key={category}>
                    <Link to={`/shop?category=${category}`} className="text-sm hover:underline">{category}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm hover:underline">About Us</Link></li>
                <li><Link to="/contact" className="text-sm hover:underline">Contact</Link></li>
                <li><Link to="/blog" className="text-sm hover:underline">Blog</Link></li>
                <li><Link to="/careers" className="text-sm hover:underline">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-sm hover:underline">FAQ</Link></li>
                <li><Link to="/shipping" className="text-sm hover:underline">Shipping & Returns</Link></li>
                <li><Link to="/terms" className="text-sm hover:underline">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="text-sm hover:underline">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ProductPalette. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
