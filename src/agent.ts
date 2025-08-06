import { Photo, AdjectiveResult, AnalysisOptions } from './types.js';

export class AdjectiveAgent {
  private readonly adjectiveCategories = {
    mood: ['serene', 'vibrant', 'melancholic', 'energetic', 'peaceful', 'dramatic', 'whimsical', 'mysterious'],
    visual: ['luminous', 'shadowy', 'colorful', 'monochromatic', 'textured', 'smooth', 'geometric', 'organic'],
    temporal: ['timeless', 'nostalgic', 'modern', 'vintage', 'ephemeral', 'eternal', 'fleeting', 'enduring'],
    spatial: ['expansive', 'intimate', 'vast', 'confined', 'open', 'layered', 'minimal', 'dense'],
    emotional: ['inspiring', 'contemplative', 'joyful', 'somber', 'hopeful', 'introspective', 'uplifting', 'profound']
  };


  constructor() {
    // Standalone adjective agent - no external dependencies
  }

  async analyzePhoto(photo: Photo, options: AnalysisOptions = {}): Promise<AdjectiveResult> {
    const {
      maxAdjectives = 10,
      includeCategories = true,
      enhanceDescription = true
    } = options;

    const existingAdjectives = this.extractExistingAdjectives(photo);
    const generatedAdjectives = this.generateAdjectives(photo, existingAdjectives, maxAdjectives);
    const categorizedAdjectives = this.categorizeAdjectives(generatedAdjectives);
    
    const enhancedDescription = enhanceDescription 
      ? this.createEnhancedDescription(photo, generatedAdjectives)
      : photo.description || '';
    
    const confidence = this.calculateConfidence(photo);
    
    return {
      photoId: photo.id,
      adjectives: generatedAdjectives,
      categories: includeCategories ? categorizedAdjectives : {},
      enhancedDescription,
      confidence,
      timestamp: new Date().toISOString()
    };
  }

  async analyzePhotoBatch(photos: Photo[], options: AnalysisOptions = {}): Promise<AdjectiveResult[]> {
    return Promise.all(photos.map(photo => this.analyzePhoto(photo, options)));
  }

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

  private generateAdjectives(photo: Photo, existing: string[], max: number): string[] {
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
    
    adjectives.forEach(adj => {
      Object.entries(this.adjectiveCategories).forEach(([category, list]) => {
        if (list.includes(adj)) {
          if (!categorized[category]) categorized[category] = [];
          categorized[category].push(adj);
        }
      });
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