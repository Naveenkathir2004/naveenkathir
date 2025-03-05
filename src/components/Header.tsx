
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // Determine if we should show the back button
  const showBackButton = location.pathname !== "/";
  
  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link 
              to="javascript:history.back()" 
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <ChevronLeft size={18} />
              <span className="text-sm">Back</span>
            </Link>
          )}
          
          <Link to="/" className="font-semibold text-lg tracking-tight">
            Sentiment<span className="text-primary">Insights</span>
          </Link>
        </div>
        
        <nav className="hidden sm:flex items-center gap-6">
          <Link 
            to="/" 
            className={cn(
              "text-sm transition-colors duration-200 hover:text-primary",
              location.pathname === "/" ? "text-primary font-medium" : "text-muted-foreground"
            )}
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
