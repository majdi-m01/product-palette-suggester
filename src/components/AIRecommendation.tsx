
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import { products } from "@/data/products";

const AIRecommendation: React.FC = () => {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI recommendation with a timeout
    setTimeout(() => {
      // For demo purposes, just return random products as recommendations
      const randomProducts = [...products]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
        
      setRecommendations(randomProducts);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">AI Product Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Describe what you're looking for, and our AI will recommend products for you.
        </p>
        
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="I'm looking for a gift for my minimalist friend..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Thinking...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Recommend
              </>
            )}
          </Button>
        </div>
        
        {recommendations.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Recommendations for you</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendation;
