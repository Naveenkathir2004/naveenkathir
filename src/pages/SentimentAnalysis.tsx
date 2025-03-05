
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, BarChart3, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import LoadingIndicator from "@/components/LoadingIndicator";
import SentimentMeter from "@/components/SentimentMeter";
import WordCloud from "@/components/WordCloud";
import ReviewList from "@/components/ReviewList";
import { scrapeProductReviews } from "@/services/scraper";
import { analyzeReviews } from "@/services/sentimentAnalysis";
import { ProcessedReviews } from "@/types";
import { cn } from "@/lib/utils";

export default function SentimentAnalysis() {
  const [reviewData, setReviewData] = useState<ProcessedReviews | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("sentiment");
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
    
    const fetchReviewData = async () => {
      try {
        // First fetch the reviews
        const reviews = await scrapeProductReviews(productId);
        
        // Then analyze them
        const processedData = await analyzeReviews(reviews);
        
        setReviewData(processedData);
      } catch (err) {
        console.error("Error analyzing reviews:", err);
        setError("Failed to analyze reviews. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviewData();
  }, [productId]);
  
  const handlePurchaseClick = () => {
    navigate(`/purchase?productId=${productId}`);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background flex items-center justify-center">
        <LoadingIndicator text="Analyzing reviews..." />
      </div>
    );
  }
  
  if (error || !reviewData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background flex flex-col items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg max-w-md w-full text-center">
          <div className="mb-4 text-destructive">
            <BarChart3 size={48} className="mx-auto" />
          </div>
          <h1 className="text-xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground mb-6">{error || "Failed to analyze reviews"}</p>
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
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50 animate-enter mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Sentiment Analysis</h1>
          
          <Tabs 
            defaultValue="sentiment" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sentiment" className="flex items-center gap-2">
                <BarChart3 size={16} />
                <span>Sentiment</span>
              </TabsTrigger>
              <TabsTrigger value="wordcloud" className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 8h10M7 12h4m1 8l4-8M12 16h5" />
                </svg>
                <span>Word Cloud</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Newspaper size={16} />
                <span>Reviews</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sentiment" className="pt-8 min-h-[400px]">
              <div className="max-w-3xl mx-auto">
                <SentimentMeter sentiment={reviewData.sentiment} />
                
                <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-3">
                  <SentimentStat 
                    label="Positive" 
                    value={reviewData.sentiment.positive} 
                    color="positive"
                  />
                  <SentimentStat 
                    label="Neutral" 
                    value={reviewData.sentiment.neutral} 
                    color="neutral"
                  />
                  <SentimentStat 
                    label="Negative" 
                    value={reviewData.sentiment.negative} 
                    color="negative"
                  />
                </div>
                
                <div className="mt-12 p-6 rounded-xl bg-muted/30 border border-border/50">
                  <h3 className="text-lg font-medium mb-4">Analysis Summary</h3>
                  <p className="text-muted-foreground mb-2">
                    Based on {reviewData.reviews.length} reviews, this product has a sentiment score of {reviewData.sentiment.compound.toFixed(2)}, which is 
                    {reviewData.sentiment.compound > 0.25 ? " positive" : 
                     reviewData.sentiment.compound < -0.25 ? " negative" : " neutral"}.
                  </p>
                  <p className="text-muted-foreground">
                    {reviewData.sentiment.compound > 0.5 ? 
                      "Customers are highly satisfied with this product. It appears to meet or exceed expectations for most users." : 
                     reviewData.sentiment.compound > 0.25 ? 
                      "Customers generally have positive experiences with this product, though there may be some minor issues noted." : 
                     reviewData.sentiment.compound > -0.25 ? 
                      "Customer opinions are mixed or neutral. The product may have both positive features and notable drawbacks." : 
                     reviewData.sentiment.compound > -0.5 ? 
                      "Customers have expressed some concerns or disappointment with aspects of this product." : 
                      "Customers have reported significant issues with this product. You may want to consider alternatives."
                    }
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="wordcloud" className="pt-8 min-h-[400px]">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-2">Common Terms in Reviews</h3>
                <p className="text-muted-foreground">
                  This word cloud shows the most frequently mentioned terms in customer reviews
                </p>
              </div>
              
              <div className="flex justify-center">
                <WordCloud 
                  data={reviewData.wordCloudData} 
                  width={800} 
                  height={500} 
                  className="max-w-full"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-8 min-h-[400px]">
              <ReviewList reviews={reviewData.reviews} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-border/50 shadow-lg animate-fade-in">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-medium">
                Sentiment score: <span className={cn(
                  reviewData.sentiment.compound > 0.25 ? "text-positive" : 
                  reviewData.sentiment.compound < -0.25 ? "text-negative" : "text-neutral"
                )}>{reviewData.sentiment.compound.toFixed(2)}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Based on {reviewData.reviews.length} reviews
              </p>
            </div>
            
            <Button className="gap-2" size="lg" onClick={handlePurchaseClick}>
              <ShoppingCart size={18} />
              <span>Continue to Purchase</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

interface SentimentStatProps {
  label: string;
  value: number;
  color: "positive" | "neutral" | "negative";
}

function SentimentStat({ label, value, color }: SentimentStatProps) {
  // Convert decimal to percentage
  const percentage = Math.round(value * 100);
  
  return (
    <div className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-border/50">
      <h4 className="text-sm text-muted-foreground mb-2">{label}</h4>
      <div className="flex items-end justify-between mb-2">
        <span className={`text-2xl font-bold text-${color}`}>{percentage}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full bg-${color} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
