
export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  rating: number;
  totalReviews: number;
  imageUrl: string;
  additionalImages?: string[];
  features?: string[];
  url: string;
}

export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
}

export interface SentimentResult {
  compound: number;
  positive: number;
  neutral: number;
  negative: number;
}

export interface WordCloudItem {
  text: string;
  value: number;
}

export interface ProcessedReviews {
  reviews: Review[];
  sentiment: SentimentResult;
  wordCloudData: WordCloudItem[];
}
