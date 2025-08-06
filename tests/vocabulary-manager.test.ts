import { ExpandableVocabularyManager } from '../src/vocabulary-manager.js';

describe('ExpandableVocabularyManager', () => {
  let vocabularyManager: ExpandableVocabularyManager;

  beforeEach(() => {
    vocabularyManager = new ExpandableVocabularyManager();
  });

  describe('learnFromText', () => {
    it('should learn adjectives from text', () => {
      const text = 'This is a beautiful, stunning, and amazing photograph with vibrant colors.';
      const learned = vocabularyManager.learnFromText(text, 'description');
      
      expect(learned).toContain('beautiful');
      expect(learned).toContain('stunning');
      expect(learned).toContain('amazing');
      expect(learned).toContain('vibrant');
    });

    it('should learn compound adjectives', () => {
      const text = 'A well-lit, close-up shot with high-quality details.';
      const learned = vocabularyManager.learnFromText(text, 'description');
      
      expect(learned).toContain('well-lit');
      expect(learned).toContain('close-up');
      expect(learned).toContain('high-quality');
    });

    it('should learn comparative and superlative forms', () => {
      const text = 'The brightest, most colorful, and largest image in the collection.';
      const learned = vocabularyManager.learnFromText(text, 'description');
      
      expect(learned).toContain('brightest');
      expect(learned).toContain('colorful');
      expect(learned).toContain('largest');
    });

    it('should filter out common words', () => {
      const text = 'The good and bad photo with big and small elements.';
      const learned = vocabularyManager.learnFromText(text, 'description');
      
      // Should not learn common words like 'good', 'bad', 'big', 'small'
      expect(learned).not.toContain('good');
      expect(learned).not.toContain('bad');
      expect(learned).not.toContain('big');
      expect(learned).not.toContain('small');
    });
  });

  describe('learnFromPhoto', () => {
    it('should learn from photo metadata', () => {
      const photo = {
        title: 'Golden Sunset',
        description: 'A breathtaking sunset with warm colors',
        tags: ['nature', 'landscape', 'spectacular']
      };
      
      const learned = vocabularyManager.learnFromPhoto(photo);
      
      expect(learned).toContain('golden');
      expect(learned).toContain('breathtaking');
      expect(learned).toContain('warm');
      expect(learned).toContain('spectacular');
    });

    it('should handle photos with minimal metadata', () => {
      const photo = {
        title: 'Photo 1',
        tags: ['minimal']
      };
      
      const learned = vocabularyManager.learnFromPhoto(photo);
      expect(learned).toContain('minimal');
    });
  });

  describe('generateAdjectives', () => {
    it('should generate adjectives using learned vocabulary', () => {
      // First learn some adjectives
      vocabularyManager.learnFromText('A beautiful, stunning, and amazing photograph', 'description');
      
      const photo = {
        title: 'Test Photo',
        description: 'A test description'
      };
      
      const existing: string[] = [];
      const generated = vocabularyManager.generateAdjectives(photo, existing, 5, {
        useLearning: true,
        preferFrequent: true
      });
      
      expect(generated.length).toBeGreaterThan(0);
      expect(generated).toContain('beautiful');
      expect(generated).toContain('stunning');
      expect(generated).toContain('amazing');
    });

    it('should apply smart rules based on photo content', () => {
      const photo = {
        title: 'Golden Sunset',
        description: 'A beautiful sunset over the mountains'
      };
      
      const existing: string[] = [];
      const generated = vocabularyManager.generateAdjectives(photo, existing, 10);
      
      // Should include sunset-related adjectives
      expect(generated).toContain('golden');
      expect(generated).toContain('warm');
      expect(generated).toContain('radiant');
    });

    it('should handle night/dark themes', () => {
      const photo = {
        title: 'Night City',
        description: 'A dark urban landscape'
      };
      
      const existing: string[] = [];
      const generated = vocabularyManager.generateAdjectives(photo, existing, 10);
      
      expect(generated).toContain('mysterious');
      expect(generated).toContain('shadowy');
      expect(generated).toContain('ethereal');
    });
  });

  describe('vocabulary statistics', () => {
    it('should provide accurate vocabulary statistics', () => {
      // Learn some adjectives first
      vocabularyManager.learnFromText('Beautiful, stunning, amazing', 'description');
      vocabularyManager.learnFromText('Colorful, vibrant, bright', 'title');
      
      const stats = vocabularyManager.getVocabularyStats();
      
      expect(stats.totalAdjectives).toBeGreaterThan(0);
      expect(stats.categories).toBeGreaterThan(0);
      expect(stats.newAdjectivesLearned).toBeGreaterThan(0);
      expect(stats.categoryBreakdown).toBeDefined();
    });

    it('should track category breakdown', () => {
      vocabularyManager.learnFromText('Happy, sad, excited', 'description'); // mood
      vocabularyManager.learnFromText('Bright, dark, colorful', 'title'); // visual
      
      const stats = vocabularyManager.getVocabularyStats();
      
      expect(stats.categoryBreakdown.mood).toBeGreaterThan(0);
      expect(stats.categoryBreakdown.visual).toBeGreaterThan(0);
    });
  });

  describe('category management', () => {
    it('should get all categories', () => {
      const categories = vocabularyManager.getAllCategories();
      
      expect(categories).toContain('mood');
      expect(categories).toContain('visual');
      expect(categories).toContain('temporal');
      expect(categories).toContain('spatial');
      expect(categories).toContain('emotional');
    });

    it('should get adjectives by category', () => {
      vocabularyManager.learnFromText('Happy, sad, excited', 'description');
      
      const moodAdjectives = vocabularyManager.getAdjectivesByCategory('mood');
      expect(moodAdjectives).toContain('happy');
      expect(moodAdjectives).toContain('sad');
      expect(moodAdjectives).toContain('excited');
    });

    it('should create new categories dynamically', () => {
      vocabularyManager.addAdjective('custom-adjective', 'custom-category', 'test');
      
      const categories = vocabularyManager.getAllCategories();
      expect(categories).toContain('custom-category');
      
      const customAdjectives = vocabularyManager.getAdjectivesByCategory('custom-category');
      expect(customAdjectives).toContain('custom-adjective');
    });
  });

  describe('frequency tracking', () => {
    it('should track adjective frequency', () => {
      // Use the same adjective multiple times
      vocabularyManager.learnFromText('Beautiful photo', 'description');
      vocabularyManager.learnFromText('Beautiful sunset', 'title');
      vocabularyManager.learnFromText('Beautiful landscape', 'tag');
      
      const frequentAdjectives = vocabularyManager.getMostFrequentAdjectives(5);
      const beautifulEntry = frequentAdjectives.find(entry => entry.adjective === 'beautiful');
      
      expect(beautifulEntry).toBeDefined();
      expect(beautifulEntry!.frequency).toBeGreaterThan(1);
    });

    it('should prefer frequent adjectives when generating', () => {
      // Learn some adjectives with different frequencies
      vocabularyManager.learnFromText('Beautiful photo', 'description');
      vocabularyManager.learnFromText('Beautiful sunset', 'title');
      vocabularyManager.learnFromText('Rare adjective', 'description');
      
      const photo = { title: 'Test' };
      const existing: string[] = [];
      const generated = vocabularyManager.generateAdjectives(photo, existing, 3, {
        useLearning: true,
        preferFrequent: true
      });
      
      // Should prefer 'beautiful' over 'rare' due to higher frequency
      expect(generated).toContain('beautiful');
    });
  });

  describe('import/export', () => {
    it('should export and import vocabulary correctly', () => {
      // Learn some adjectives
      vocabularyManager.learnFromText('Beautiful, stunning, amazing', 'description');
      
      // Export vocabulary
      const exported = vocabularyManager.exportVocabulary();
      
      // Create new manager and import
      const newManager = new ExpandableVocabularyManager();
      newManager.importVocabulary(exported);
      
      // Verify imported vocabulary
      const stats = newManager.getVocabularyStats();
      expect(stats.totalAdjectives).toBeGreaterThan(0);
      expect(stats.newAdjectivesLearned).toBeGreaterThan(0);
    });
  });

  describe('context patterns', () => {
    it('should learn context-specific patterns', () => {
      vocabularyManager.learnFromText('Title adjective', 'title');
      vocabularyManager.learnFromText('Description adjective', 'description');
      vocabularyManager.learnFromText('Tag adjective', 'tag');
      
      const photo = {
        title: 'Test Title',
        description: 'Test Description',
        tags: ['test']
      };
      
      const existing: string[] = [];
      const generated = vocabularyManager.generateAdjectives(photo, existing, 10, {
        useLearning: true,
        preferFrequent: true
      });
      
      // Should use context-appropriate adjectives
      expect(generated).toContain('title');
      expect(generated).toContain('description');
      expect(generated).toContain('tag');
    });
  });
});
