
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star, ArrowRight, ImageIcon, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingIndicator from "@/components/LoadingIndicator";
import Header from "@/components/Header";
import { Product } from "@/types";
import { scrapeProductDetails } from "@/services/scraper";
import { cn } from "@/lib/utils";

export default function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the URL from query parameters
  const queryParams = new URLSearchParams(location.search);
  const encodedUrl = queryParams.get("url");
  
  useEffect(() => {
    if (!encodedUrl) {
      setError("No product URL provided");
      setIsLoading(false);
      return;
    }
    
    const fetchProductDetails = async () => {
      try {
        const url = decodeURIComponent(encodedUrl);
        const productData = await scrapeProductDetails(url);
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to fetch product details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [encodedUrl]);
  
  const handleAnalyzeClick = () => {
    if (product) {
      navigate(`/sentiment-analysis?productId=${product.id}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background flex items-center justify-center">
        <LoadingIndicator text="Fetching product details..." />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background flex flex-col items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg max-w-md w-full text-center">
          <div className="mb-4 text-destructive">
            <Package size={48} className="mx-auto" />
          </div>
          <h1 className="text-xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground mb-6">{error || "Failed to load product details"}</p>
          <Button onClick={() => navigate("/")} className="w-full">
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  const mainImage = product.imageUrl;
  const allImages = [mainImage, ...(product.additionalImages || [])];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background pb-16">
      <Header />
      
      <main className="pt-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50 animate-enter">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-muted/30 border border-border/50 flex items-center justify-center relative">
                {allImages[selectedImageIndex] ? (
                  <img 
                    src={allImages[selectedImageIndex]} 
                    alt={product.title} 
                    className="w-full h-full object-contain p-4 transition-opacity duration-300" 
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon size={48} className="mb-2" />
                    <span>No image available</span>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      className={cn(
                        "w-16 h-16 rounded-md overflow-hidden border flex-shrink-0 transition-all duration-200",
                        selectedImageIndex === index 
                          ? "border-primary ring-2 ring-primary/20" 
                          : "border-border hover:border-muted-foreground"
                      )}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="w-full h-full object-contain p-1" 
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">{product.title}</h1>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star 
                        key={idx} 
                        className={cn(
                          "h-5 w-5", 
                          idx < Math.floor(product.rating) 
                            ? "text-neutral fill-neutral" 
                            : idx < product.rating
                              ? "text-neutral fill-neutral/50"
                              : "text-muted"
                        )}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {product.rating.toFixed(1)} ({product.totalReviews.toLocaleString()} reviews)
                  </div>
                </div>
                
                <div className="text-3xl font-bold mb-4">{product.price}</div>
                
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              
              <Separator />
              
              <Tabs defaultValue="features" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="features" className="pt-4">
                  {product.features && product.features.length > 0 ? (
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="inline-block h-5 w-5 rounded-full bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center text-xs">
                            ✓
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No feature information available.</p>
                  )}
                </TabsContent>
                <TabsContent value="details" className="pt-4">
                  <p className="text-muted-foreground">
                    Additional product information and specifications would appear here.
                  </p>
                </TabsContent>
              </Tabs>
              
              <div className="pt-4 space-y-4">
                <Button 
                  className="w-full gap-2 py-6 text-lg" 
                  onClick={handleAnalyzeClick}
                >
                  <span>Analyze Sentiment</span>
                  <ArrowRight size={18} />
                </Button>
                
                <div className="text-sm text-center text-muted-foreground">
                  View detailed sentiment analysis and customer review insights
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
