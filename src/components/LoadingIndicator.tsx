
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  className?: string;
  text?: string;
}

export default function LoadingIndicator({
  className,
  text = "Loading..."
}: LoadingIndicatorProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="mt-4 text-sm text-muted-foreground animate-pulse">{text}</p>
    </div>
  );
}
