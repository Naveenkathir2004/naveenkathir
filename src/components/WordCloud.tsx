
import { useEffect, useRef, useState } from "react";
import { WordCloudItem } from "@/types";

interface WordCloudProps {
  data: WordCloudItem[];
  height?: number;
  width?: number;
  className?: string;
}

export default function WordCloud({ data, height = 400, width = 600, className }: WordCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendered, setIsRendered] = useState(false);
  
  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Find the max value for scaling
    const maxValue = Math.max(...data.map(item => item.value));
    
    // Position words
    const words: { text: string; value: number; x: number; y: number; size: number; color: string; angle: number }[] = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Color palette
    const colors = [
      'hsl(240, 5%, 20%)',
      'hsl(240, 5%, 30%)',
      'hsl(240, 5%, 40%)',
      'hsl(240, 5%, 50%)',
      'hsl(142, 71%, 45%)',
      'hsl(39, 100%, 50%)',
      'hsl(0, 84%, 60%)',
      'hsl(214, 100%, 60%)',
    ];
    
    // Place words
    let attempts = 0;
    const maxAttempts = 200;
    const placedWords = new Set();
    
    data.forEach(item => {
      // Scale the font size between 12 and 60 based on the value
      const fontSize = Math.max(12, Math.min(60, 12 + (item.value / maxValue) * 48));
      const color = colors[Math.floor(Math.random() * colors.length)];
      const angle = Math.random() < 0.5 ? 0 : 90; // Either horizontal or vertical
      
      // Try to find a position
      let placed = false;
      attempts = 0;
      
      while (!placed && attempts < maxAttempts) {
        // Generate spiral positions starting from center
        const angle = attempts * 0.1;
        const radius = 5 * attempts;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // Check if this position overlaps with existing words
        let overlaps = false;
        
        for (const word of words) {
          const dx = word.x - x;
          const dy = word.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Consider the word's size for overlap check
          if (distance < (word.size + fontSize) / 1.5) {
            overlaps = true;
            break;
          }
        }
        
        if (!overlaps && !placedWords.has(item.text) && 
            x > fontSize && x < canvas.width - fontSize && 
            y > fontSize && y < canvas.height - fontSize) {
          words.push({ 
            text: item.text, 
            value: item.value, 
            x, 
            y, 
            size: fontSize, 
            color,
            angle
          });
          placedWords.add(item.text);
          placed = true;
        }
        
        attempts++;
      }
    });
    
    // Draw words
    words.forEach(word => {
      ctx.save();
      ctx.font = `${word.size}px system-ui, sans-serif`;
      ctx.fillStyle = word.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Apply rotation if needed
      if (word.angle !== 0) {
        ctx.translate(word.x, word.y);
        ctx.rotate(word.angle * Math.PI / 180);
        ctx.fillText(word.text, 0, 0);
      } else {
        ctx.fillText(word.text, word.x, word.y);
      }
      
      ctx.restore();
    });
    
    setIsRendered(true);
  }, [data]);
  
  return (
    <div className={className}>
      {data.length === 0 ? (
        <div className="flex justify-center items-center h-[400px] text-muted-foreground">
          No data available for word cloud
        </div>
      ) : (
        <canvas 
          ref={canvasRef} 
          width={width} 
          height={height}
          className={`w-full max-w-full h-auto transition-opacity duration-700 ${isRendered ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}
