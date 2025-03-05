
import { useEffect, useState } from "react";
import { SentimentResult } from "@/types";
import { cn } from "@/lib/utils";

interface SentimentMeterProps {
  sentiment: SentimentResult;
  className?: string;
}

export default function SentimentMeter({ sentiment, className }: SentimentMeterProps) {
  const [renderedCompound, setRenderedCompound] = useState(0);
  
  // Calculate the color based on the compound score
  // -1 to 1 range: negative is red, neutral is amber, positive is green
  const getColor = (score: number) => {
    if (score < -0.25) return "text-negative";
    if (score > 0.25) return "text-positive";
    return "text-neutral";
  };
  
  // Get sentiment description based on compound score
  const getSentimentDescription = (score: number) => {
    if (score < -0.5) return "Very Negative";
    if (score < -0.25) return "Negative";
    if (score < 0.25) return "Neutral";
    if (score < 0.5) return "Positive";
    return "Very Positive";
  };
  
  // Animated value effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setRenderedCompound(sentiment.compound);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [sentiment.compound]);
  
  // Calculate rotation for the meter needle
  // Convert -1 to 1 range to 0 to 180 degrees
  const needleRotation = 90 + ((renderedCompound + 1) / 2) * 180;
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="w-full max-w-xs mb-6">
        {/* Meter scale */}
        <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-1.5 w-full">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-negative via-neutral to-positive rounded-full"
            style={{ width: "100%" }}
          />
        </div>
        
        {/* Labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
        
        {/* Needle indicator */}
        <div className="relative h-16 mt-1">
          <div 
            className="absolute left-1/2 bottom-0 w-1 h-12 bg-foreground rounded-t-full origin-bottom transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
          />
          <div className="absolute left-1/2 bottom-0 w-4 h-4 bg-foreground rounded-full transform -translate-x-1/2" />
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-4xl font-bold mb-1 transition-colors duration-300" style={{ color: `hsl(var(--${getColor(renderedCompound).split('-')[1]}))` }}>
          {getSentimentDescription(renderedCompound)}
        </div>
        <div className="text-sm text-muted-foreground">
          Sentiment score: <span className="font-medium">{renderedCompound.toFixed(2)}</span> ({sentiment.positive.toFixed(2)} positive, {sentiment.neutral.toFixed(2)} neutral, {sentiment.negative.toFixed(2)} negative)
        </div>
      </div>
    </div>
  );
}
