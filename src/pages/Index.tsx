
import { Button } from "@/components/ui/button";
import { ShoppingCart, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import UrlForm from "@/components/UrlForm";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 animate-fade-in">
            Amazon Sentiment Analysis
          </h1>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl animate-fade-in animation-delay-100">
            Analyze Amazon product reviews to get insights about customer sentiment. 
            Just paste an Amazon product URL below to get started.
          </p>
          
          <div className="w-full mb-16 animate-fade-in animation-delay-200">
            <UrlForm />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl animate-fade-in animation-delay-300">
            <FeatureCard 
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Sentiment Analysis"
              description="Discover the overall sentiment of reviews using advanced analysis techniques"
            />
            <FeatureCard 
              icon={<ShoppingCart className="h-10 w-10 text-primary" />}
              title="Make Informed Decisions"
              description="Use real customer feedback to make better purchasing decisions"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-border/50 transition-all duration-300 hover:shadow-md hover:bg-white/90">
      <div className="mb-4">
        {icon}
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
