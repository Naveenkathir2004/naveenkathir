
import { Product, Review } from "@/types";

// This is a mock service for frontend demonstration
// In a real-world application, scraping would happen on a server-side
export async function validateAmazonUrl(url: string): Promise<boolean> {
  const amazonRegex = /^https?:\/\/(www\.)?amazon\.(com|co\.uk|ca|de|fr|it|es|co\.jp|in)\/.*$/;
  
  try {
    // Simulate validation checks
    console.log(`Validating URL: ${url}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return amazonRegex.test(url);
  } catch (error) {
    console.error("Error validating URL:", error);
    return false;
  }
}

export async function scrapeProductDetails(url: string): Promise<Product> {
  console.log(`Scraping product details from: ${url}`);
  
  try {
    // Simulate network request time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Extract ASIN or other identifier from URL (for mock purposes)
    const id = generateIdFromUrl(url);
    
    // Simulate different products based on URL
    const productCategory = getProductCategory(url);
    
    return generateMockProduct(id, url, productCategory);
  } catch (error) {
    console.error("Error scraping product details:", error);
    throw new Error("Failed to scrape product details");
  }
}

export async function scrapeProductReviews(productId: string): Promise<Review[]> {
  console.log(`Scraping reviews for product ID: ${productId}`);
  
  try {
    // Simulate a realistic delay for scraping multiple pages of reviews
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate deterministic but varied reviews based on the product ID
    return generateMockReviews(productId);
  } catch (error) {
    console.error("Error scraping product reviews:", error);
    throw new Error("Failed to scrape product reviews");
  }
}

// Helper function to determine a mock product category based on URL
function getProductCategory(url: string): string {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes("electronics") || urlLower.includes("kindle") || urlLower.includes("phone")) {
    return "electronics";
  } else if (urlLower.includes("book") || urlLower.includes("author")) {
    return "books";
  } else if (urlLower.includes("kitchen") || urlLower.includes("home")) {
    return "home";
  } else if (urlLower.includes("fashion") || urlLower.includes("clothing") || urlLower.includes("shoes")) {
    return "fashion";
  } else {
    return "general";
  }
}

// Helper function to generate mock product data
function generateMockProduct(id: string, url: string, category: string): Product {
  const productTemplates: Record<string, Partial<Product>> = {
    electronics: {
      title: "Apple AirPods Pro (2nd Generation) Wireless Earbuds",
      description: "The Apple AirPods Pro (2nd generation) deliver up to 2x more Active Noise Cancellation than the previous generation. A single charge delivers up to 6 hours of battery life with Active Noise Cancellation turned on.",
      price: "$249.99",
      rating: 4.7,
      totalReviews: 31586,
      imageUrl: "https://m.media-amazon.com/images/I/71zny7BTRlL._AC_SL1500_.jpg",
      additionalImages: [
        "https://m.media-amazon.com/images/I/71bhWgQK-cL._AC_SL1500_.jpg",
        "https://m.media-amazon.com/images/I/81gVVu8eEPL._AC_SL1500_.jpg"
      ],
      features: [
        "Active Noise Cancellation reduces unwanted background noise",
        "Adaptive Transparency lets outside sounds in while reducing loud environmental noise",
        "Personalized Spatial Audio with dynamic head tracking places sound all around you"
      ]
    },
    books: {
      title: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
      description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
      price: "$14.99",
      rating: 4.8,
      totalReviews: 87392,
      imageUrl: "https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UY436_QL65_.jpg",
      features: [
        "New York Times bestseller with over 10 million copies sold",
        "Available in multiple formats: hardcover, paperback, audiobook, and Kindle",
        "Translated into over 50 languages worldwide"
      ]
    },
    home: {
      title: "Ninja AF101 Air Fryer, 4 Qt, Black/gray",
      description: "The Ninja AF101 Air Fryer that Crisps, Roasts, Reheats, & Dehydrates with 4 Quart Capacity, and a High Gloss Finish, Black/Gray",
      price: "$89.99",
      rating: 4.6,
      totalReviews: 45893,
      imageUrl: "https://m.media-amazon.com/images/I/71+8uTMDRFL._AC_SL1500_.jpg",
      additionalImages: [
        "https://m.media-amazon.com/images/I/81B6JxFGv4L._AC_SL1500_.jpg",
        "https://m.media-amazon.com/images/I/81Zx-bFIwXL._AC_SL1500_.jpg"
      ],
      features: [
        "Wide temperature range: 105°F–400°F",
        "4-quart ceramic-coated nonstick basket and crisper plate",
        "Multi-layer rack to increase dehydrating capacity"
      ]
    },
    fashion: {
      title: "Levi's Men's 505 Regular Fit Jeans",
      description: "These men's jeans sit at the waist and feature a regular fit through the seat and thigh with a straight leg. Sits at waist, regular fit through thigh. Made with 100% cotton.",
      price: "$59.99",
      rating: 4.5,
      totalReviews: 23457,
      imageUrl: "https://m.media-amazon.com/images/I/61N2z21dS3L._AC_UX679_.jpg",
      features: [
        "Regular fit jeans",
        "Sits at waist",
        "Straight leg"
      ]
    },
    general: {
      title: "Amazon Basics Vacuum Compression Storage Bags with Hand Pump",
      description: "Space-saving storage bags for efficiently storing clothes, bedding, curtains, towels and more; ideal for closets, attics, bedrooms, and luggage.",
      price: "$19.99",
      rating: 4.3,
      totalReviews: 12645,
      imageUrl: "https://m.media-amazon.com/images/I/71K5hsFBlbL._AC_SL1500_.jpg",
      features: [
        "Reduces storage space by up to 80%",
        "Includes hand pump for air removal",
        "Made of durable, flexible plastic with double-zip seal"
      ]
    }
  };
  
  const template = productTemplates[category] || productTemplates.general;
  
  // Modify the template slightly for variation
  const lastDigit = id.slice(-1);
  
  return {
    id,
    title: template.title || "Amazon Product",
    description: template.description || "No description available",
    price: template.price || "$0.00",
    rating: (template.rating || 4) + (parseInt(lastDigit) / 20) - 0.25,
    totalReviews: template.totalReviews || 1000 + parseInt(lastDigit) * 100,
    imageUrl: template.imageUrl || "https://via.placeholder.com/300",
    additionalImages: template.additionalImages || [],
    features: template.features || [],
    url
  };
}

// Helper functions for generating deterministic mock data
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
  const reviews = [];
  
  // Add some randomness to the number of reviews (15-25)
  const numReviews = 15 + Math.floor((parseInt(productId.substring(0, 1), 16) % 10));
  
  for (let i = 0; i < numReviews; i++) {
    const template = reviewTemplates[i % reviewTemplates.length];
    const suffix = authorSuffixes[i % authorSuffixes.length];
    
    // Generate semi-random date in the last 3 months
    const date = new Date();
    date.setDate(date.getDate() - (i * 4) - Math.floor(Math.random() * 10));
    
    // Create a variation of the review based on the template
    reviews.push({
      id: `review-${productId}-${i}`,
      author: `Customer${suffix}${i}`,
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      rating: i === 0 ? template.rating : Math.max(1, Math.min(5, template.rating + (i % 3 - 1))),
      title: template.title + (i % 5 === 0 ? " - Updated" : ""),
      content: template.content + (i % 3 === 0 ? " Really impressed overall!" : ""),
      helpful: template.helpful + (i * 2)
    });
  }
  
  return reviews;
}

