
import React, { useState, useEffect } from "react";
import { Search, Sparkles, Clock, Trash2, ArrowRightCircle, PanelRight, PanelLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import { getRecommendations, analyzeQuery } from "@/utils/recommendationEngine";
import { cn } from "@/lib/utils";

const ExampleQueries = [
  "I need a minimalist accessory under $100",
  "Looking for premium home office equipment",
  "Something for the kitchen with modern design",
  "High quality electronics for music lovers"
];

const AIRecommendation: React.FC = () => {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [insight, setInsight] = useState<string>("");
  const [queryIntent, setQueryIntent] = useState<string[]>([]);
  const [queryEntities, setQueryEntities] = useState<Record<string, string>>({});
  const [activeQuery, setActiveQuery] = useState<string>("");
  const [detailedAnalysis, setDetailedAnalysis] = useState<boolean>(false);

  // Load recent queries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentQueries");
    if (saved) {
      try {
        setRecentQueries(JSON.parse(saved).slice(0, 5));
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
    ].slice(0, 5);
    
    setRecentQueries(updatedQueries);
    localStorage.setItem("recentQueries", JSON.stringify(updatedQueries));
  };

  const clearRecentQueries = () => {
    setRecentQueries([]);
    localStorage.removeItem("recentQueries");
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setActiveQuery(query);
    setIsLoading(true);
    setRecommendations([]);
    
    // Advanced query analysis
    const analysis = analyzeQuery(query);
    setUserPreferences(analysis.preferences);
    setQueryIntent(analysis.intents);
    setQueryEntities(analysis.entities);
    
    // Generate personalized insight based on analysis
    generateInsight(analysis);
    
    // Simulate network latency for a more realistic experience
    setTimeout(() => {
      try {
        // Get recommendations using our enhanced NLP/RAG engine
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

  const generateInsight = (analysis: ReturnType<typeof analyzeQuery>) => {
    let insightText = "";
    
    // Build personalized insight based on detected attributes
    if (analysis.intents.includes('recommendation')) {
      insightText = "Based on your request for recommendations, ";
    } else if (analysis.intents.includes('search')) {
      insightText = "Based on your search, ";
    } else {
      insightText = "Based on your query, ";
    }
    
    // Add category information
    if (analysis.categories.length > 0) {
      insightText += `I'll show you ${analysis.categories.join(" or ")} `;
      
      // Add detected attributes if present
      const attributes = [];
      if (analysis.entities.quality) attributes.push(analysis.entities.quality);
      if (analysis.entities.style) attributes.push(analysis.entities.style);
      if (analysis.entities.material) attributes.push(analysis.entities.material);
      
      if (attributes.length > 0) {
        insightText += `with ${attributes.join(", ")} qualities `;
      }
    } else {
      // No specific category detected
      insightText += "I'll show you products ";
      
      if (Object.keys(analysis.entities).length > 0) {
        const entityDescriptions = Object.values(analysis.entities);
        insightText += `that match your preference for ${entityDescriptions.join(", ")} `;
      } else {
        insightText += "that best match your description ";
      }
    }
    
    // Add price range if detected
    if (analysis.priceRange?.min && analysis.priceRange?.max) {
      insightText += `within your budget range of $${analysis.priceRange.min} to $${analysis.priceRange.max}`;
    } else if (analysis.priceRange?.max) {
      insightText += `under your budget of $${analysis.priceRange.max}`;
    } else if (analysis.priceRange?.min) {
      insightText += `above your minimum price point of $${analysis.priceRange.min}`;
    } else {
      insightText += "across various price points";
    }
    
    setInsight(insightText);
  };

  const handleRecentQueryClick = (recentQuery: string) => {
    setQuery(recentQuery);
    // Delay execution slightly to show the query being set
    setTimeout(() => handleSearch(), 100);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    // Delay execution slightly to show the query being set
    setTimeout(() => handleSearch(), 100);
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <CardTitle className="text-xl">AI Product Discovery</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setDetailedAnalysis(!detailedAnalysis)}
            className="gap-1"
          >
            {detailedAnalysis ? <PanelLeft className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
            {detailedAnalysis ? "Hide" : "Show"} Analysis
          </Button>
        </div>
        <CardDescription>
          Describe what you're looking for in natural language, and our AI will find the perfect products
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="Example: I need a minimalist accessory under $100..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
          
          {ExampleQueries.length > 0 && !activeQuery && (
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">Try asking for:</div>
              <div className="flex flex-wrap gap-2">
                {ExampleQueries.map((example, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary transition-colors bg-background"
                    onClick={() => handleExampleClick(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {recentQueries.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Recent searches:</span>
              </div>
              
              {recentQueries.map((recentQuery, i) => (
                <button
                  key={i}
                  onClick={() => handleRecentQueryClick(recentQuery)}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  {recentQuery}
                </button>
              ))}
              
              <button
                onClick={clearRecentQueries}
                className="text-muted-foreground hover:text-destructive text-sm flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </button>
            </div>
          )}
        </div>
        
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 border-4 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
              <div className="text-center space-y-2">
                <p className="text-muted-foreground text-sm">
                  Analyzing your request using AI...
                </p>
                <div className="flex justify-center gap-1">
                  <Skeleton className="h-2 w-16 bg-muted-foreground/20 rounded-full animate-pulse" />
                  <Skeleton className="h-2 w-10 bg-muted-foreground/20 rounded-full animate-pulse delay-100" />
                  <Skeleton className="h-2 w-14 bg-muted-foreground/20 rounded-full animate-pulse delay-200" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeQuery && !isLoading && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Detailed Analysis Panel (conditionally shown) */}
            {detailedAnalysis && (
              <div className="col-span-1 space-y-4">
                <div className="text-sm font-medium">Query Analysis</div>
                
                {/* Intent Detection */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Detected Intent:</div>
                  <div className="flex flex-wrap gap-1">
                    {queryIntent.length > 0 ? (
                      queryIntent.map((intent, i) => (
                        <Badge key={i} variant="outline" className="capitalize">
                          {intent}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No specific intent detected</span>
                    )}
                  </div>
                </div>
                
                {/* Entity Recognition */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Extracted Entities:</div>
                  <div className="space-y-1">
                    {Object.keys(queryEntities).length > 0 ? (
                      Object.entries(queryEntities).map(([entity, value], i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="capitalize">{entity}:</span>
                          <span className="text-muted-foreground">{value}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No specific entities extracted</span>
                    )}
                  </div>
                </div>
                
                {/* User Preferences */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Inferred Preferences:</div>
                  <div className="flex flex-wrap gap-1">
                    {userPreferences.length > 0 ? (
                      userPreferences.map((pref, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {pref}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No specific preferences detected</span>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Recommendations Panel */}
            <div className={cn("space-y-6", detailedAnalysis ? "col-span-3" : "col-span-4")}>
              {/* AI Insight Card */}
              {insight && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-md">
                  <div className="flex items-center gap-2 font-medium mb-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <span>AI Insight</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{insight}</p>
                </div>
              )}
              
              {/* Product Recommendations */}
              {recommendations.length > 0 ? (
                <>
                  <h3 className="text-lg font-medium">Personalized Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendations.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No recommendations found for your query.</p>
                  <p className="text-sm mt-2">Try modifying your search or using one of our suggestions.</p>
                </div>
              )}
              
              {/* Show "Ask for more" feature when there are recommendations */}
              {recommendations.length > 0 && (
                <div className="border border-muted rounded-md p-4 bg-accent/5">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRightCircle className="h-4 w-4 text-primary" />
                    <span className="font-medium">Need more specific recommendations?</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Try adding more details about your preferences, budget, or intended use.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-secondary transition-colors"
                      onClick={() => setQuery(`${query} under $50`)}
                    >
                      Add budget constraint
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-secondary transition-colors"
                      onClick={() => setQuery(`${query} with premium quality`)}
                    >
                      Specify quality
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-secondary transition-colors"
                      onClick={() => setQuery(`${query} with modern design`)}
                    >
                      Add style preference
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendation;
