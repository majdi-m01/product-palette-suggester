
import React, { useState, useMemo } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number | null }>({
    min: 0,
    max: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter products based on search, category, and price
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const searchMatch = 
        searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const categoryMatch = 
        !selectedCategory || 
        product.category === selectedCategory;
      
      // Price filter
      const priceMatch = 
        product.price >= priceRange.min && 
        (priceRange.max === null || product.price <= priceRange.max);
      
      return searchMatch && categoryMatch && priceMatch;
    });
  }, [searchQuery, selectedCategory, priceRange]);
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setPriceRange({ min: 0, max: null });
  };
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop All Products</h1>
      
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button 
          variant="outline" 
          className="sm:w-auto w-full gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {(selectedCategory || priceRange.min > 0 || priceRange.max !== null) && 
            <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {[
                selectedCategory ? 1 : 0, 
                priceRange.min > 0 || priceRange.max !== null ? 1 : 0
              ].reduce((a, b) => a + b, 0)}
            </span>
          }
        </Button>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="bg-muted p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelectedCategory(
                    selectedCategory === category ? null : category
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange.min || ""}
                onChange={(e) => setPriceRange({
                  ...priceRange,
                  min: parseInt(e.target.value) || 0
                })}
                className="w-24"
              />
              <span>to</span>
              <Input
                type="number"
                placeholder="Max"
                value={priceRange.max || ""}
                onChange={(e) => setPriceRange({
                  ...priceRange,
                  max: e.target.value ? parseInt(e.target.value) : null
                })}
                className="w-24"
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
              Clear All Filters
            </Button>
          </div>
        </div>
      )}
      
      {/* Results count */}
      <p className="text-muted-foreground mb-6">
        Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        {selectedCategory && ` in ${selectedCategory}`}
      </p>
      
      {/* Products grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
};

export default Shop;
