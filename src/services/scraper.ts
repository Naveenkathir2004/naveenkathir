
import { Product, Review } from "@/types";

// This is a mock service since we can't actually scrape from the frontend
// In a real application, this would be a backend service or API call

export async function validateAmazonUrl(url: string): Promise<boolean> {
  const amazonRegex = /^https?:\/\/(www\.)?amazon\.(com|co\.uk|ca|de|fr|it|es|co\.jp|in)\/.*$/;
  return amazonRegex.test(url);
}

export async function scrapeProductDetails(url: string): Promise<Product> {
  // In a real app, this would call a backend API
  // For now, we'll simulate a delay and return mock data
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Get a consistent ID from the URL (for demo purposes)
  const id = generateIdFromUrl(url);
  
  return {
    id,
    title: "Apple AirPods Pro (2nd Generation) Wireless Earbuds",
    description: "The Apple AirPods Pro (2nd generation) deliver up to 2x more Active Noise Cancellation than the previous generation. A single charge delivers up to 6 hours of battery life with Active Noise Cancellation turned on. The charging case provides up to 30 hours total listening time with Active Noise Cancellation turned on.",
    price: "$249.99",
    rating: 4.7,
    totalReviews: 31586,
    imageUrl: "https://m.media-amazon.com/images/I/71zny7BTRlL._AC_SL1500_.jpg",
    additionalImages: [
      "https://m.media-amazon.com/images/I/71bhWgQK-cL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/81gVVu8eEPL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71zcbXRRMYL._AC_SL1500_.jpg"
    ],
    features: [
      "Active Noise Cancellation reduces unwanted background noise",
      "Adaptive Transparency lets outside sounds in while reducing loud environmental noise",
      "Personalized Spatial Audio with dynamic head tracking places sound all around you",
      "Multiple ear tips including XS, S, M, L"
    ],
    url
  };
}

export async function scrapeProductReviews(productId: string): Promise<Review[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate deterministic but varied reviews based on the product ID
  return generateMockReviews(productId);
}

// Helper functions for the mock service
function generateIdFromUrl(url: string): string {
  // Extract a simple hash from the URL for demo purposes
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

function generateMockReviews(productId: string): Review[] {
  const reviewTemplates = [
    {
      title: "Absolutely love them!",
      content: "These are the best earbuds I've ever owned. The sound quality is incredible, and the noise cancellation works perfectly. I use them every day for work calls and listening to music. Battery life is impressive too!",
      rating: 5,
      helpful: 128
    },
    {
      title: "Great sound but uncomfortable",
      content: "The sound quality is fantastic and noise cancellation works well. However, they hurt my ears after about an hour of use. I've tried all the tip sizes but still can't get them to be comfortable for extended wear.",
      rating: 3,
      helpful: 43
    },
    {
      title: "Decent but overpriced",
      content: "They work well enough, but I'm not convinced they're worth the premium price. The noise cancellation is good, not great. Sound quality is nice but not mind-blowing. They're convenient with my other Apple products, so there's that.",
      rating: 3,
      helpful: 67
    },
    {
      title: "Perfect upgrade",
      content: "Coming from the original AirPods, these are a massive improvement in every way. The sound is richer, the noise cancellation is fantastic, and they fit much better in my ears. Highly recommend for any Apple user.",
      rating: 5,
      helpful: 92
    },
    {
      title: "Disappointed with durability",
      content: "They sounded great for the first month, then the right earbud started cutting out. Apple replaced them, but now I'm having issues with the case not charging properly. Expected better quality for the price.",
      rating: 2,
      helpful: 104
    },
    {
      title: "Life changing for travel",
      content: "I bought these specifically for a long international flight and they did not disappoint. The noise cancellation made the 12-hour journey so much more bearable. I could barely hear the engines and crying babies!",
      rating: 5,
      helpful: 76
    },
    {
      title: "Decent ANC, battery could be better",
      content: "The active noise cancellation works well in most environments, but I find myself charging these more often than I'd like. Battery life is okay but not great, especially with ANC enabled. Sound quality is very good though.",
      rating: 4,
      helpful: 31
    },
    {
      title: "Connection issues",
      content: "These keep dropping connection to my iPhone, which is frustrating when I'm in the middle of a call or listening to music. I've reset them multiple times but the issue persists. Not what I expected from Apple.",
      rating: 2,
      helpful: 52
    },
    {
      title: "Worth every penny",
      content: "These earbuds have exceeded my expectations. The spatial audio feature is amazing for movies, and the transparency mode is perfect when I need to hear my surroundings. They're comfortable enough to wear all day too.",
      rating: 5,
      helpful: 112
    },
    {
      title: "Good but not great",
      content: "They're decent earbuds with good sound quality. The noise cancellation is okay but doesn't block out all noise. The fit is comfortable for me, and I like the easy pairing with my iPhone. Just wish they were a bit cheaper.",
      rating: 4,
      helpful: 28
    }
  ];
  
  // Create author names based on the product ID to ensure they're different for different products
  const authorSuffixes = productId.split('').map(char => char.charCodeAt(0));
  
  // Create 20 reviews by duplicating and slightly modifying the templates
  return Array(20).fill(null).map((_, index) => {
    const template = reviewTemplates[index % reviewTemplates.length];
    const suffix = authorSuffixes[index % authorSuffixes.length];
    
    // Generate semi-random date in the last 3 months
    const date = new Date();
    date.setDate(date.getDate() - (index * 4) - Math.floor(Math.random() * 10));
    
    return {
      id: `review-${productId}-${index}`,
      author: `Customer${suffix}${index}`,
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      rating: template.rating,
      title: template.title,
      content: template.content + (index % 3 === 0 ? " Really impressed overall!" : ""),
      helpful: template.helpful + (index * 2)
    };
  });
}
