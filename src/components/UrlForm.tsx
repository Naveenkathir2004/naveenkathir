
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateAmazonUrl } from "@/services/scraper";
import { cn } from "@/lib/utils";

export default function UrlForm() {
  const [url, setUrl] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError("Please enter an Amazon product URL");
      return;
    }
    
    setIsValidating(true);
    setError("");
    
    try {
      const isValid = await validateAmazonUrl(url);
      
      if (isValid) {
        // Encode the URL to safely pass it in the route
        const encodedUrl = encodeURIComponent(url);
        navigate(`/product-details?url=${encodedUrl}`);
      } else {
        setError("Please enter a valid Amazon product URL");
      }
    } catch (err) {
      setError("An error occurred while validating the URL");
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="url"
              placeholder="Paste Amazon product URL here..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              className={cn(
                "pl-10 pr-4 py-6 text-base transition-all duration-200 bg-white/70 backdrop-blur-sm",
                "hover:bg-white/90 focus:bg-white focus:shadow-md",
                "border-muted dark:bg-black/40 dark:hover:bg-black/60 dark:focus:bg-black/80",
                error ? "border-destructive focus:ring-destructive/30" : ""
              )}
              disabled={isValidating}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          
          <Button 
            type="submit" 
            disabled={isValidating} 
            className="px-6 py-6 bg-primary hover:bg-primary/90 text-base font-medium"
          >
            {isValidating ? "Validating..." : "Analyze"}
          </Button>
        </div>
        
        {error && (
          <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-sm text-destructive mt-1 animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </form>
  );
}
