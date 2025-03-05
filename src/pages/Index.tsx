
import { useEffect, useRef } from "react";
import UrlForm from "@/components/UrlForm";
import Header from "@/components/Header";
import { ShoppingBag, Star, BarChart3, Search } from "lucide-react";

export default function Index() {
  const inputRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add a small delay for animation purposes
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.classList.add("opacity-100", "translate-y-0");
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background pb-16">
      <Header />
      
      <main className="pt-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <section className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight text-balance">
            Amazon Product Review
            <br />
            <span className="text-primary">Sentiment Analysis</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Analyze customer sentiment and explore product reviews to make better buying decisions
          </p>
          
          <div 
            ref={inputRef} 
            className="opacity-0 -translate-y-4 transition-all duration-700 delay-300"
          >
            <UrlForm />
          </div>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard 
            icon={<Search className="h-6 w-6" />}
            title="Analyze Amazon Reviews"
            description="Simply paste any Amazon product URL to extract and analyze all customer reviews"
          />
          <FeatureCard 
            icon={<BarChart3 className="h-6 w-6" />}
            title="Sentiment Analysis"
            description="See the overall sentiment score and understand customer satisfaction at a glance"
          />
          <FeatureCard 
            icon={<Star className="h-6 w-6" />}
            title="Make Better Decisions"
            description="Compare products, explore reviews, and make informed purchase decisions"
          />
        </section>
        
        <section className="text-center mb-16 py-12 px-6 rounded-2xl bg-primary/5 backdrop-blur-sm animate-enter">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StepCard 
              number={1}
              title="Enter Product URL"
              description="Paste any Amazon product URL into the search bar above"
            />
            <StepCard 
              number={2}
              title="Review Analysis"
              description="Our system analyzes customer reviews and calculates overall sentiment"
            />
            <StepCard 
              number={3}
              title="Make a Decision"
              description="Use the insights to decide if the product is right for you"
            />
          </div>
        </section>
        
        <section className="text-center py-10 px-6 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm border border-border/50 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            Ready to analyze a product?
          </h2>
          <p className="text-muted-foreground mb-8">
            Get started by entering an Amazon product URL above.
          </p>
          
          <div className="flex justify-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag size={18} />
              <span>Start Analyzing</span>
            </button>
          </div>
        </section>
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
    <div className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:shadow-md hover:bg-white/90 animate-fade-in">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold text-xl">
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
