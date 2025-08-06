import { Photo, AdjectiveResult, AnalysisOptions, AdjectiveCategories } from './types.js';
import { ExpandableVocabularyManager } from './vocabulary-manager.js';

export class AdjectiveAgent {
  private readonly version = '8.0.0';
  private readonly agentName = 'AdjectiveAgent';
  private vocabularyManager: ExpandableVocabularyManager;
  
  private readonly adjectiveCategories: AdjectiveCategories = {
    mood: ['serene', 'vibrant', 'melancholic', 'energetic', 'peaceful', 'dramatic', 'whimsical', 'mysterious'],
    visual: ['luminous', 'shadowy', 'colorful', 'monochromatic', 'textured', 'smooth', 'geometric', 'organic'],
    temporal: ['timeless', 'nostalgic', 'modern', 'vintage', 'ephemeral', 'eternal', 'fleeting', 'enduring'],
    spatial: ['expansive', 'intimate', 'vast', 'confined', 'open', 'layered', 'minimal', 'dense'],
    emotional: ['inspiring', 'contemplative', 'joyful', 'somber', 'hopeful', 'introspective', 'uplifting', 'profound']
  };

  constructor() {
    this.vocabularyManager = new ExpandableVocabularyManager();
  }

  async analyzePhoto(photo: Photo, options: AnalysisOptions = {}): Promise<AdjectiveResult> {
    const {
      maxAdjectives = 10,
      includeCategories = true,
      enhanceDescription = true,
      learnFromInput = true,
      expandVocabulary = true
    } = options;

    // Learn from the photo if learning is enabled
    if (learnFromInput) {
      this.vocabularyManager.learnFromPhoto(photo);
    }

    const existingAdjectives = this.extractExistingAdjectives(photo);
    const generatedAdjectives = expandVocabulary 
      ? this.vocabularyManager.generateAdjectives(photo, existingAdjectives, maxAdjectives, {
          useLearning: true,
          preferFrequent: true
        })
      : this.generateAdjectivesLegacy(photo, existingAdjectives, maxAdjectives);
    
    const categorizedAdjectives = includeCategories 
      ? this.categorizeAdjectives(generatedAdjectives)
      : {};
    
    const enhancedDescription = enhanceDescription 
      ? this.createEnhancedDescription(photo, generatedAdjectives)
      : photo.description || '';
    
    const confidence = this.calculateConfidence(photo);
    const vocabularyStats = this.vocabularyManager.getVocabularyStats();
    
    return {
      photoId: photo.id,
      adjectives: generatedAdjectives,
      categories: categorizedAdjectives,
      enhancedDescription,
      confidence,
      timestamp: new Date().toISOString(),
      vocabularyStats
    };
  }

  async analyzePhotoBatch(photos: Photo[], options: AnalysisOptions = {}): Promise<AdjectiveResult[]> {
    return Promise.all(photos.map(photo => this.analyzePhoto(photo, options)));
  }

  /**
   * Learn from external text sources to expand vocabulary
   */
  async learnFromText(text: string, context: string = 'general'): Promise<string[]> {
    return this.vocabularyManager.learnFromText(text, context);
  }

  /**
   * Learn from multiple text sources
   */
  async learnFromTextBatch(texts: string[], context: string = 'general'): Promise<string[]> {
    const allLearned: string[] = [];
    texts.forEach(text => {
      allLearned.push(...this.vocabularyManager.learnFromText(text, context));
    });
    return allLearned;
  }

  /**
   * Get vocabulary statistics
   */
  getVocabularyStats() {
    return this.vocabularyManager.getVocabularyStats();
  }

  /**
   * Get all available categories
   */
  getAllCategories(): string[] {
    return this.vocabularyManager.getAllCategories();
  }

  /**
   * Get adjectives by category
   */
  getAdjectivesByCategory(category: string): string[] {
    return this.vocabularyManager.getAdjectivesByCategory(category);
  }

  /**
   * Get most frequently used adjectives
   */
  getMostFrequentAdjectives(limit: number = 10) {
    return this.vocabularyManager.getMostFrequentAdjectives(limit);
  }

  /**
   * Export vocabulary for persistence
   */
  exportVocabulary() {
    return this.vocabularyManager.exportVocabulary();
  }

  /**
   * Import vocabulary from external source
   */
  importVocabulary(vocabulary: any): void {
    this.vocabularyManager.importVocabulary(vocabulary);
  }

  /**
   * Add custom adjective to vocabulary
   */
  addCustomAdjective(adjective: string, category: string, context: string = 'custom'): void {
    this.vocabularyManager.addAdjective(adjective, category, context);
  }

  getVersion(): string {
    return this.version;
  }

  getAgentName(): string {
    return this.agentName;
  }

  // Legacy method for backward compatibility
  private extractExistingAdjectives(photo: Photo): string[] {
    const adjectives: string[] = [];
    const adjectivePatterns = /\b(beautiful|stunning|amazing|gorgeous|lovely|nice|great|wonderful|excellent|perfect)\b/gi;
    
    if (photo.description) {
      const matches = photo.description.match(adjectivePatterns);
      if (matches) adjectives.push(...matches.map(m => m.toLowerCase()));
    }
    
    if (photo.tags) {
      adjectives.push(...photo.tags.filter(tag => 
        Object.values(this.adjectiveCategories).flat().includes(tag.toLowerCase())
      ));
    }
    
    return [...new Set(adjectives)];
  }

  // Legacy method for backward compatibility
  private generateAdjectivesLegacy(photo: Photo, existing: string[], max: number): string[] {
    const generated: string[] = [];
    
    // Smart selection based on photo metadata
    if (photo.title?.toLowerCase().includes('sunset') || photo.title?.toLowerCase().includes('sunrise')) {
      generated.push('golden', 'warm', 'radiant');
    }
    
    if (photo.title?.toLowerCase().includes('night') || photo.title?.toLowerCase().includes('dark')) {
      generated.push('mysterious', 'shadowy', 'ethereal');
    }
    
    // Add random selection from categories
    Object.values(this.adjectiveCategories).forEach(category => {
      const available = category.filter(adj => !existing.includes(adj) && !generated.includes(adj));
      if (available.length > 0) {
        const randomAdj = available[Math.floor(Math.random() * available.length)];
        generated.push(randomAdj);
      }
    });
    
    return [...new Set([...existing, ...generated])].slice(0, max);
  }

  private categorizeAdjectives(adjectives: string[]): Record<string, string[]> {
    const categorized: Record<string, string[]> = {};
    
    // Use vocabulary manager for categorization
    adjectives.forEach(adj => {
      const category = this.vocabularyManager.getAdjectivesByCategory(adj)[0] || 'descriptive';
      if (!categorized[category]) categorized[category] = [];
      categorized[category].push(adj);
    });
    
    return categorized;
  }

  private createEnhancedDescription(photo: Photo, adjectives: string[]): string {
    const base = photo.description || `A photo titled "${photo.title || 'Untitled'}"`;
    const adjectivePhrase = adjectives.slice(0, 3).join(', ');
    return `${base}. This ${adjectivePhrase} image captures a unique moment.`;
  }

  private calculateConfidence(photo: Photo): number {
    let confidence = 0.5;
    if (photo.title) confidence += 0.1;
    if (photo.description) confidence += 0.2;
    if (photo.tags && photo.tags.length > 0) confidence += 0.1;
    if (photo.metadata) confidence += 0.1;
    return Math.min(confidence, 1.0);
  }
}