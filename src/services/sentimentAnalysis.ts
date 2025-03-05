
import { Review, ProcessedReviews, SentimentResult, WordCloudItem } from "@/types";

// This is a mock sentiment analysis service
// In a real app, this would use a real sentiment analysis library 
// or call to a backend service

export async function analyzeReviews(reviews: Review[]): Promise<ProcessedReviews> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Process the reviews
  const cleanedReviews = cleanReviewTexts(reviews);
  const sentiment = analyzeSentiment(cleanedReviews, reviews);
  const wordCloudData = generateWordCloudData(cleanedReviews);
  
  return {
    reviews,
    sentiment,
    wordCloudData
  };
}

// Clean the review text by removing stopwords, punctuation, etc.
function cleanReviewTexts(reviews: Review[]): string[] {
  const stopWords = new Set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 
    'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 
    'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 
    'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 
    'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 
    'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 
    'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 
    'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 
    'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
    'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 
    'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 
    'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 
    'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 
    'will', 'just', 'don', 'should', 'now'
  ]);
  
  return reviews.map(review => {
    let text = (review.title + " " + review.content).toLowerCase();
    
    // Remove punctuation
    text = text.replace(/[^\w\s]/g, '');
    
    // Remove numbers
    text = text.replace(/\d+/g, '');
    
    // Remove stopwords
    const words = text.split(/\s+/).filter(word => !stopWords.has(word) && word.length > 2);
    
    return words.join(' ');
  });
}

// Analyze sentiment using a mock VADER-like algorithm
function analyzeSentiment(cleanedTexts: string[], reviews: Review[]): SentimentResult {
  // This is a very simplified mock algorithm
  // In a real app, this would use a real sentiment analysis library

  // Simplified set of positive and negative words for the mock
  const positiveWords = new Set([
    'good', 'great', 'excellent', 'amazing', 'awesome', 'fantastic', 'wonderful',
    'love', 'perfect', 'best', 'better', 'recommend', 'happy', 'pleased', 'impressed',
    'comfortable', 'quality', 'worth', 'easy', 'convenient', 'reliable', 'durable'
  ]);
  
  const negativeWords = new Set([
    'bad', 'terrible', 'horrible', 'awful', 'poor', 'worst', 'disappointing',
    'disappointed', 'hate', 'difficult', 'uncomfortable', 'issue', 'problem',
    'broken', 'expensive', 'overpriced', 'pain', 'annoying', 'useless', 'waste'
  ]);
  
  // Calculate sentiment from the text and star ratings
  let positive = 0;
  let negative = 0;
  let neutral = 0;
  
  cleanedTexts.forEach((text, index) => {
    // Get words
    const words = text.split(/\s+/);
    
    // Count positive and negative words
    let posCount = words.filter(word => positiveWords.has(word)).length;
    let negCount = words.filter(word => negativeWords.has(word)).length;
    
    // Adjust for rating
    const rating = reviews[index].rating;
    if (rating >= 4) {
      posCount += 2;
    } else if (rating <= 2) {
      negCount += 2;
    } else {
      neutral += 1;
    }
    
    // Accumulate scores
    positive += posCount;
    negative += negCount;
    neutral += (words.length - posCount - negCount) / 10; // Reduce weight of neutral words
  });
  
  // Normalize to get percentages
  const total = positive + negative + neutral;
  const positiveScore = positive / total;
  const negativeScore = negative / total;
  const neutralScore = neutral / total;
  
  // Calculate compound score similar to VADER (-1 to 1)
  // Normalize to range of -1 to 1
  const compound = (positive - negative) / (positive + negative + 0.001);
  
  return {
    compound: Math.max(-1, Math.min(1, compound)), // Ensure it's in the -1 to 1 range
    positive: positiveScore,
    negative: negativeScore,
    neutral: neutralScore
  };
}

// Generate word cloud data from the cleaned texts
function generateWordCloudData(cleanedTexts: string[]): WordCloudItem[] {
  // Combine all cleaned texts
  const allText = cleanedTexts.join(' ');
  
  // Count word frequencies
  const wordCounts: Record<string, number> = {};
  allText.split(/\s+/).forEach(word => {
    if (word.length > 2) { // Skip very short words
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  
  // Convert to array format for word cloud
  const wordCloudData = Object.entries(wordCounts)
    .map(([text, value]) => ({ text, value }))
    .filter(item => item.value > 1) // Only include words that appear more than once
    .sort((a, b) => b.value - a.value)
    .slice(0, 50); // Limit to top 50 words
  
  return wordCloudData;
}
