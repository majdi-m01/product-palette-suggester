
import React, { useState, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import { getRecommendations, analyzeQuery } from "@/utils/recommendationEngine";

const AIRecommendation: React.FC = () => {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [insight, setInsight] = useState<string>("");

  // Load recent queries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentQueries");
    if (saved) {
      try {
        setRecentQueries(JSON.parse(saved).slice(0, 3));
      } catch (e) {
        console.error("Failed to parse recent queries:", e);
      }
    }
  }, []);

  // Save recent queries to localStorage
  const saveRecentQuery = (newQuery: string) => {
    const updatedQueries = [
      newQuery,
      ...recentQueries.filter(q => q !== newQuery)
    ].slice(0, 3);
    
    setRecentQueries(updatedQueries);
    localStorage.setItem("recentQueries", JSON.stringify(updatedQueries));
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setRecommendations([]);
    
    // Analyze query for user preferences
    const analysis = analyzeQuery(query);
    setUserPreferences(analysis.preferences);
    
    // Generate personalized insight based on analysis
    let insightText = "Based on your search, you might be looking for ";
    if (analysis.categories.length > 0) {
      insightText += analysis.categories.join(" or ") + " with ";
    }
    if (analysis.preferences.length > 0) {
      insightText += analysis.preferences.filter(p => !p.includes("products")).join(", ");
    } else {
      insightText += "products that match your description";
    }
    
    if (analysis.priceRange?.max) {
      insightText += ` within your budget of $${analysis.priceRange.max}`;
    }
    
    setInsight(insightText);
    
    // Simulate network latency for a more realistic experience
    setTimeout(() => {
      try {
        // Get recommendations using our NLP/RAG engine
        const results = getRecommendations(query);
        setRecommendations(results);
        
        // Save this query for history
        if (query.length > 3) {
          saveRecentQuery(query);
        }
      } catch (error) {
        console.error("Error getting recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1200); // Realistic delay
  };

  const handleRecentQueryClick = (recentQuery: string) => {
    setQuery(recentQuery);
    // Delay execution slightly to show the query being set
    setTimeout(() => handleSearch(), 100);
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          AI-Powered Product Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-muted-foreground mb-4">
          Describe what you're looking for in detail, and our AI will find the perfect products for you.
        </p>
        
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="I'm looking for a minimalist accessory under $100..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
          
          {recentQueries.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="text-muted-foreground">Recent:</span>
              {recentQueries.map((recentQuery, i) => (
                <button
                  key={i}
                  onClick={() => handleRecentQueryClick(recentQuery)}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  {recentQuery}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {recommendations.length > 0 && (
          <div className="mt-8">
            {insight && (
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md mb-6 text-sm">
                <div className="flex items-center gap-2 font-medium mb-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>AI Insight</span>
                </div>
                <p className="text-muted-foreground">{insight}</p>
              </div>
            )}
            
            {userPreferences.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Detected preferences:</span>
                {userPreferences.map((pref, i) => (
                  <Badge key={i} variant="outline" className="bg-muted/50">
                    {pref}
                  </Badge>
                ))}
              </div>
            )}
            
            <h3 className="text-lg font-medium mb-4">Personalized Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 border-4 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground text-sm">
                Analyzing your request and finding relevant products...
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendation;
