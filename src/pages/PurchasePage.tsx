
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Header from "@/components/Header";
import LoadingIndicator from "@/components/LoadingIndicator";
import { scrapeProductDetails } from "@/services/scraper";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

export default function PurchasePage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [recommendationLevel, setRecommendationLevel] = useState<"high" | "medium" | "low">("medium");
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the product ID from query parameters
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");
  
  useEffect(() => {
    if (!productId) {
      setError("No product ID provided");
      setIsLoading(false);
      return;
    }
    
    const fetchProductDetails = async () => {
      try {
        // Simulate getting the product details by ID
        // In a real app, we would fetch from a database or API
        // Here we're just using the mock scraper with a fake URL
        const mockUrl = `https://amazon.com/dp/${productId}`;
        const productData = await scrapeProductDetails(mockUrl);
        setProduct(productData);
        
        // Set a recommendation level based on the product rating
        // This would normally come from the sentiment analysis
        if (productData.rating >= 4.5) {
          setRecommendationLevel("high");
        } else if (productData.rating >= 3.5) {
          setRecommendationLevel("medium");
        } else {
          setRecommendationLevel("low");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to fetch product details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [productId]);
  
  const handlePurchaseClick = () => {
    if (product) {
      // In a real app, this would redirect to the Amazon product page
      window.open(product.url, "_blank");
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background flex items-center justify-center">
        <LoadingIndicator text="Preparing purchase options..." />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background flex flex-col items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg max-w-md w-full text-center">
          <div className="mb-4 text-destructive">
            <ShoppingCart size={48} className="mx-auto" />
          </div>
          <h1 className="text-xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground mb-6">{error || "Failed to load purchase options"}</p>
          <Button onClick={() => navigate("/")} className="w-full">
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background pb-16">
      <Header />
      
      <main className="pt-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50 animate-enter max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Ready to Purchase</h1>
          
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="md:w-1/3">
              <div className="aspect-square rounded-xl overflow-hidden bg-muted/30 border border-border/50 flex items-center justify-center p-4">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full h-full object-contain" 
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <div className="text-2xl font-bold mb-4">{product.price}</div>
              
              <Alert 
                className={cn(
                  "mb-6",
                  recommendationLevel === "high" 
                    ? "border-positive/50 bg-positive/10 text-positive" 
                    : recommendationLevel === "medium"
                      ? "border-neutral/50 bg-neutral/10 text-neutral"
                      : "border-negative/50 bg-negative/10 text-negative"
                )}
              >
                {recommendationLevel === "high" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : recommendationLevel === "medium" ? (
                  <Info className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {recommendationLevel === "high" 
                    ? "Highly Recommended" 
                    : recommendationLevel === "medium"
                      ? "Moderately Recommended"
                      : "Approach with Caution"
                  }
                </AlertTitle>
                <AlertDescription>
                  {recommendationLevel === "high" 
                    ? "Based on our sentiment analysis, this product has very positive reviews and is likely to meet your expectations."
                    : recommendationLevel === "medium"
                      ? "This product has mixed reviews. It may work well for some users but not others."
                      : "Our analysis found several negative reviews. Consider alternatives or research further before purchasing."
                  }
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <p className="text-muted-foreground">{product.description}</p>
                <p className="text-sm text-muted-foreground">
                  Rating: {product.rating.toFixed(1)} ({product.totalReviews.toLocaleString()} reviews)
                </p>
              </div>
            </div>
          </div>
          
          <div className="border border-border/50 rounded-xl p-6 bg-muted/20 mb-8">
            <h3 className="text-lg font-medium mb-4">Purchase Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product</span>
                <span>Apple AirPods Pro</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span>{product.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Delivery</span>
                <span>2-3 business days</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border/50">
              <span>Total</span>
              <span>{product.price}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <Button 
              className="w-full sm:w-auto px-8 py-6 text-lg gap-2 mb-4 animate-pulse-subtle"
              onClick={handlePurchaseClick}
            >
              <ShoppingCart size={20} />
              <span>Purchase on Amazon</span>
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              You will be redirected to Amazon to complete your purchase securely
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
