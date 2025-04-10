
// Blockchain event types
export interface PaperSubmittedEvent {
  paperId: string;
  cid: string;
  title: string;
  author: string;
}

export interface DOIRegisteredEvent {
  paperId: string;
  doi: string;
  author: string;
}

export interface ReviewSubmittedEvent {
  paperId: string;
  reviewId: string;
  reviewer: string;
  score: number;
}

// Add Proposal interface for governance
export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  votesFor: number;
  votesAgainst: number;
  status: 'Active' | 'Executed' | 'Defeated' | 'Pending';
}

// Offchain metadata types
export interface OffchainMetadata {
  abstract?: string;
  keywords?: string[];
  affiliations?: string[];
  coauthors?: string[];
  funding?: string;
  acknowledgements?: string;
  originalityScore?: number; // Adding originality score to track plagiarism check results
}
