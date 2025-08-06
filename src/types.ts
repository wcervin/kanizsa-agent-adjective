// Independent type definitions for Adjective Agent
// No direct dependencies on other repositories

export interface Photo {
  id: string;
  path: string;
  filename: string;
  size: number;
  mimeType: string;
  createdAt: string;
  title?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface AdjectiveResult {
  photoId: string;
  adjectives: string[];
  categories: Record<string, string[]>;
  enhancedDescription: string;
  confidence: number;
  timestamp: string;
  vocabularyStats?: VocabularyStats;
}

export interface AnalysisOptions {
  maxAdjectives?: number;        // Default: 10
  includeCategories?: boolean;   // Default: true
  enhanceDescription?: boolean;  // Default: true
  learnFromInput?: boolean;      // Default: true - learn new adjectives from input
  expandVocabulary?: boolean;    // Default: true - use expanded vocabulary
}

export interface AdjectiveCategories {
  mood: string[];
  visual: string[];
  temporal: string[];
  spatial: string[];
  emotional: string[];
  [category: string]: string[];  // Allow dynamic categories
}

export interface VocabularyStats {
  totalAdjectives: number;
  categories: number;
  newAdjectivesLearned: number;
  categoryBreakdown: Record<string, number>;
}

export interface LearningData {
  adjective: string;
  category: string;
  context: string;
  frequency: number;
  confidence: number;
  lastUsed: string;
}

export interface VocabularyManager {
  categories: AdjectiveCategories;
  learningData: Record<string, LearningData>;
  customCategories: Set<string>;
  adjectiveFrequency: Record<string, number>;
  contextPatterns: Record<string, string[]>;
}

export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: string;
  requestId?: string;
}