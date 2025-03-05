
import { useState } from "react";
import { Review } from "@/types";
import { Star, ThumbsUp, Filter } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ReviewListProps {
  reviews: Review[];
  className?: string;
}

type SortOption = "recent" | "helpful" | "highest" | "lowest";

export default function ReviewList({ reviews, className }: ReviewListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter reviews by search term
  const filteredReviews = reviews.filter(review => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      review.title.toLowerCase().includes(term) || 
      review.content.toLowerCase().includes(term)
    );
  });
  
  // Sort reviews based on current selection
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "helpful":
        return b.helpful - a.helpful;
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });
  
  return (
    <div className={className}>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-xl font-semibold">
          Customer Reviews <span className="text-muted-foreground">({reviews.length})</span>
        </h3>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search in reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 sm:w-auto min-w-[200px] bg-white/70 backdrop-blur-sm"
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-white/70 backdrop-blur-sm">
                <Filter size={16} />
                <span>Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <DropdownMenuRadioItem value="recent">Most Recent</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="helpful">Most Helpful</DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                <DropdownMenuRadioItem value="highest">Highest Rating</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="lowest">Lowest Rating</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {sortedReviews.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-lg">
          {searchTerm ? "No reviews match your search." : "No reviews available."}
        </div>
      ) : (
        <div className="grid gap-6">
          {sortedReviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
  index: number;
}

function ReviewCard({ review, index }: ReviewCardProps) {
  return (
    <div 
      className={cn(
        "p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-border/50 transition-all duration-300",
        "hover:shadow-md hover:bg-white/80"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex justify-between mb-2">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < review.rating ? "text-neutral fill-neutral" : "text-muted"} 
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{review.date}</span>
      </div>
      
      <h4 className="text-lg font-medium mb-2">{review.title}</h4>
      <p className="text-muted-foreground mb-4">{review.content}</p>
      
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">By {review.author}</span>
        <div className="flex items-center gap-1 text-muted-foreground">
          <ThumbsUp size={14} />
          <span>{review.helpful} found this helpful</span>
        </div>
      </div>
    </div>
  );
}
