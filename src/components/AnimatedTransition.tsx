
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTransitionProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedTransition({
  show,
  children,
  className
}: AnimatedTransitionProps) {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 400); // This should match the transition duration
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "transition-all duration-400 ease-in-out",
        show ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-4",
        className
      )}
    >
      {children}
    </div>
  );
}
