import { AdjectiveCategories, LearningData, VocabularyManager, VocabularyStats } from './types.js';

export class ExpandableVocabularyManager {
  private vocabulary: VocabularyManager;
  private readonly version = '8.0.0';

  constructor() {
    this.vocabulary = {
      categories: {
        mood: ['serene', 'vibrant', 'melancholic', 'energetic', 'peaceful', 'dramatic', 'whimsical', 'mysterious'],
        visual: ['luminous', 'shadowy', 'colorful', 'monochromatic', 'textured', 'smooth', 'geometric', 'organic'],
        temporal: ['timeless', 'nostalgic', 'modern', 'vintage', 'ephemeral', 'eternal', 'fleeting', 'enduring'],
        spatial: ['expansive', 'intimate', 'vast', 'confined', 'open', 'layered', 'minimal', 'dense'],
        emotional: ['inspiring', 'contemplative', 'joyful', 'somber', 'hopeful', 'introspective', 'uplifting', 'profound']
      },
      learningData: {},
      customCategories: new Set(),
      adjectiveFrequency: {},
      contextPatterns: {}
    };
  }

  /**
   * Learn new adjectives from input text
   */
  learnFromText(text: string, context: string = 'general'): string[] {
    const learnedAdjectives: string[] = [];
    
    // Extract adjectives using various patterns
    const adjectivePatterns = [
      // Common adjective patterns
      /\b([a-zA-Z]+(?:ing|ed|ful|ous|ive|al|ic|able|ible|less|like|ish|y))\b/gi,
      // Comparative and superlative
      /\b([a-zA-Z]+(?:er|est))\b/gi,
      // Compound adjectives
      /\b([a-zA-Z]+-[a-zA-Z]+)\b/gi,
      // Descriptive phrases
      /\b([a-zA-Z]+)\s+(?:and|or)\s+([a-zA-Z]+)\b/gi
    ];

    adjectivePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const adjective = match.toLowerCase().trim();
          if (this.isValidAdjective(adjective) && !this.isCommonWord(adjective)) {
            this.addAdjective(adjective, this.detectCategory(adjective, context), context);
            learnedAdjectives.push(adjective);
          }
        });
      }
    });

    return learnedAdjectives;
  }

  /**
   * Learn from photo metadata
   */
  learnFromPhoto(photo: { title?: string; description?: string; tags?: string[] }): string[] {
    const learnedAdjectives: string[] = [];
    
    // Learn from title
    if (photo.title) {
      learnedAdjectives.push(...this.learnFromText(photo.title, 'title'));
    }
    
    // Learn from description
    if (photo.description) {
      learnedAdjectives.push(...this.learnFromText(photo.description, 'description'));
    }
    
    // Learn from tags
    if (photo.tags) {
      photo.tags.forEach(tag => {
        if (this.isValidAdjective(tag)) {
          this.addAdjective(tag, this.detectCategory(tag, 'tag'), 'tag');
          learnedAdjectives.push(tag);
        }
      });
    }
    
    return learnedAdjectives;
  }

  /**
   * Add a new adjective to the vocabulary
   */
  addAdjective(adjective: string, category: string, context: string): void {
    const normalizedAdjective = adjective.toLowerCase().trim();
    
    // Initialize category if it doesn't exist
    if (!this.vocabulary.categories[category]) {
      this.vocabulary.categories[category] = [];
      this.vocabulary.customCategories.add(category);
    }
    
    // Add adjective if not already present
    if (!this.vocabulary.categories[category].includes(normalizedAdjective)) {
      this.vocabulary.categories[category].push(normalizedAdjective);
    }
    
    // Update learning data
    this.vocabulary.learningData[normalizedAdjective] = {
      adjective: normalizedAdjective,
      category,
      context,
      frequency: (this.vocabulary.adjectiveFrequency[normalizedAdjective] || 0) + 1,
      confidence: this.calculateConfidence(normalizedAdjective, context),
      lastUsed: new Date().toISOString()
    };
    
    // Update frequency
    this.vocabulary.adjectiveFrequency[normalizedAdjective] = 
      (this.vocabulary.adjectiveFrequency[normalizedAdjective] || 0) + 1;
    
    // Update context patterns
    if (!this.vocabulary.contextPatterns[context]) {
      this.vocabulary.contextPatterns[context] = [];
    }
    if (!this.vocabulary.contextPatterns[context].includes(normalizedAdjective)) {
      this.vocabulary.contextPatterns[context].push(normalizedAdjective);
    }
  }

  /**
   * Generate adjectives using expanded vocabulary
   */
  generateAdjectives(photo: { title?: string; description?: string; tags?: string[] }, 
                    existing: string[], 
                    max: number,
                    options: { useLearning?: boolean; preferFrequent?: boolean } = {}): string[] {
    const { useLearning = true, preferFrequent = true } = options;
    const generated: string[] = [];
    
    // Apply smart rules based on photo metadata
    const smartAdjectives = this.applySmartRules(photo);
    generated.push(...smartAdjectives);
    
    // Use learned vocabulary if enabled
    if (useLearning) {
      const learnedAdjectives = this.getLearnedAdjectives(photo, preferFrequent);
      generated.push(...learnedAdjectives);
    }
    
    // Add random selection from all categories
    const allCategories = Object.entries(this.vocabulary.categories);
    allCategories.forEach(([category, adjectives]) => {
      const available = adjectives.filter(adj => 
        !existing.includes(adj) && !generated.includes(adj)
      );
      
      if (available.length > 0) {
        let selectedAdjective: string;
        
        if (preferFrequent) {
          // Prefer frequently used adjectives
          selectedAdjective = this.selectByFrequency(available);
        } else {
          // Random selection
          selectedAdjective = available[Math.floor(Math.random() * available.length)];
        }
        
        generated.push(selectedAdjective);
      }
    });
    
    return [...new Set([...existing, ...generated])].slice(0, max);
  }

  /**
   * Get vocabulary statistics
   */
  getVocabularyStats(): VocabularyStats {
    const totalAdjectives = Object.values(this.vocabulary.categories)
      .reduce((sum, category) => sum + category.length, 0);
    
    const categoryBreakdown: Record<string, number> = {};
    Object.entries(this.vocabulary.categories).forEach(([category, adjectives]) => {
      categoryBreakdown[category] = adjectives.length;
    });
    
    return {
      totalAdjectives,
      categories: Object.keys(this.vocabulary.categories).length,
      newAdjectivesLearned: Object.keys(this.vocabulary.learningData).length,
      categoryBreakdown
    };
  }

  /**
   * Get all categories including custom ones
   */
  getAllCategories(): string[] {
    return Object.keys(this.vocabulary.categories);
  }

  /**
   * Get adjectives by category
   */
  getAdjectivesByCategory(category: string): string[] {
    return this.vocabulary.categories[category] || [];
  }

  /**
   * Get most frequently used adjectives
   */
  getMostFrequentAdjectives(limit: number = 10): Array<{ adjective: string; frequency: number }> {
    return Object.entries(this.vocabulary.adjectiveFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([adjective, frequency]) => ({ adjective, frequency }));
  }

  /**
   * Export vocabulary for persistence
   */
  exportVocabulary(): VocabularyManager {
    return JSON.parse(JSON.stringify(this.vocabulary));
  }

  /**
   * Import vocabulary from external source
   */
  importVocabulary(vocabulary: VocabularyManager): void {
    this.vocabulary = JSON.parse(JSON.stringify(vocabulary));
  }

  // Private helper methods

  private isValidAdjective(word: string): boolean {
    // Filter out common words that aren't descriptive adjectives
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    ]);
    
    return word.length > 2 && !commonWords.has(word) && /^[a-zA-Z-]+$/.test(word);
  }

  private isCommonWord(word: string): boolean {
    const commonWords = new Set([
      'good', 'bad', 'big', 'small', 'new', 'old', 'high', 'low', 'long', 'short',
      'right', 'left', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under'
    ]);
    
    return commonWords.has(word);
  }

  private detectCategory(adjective: string, context: string): string {
    // Enhanced category detection based on word patterns and context
    const word = adjective.toLowerCase();
    
    // Mood indicators
    if (['happy', 'sad', 'angry', 'excited', 'calm', 'nervous', 'relaxed', 'tense'].includes(word)) {
      return 'mood';
    }
    
    // Visual indicators
    if (['bright', 'dark', 'colorful', 'dull', 'shiny', 'matte', 'clear', 'blurry'].includes(word)) {
      return 'visual';
    }
    
    // Temporal indicators
    if (['old', 'new', 'ancient', 'modern', 'temporary', 'permanent', 'quick', 'slow'].includes(word)) {
      return 'temporal';
    }
    
    // Spatial indicators
    if (['large', 'small', 'wide', 'narrow', 'deep', 'shallow', 'near', 'far'].includes(word)) {
      return 'spatial';
    }
    
    // Emotional indicators
    if (['loving', 'hateful', 'caring', 'cold', 'warm', 'passionate', 'indifferent'].includes(word)) {
      return 'emotional';
    }
    
    // Context-based detection
    if (context === 'title' || context === 'description') {
      return 'descriptive';
    }
    
    if (context === 'tag') {
      return 'categorized';
    }
    
    // Default to descriptive
    return 'descriptive';
  }

  private applySmartRules(photo: { title?: string; description?: string; tags?: string[] }): string[] {
    const adjectives: string[] = [];
    const title = photo.title?.toLowerCase() || '';
    const description = photo.description?.toLowerCase() || '';
    const tags = photo.tags?.map(t => t.toLowerCase()) || [];
    
    // Sunset/Sunrise patterns
    if (title.includes('sunset') || title.includes('sunrise') || description.includes('sunset') || description.includes('sunrise')) {
      adjectives.push('golden', 'warm', 'radiant', 'glowing', 'fiery', 'amber', 'crimson');
    }
    
    // Night/Dark patterns
    if (title.includes('night') || title.includes('dark') || description.includes('night') || description.includes('dark')) {
      adjectives.push('mysterious', 'shadowy', 'ethereal', 'nocturnal', 'twilight', 'starry', 'moonlit');
    }
    
    // Nature patterns
    if (title.includes('nature') || title.includes('forest') || title.includes('mountain') || 
        tags.includes('nature') || tags.includes('forest') || tags.includes('mountain')) {
      adjectives.push('natural', 'organic', 'wild', 'untamed', 'pristine', 'rustic', 'earthy');
    }
    
    // Urban patterns
    if (title.includes('city') || title.includes('urban') || title.includes('street') || 
        tags.includes('city') || tags.includes('urban') || tags.includes('street')) {
      adjectives.push('urban', 'metropolitan', 'cosmopolitan', 'bustling', 'dynamic', 'modern', 'architectural');
    }
    
    // Water patterns
    if (title.includes('water') || title.includes('ocean') || title.includes('river') || title.includes('lake') ||
        tags.includes('water') || tags.includes('ocean') || tags.includes('river') || tags.includes('lake')) {
      adjectives.push('flowing', 'fluid', 'reflective', 'crystalline', 'aquatic', 'marine', 'rippling');
    }
    
    return adjectives;
  }

  private getLearnedAdjectives(photo: { title?: string; description?: string; tags?: string[] }, 
                              preferFrequent: boolean): string[] {
    const contextAdjectives: string[] = [];
    
    // Get adjectives learned from similar contexts
    Object.entries(this.vocabulary.contextPatterns).forEach(([context, adjectives]) => {
      if (context === 'title' && photo.title) {
        contextAdjectives.push(...adjectives);
      }
      if (context === 'description' && photo.description) {
        contextAdjectives.push(...adjectives);
      }
      if (context === 'tag' && photo.tags) {
        contextAdjectives.push(...adjectives);
      }
    });
    
    if (preferFrequent) {
      // Sort by frequency
      return contextAdjectives
        .sort((a, b) => (this.vocabulary.adjectiveFrequency[b] || 0) - (this.vocabulary.adjectiveFrequency[a] || 0))
        .slice(0, 5);
    }
    
    return contextAdjectives.slice(0, 5);
  }

  private selectByFrequency(adjectives: string[]): string {
    return adjectives.reduce((best, current) => {
      const bestFreq = this.vocabulary.adjectiveFrequency[best] || 0;
      const currentFreq = this.vocabulary.adjectiveFrequency[current] || 0;
      return currentFreq > bestFreq ? current : best;
    });
  }

  private calculateConfidence(adjective: string, context: string): number {
    let confidence = 0.5;
    
    // Higher confidence for adjectives used in multiple contexts
    const contexts = Object.values(this.vocabulary.contextPatterns)
      .filter(adjectives => adjectives.includes(adjective));
    confidence += contexts.length * 0.1;
    
    // Higher confidence for frequently used adjectives
    const frequency = this.vocabulary.adjectiveFrequency[adjective] || 0;
    confidence += Math.min(frequency * 0.05, 0.3);
    
    // Higher confidence for adjectives in specific contexts
    if (context === 'title' || context === 'description') {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }
}
