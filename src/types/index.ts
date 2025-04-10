
export type ResearchPaper = {
  id: string;
  title: string;
  abstract: string;
  content: string;
  author: User;
  date: string;
  category: string;  // Changed from string[] to string to match existing usage
  status: 'draft' | 'submitted' | 'under review' | 'published' | 'rejected';
  reviews: Review[];
  doi?: string; // Digital Object Identifier
  views: number;
  citations: number;
  tokens: number; // Reward tokens
  hash?: string; // Blockchain hash for verification
  keywords?: string[]; // Added keywords array property
};

export type Review = {
  id: string;
  reviewer: User;
  content: string;
  rating: number; // 1-5 rating
  date: string;
  status: 'pending' | 'completed';
  tokens: number; // Reward tokens
};

export type User = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  institution: string;
  role: 'researcher' | 'reviewer' | 'editor' | 'admin';
  papers: string[]; // IDs of authored papers
  reviews: string[]; // IDs of completed reviews
  tokens: number; // Token balance
  wallet?: string; // Blockchain wallet address
};

// Add Gemini API related types
export type GeminiApiConfig = {
  apiKey: string;
  modelName: string;
};

export interface GeminiChatMessage {
  role: 'user' | 'model' | 'system';
  parts: { text: string }[];
}
