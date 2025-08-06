import { AdjectiveAgent } from '../src/agent.js';
import type { Photo, AdjectiveResult } from '../src/types.js';

describe('AdjectiveAgent', () => {
  let agent: AdjectiveAgent;

  beforeEach(() => {
    agent = new AdjectiveAgent();
  });

  describe('analyzePhoto', () => {
    it('should generate adjectives for a photo with title and description', async () => {
      const photo: Photo = {
        id: 'test-1',
        path: '/test/sunset.jpg',
        filename: 'sunset.jpg',
        size: 1024000,
        mimeType: 'image/jpeg',
        createdAt: '2025-08-05T14:25:00Z',
        title: 'Golden Sunset',
        description: 'A beautiful sunset over the mountains',
        tags: ['nature', 'landscape']
      };

      const result = await agent.analyzePhoto(photo);

      expect(result).toMatchObject({
        photoId: 'test-1',
        adjectives: expect.any(Array),
        categories: expect.any(Object),
        enhancedDescription: expect.any(String),
        confidence: expect.any(Number),
        timestamp: expect.any(String),
        vocabularyStats: expect.any(Object)
      });

      expect(result.adjectives).toContain('golden');
      expect(result.adjectives).toContain('beautiful');
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.vocabularyStats).toBeDefined();
    });

    it('should handle photos with minimal metadata', async () => {
      const photo: Photo = {
        id: 'test-2',
        path: '/test/photo.jpg',
        filename: 'photo.jpg',
        size: 512000,
        mimeType: 'image/jpeg',
        createdAt: '2025-08-05T15:30:00Z'
      };

      const result = await agent.analyzePhoto(photo);

      expect(result.photoId).toBe('test-2');
      expect(result.adjectives).toHaveLength(10); // Default maxAdjectives
      expect(result.confidence).toBe(0.5); // Base confidence
    });

    it('should respect maxAdjectives option', async () => {
      const photo: Photo = {
        id: 'test-3',
        path: '/test/photo.jpg',
        filename: 'photo.jpg',
        size: 512000,
        mimeType: 'image/jpeg',
        createdAt: '2025-08-05T15:30:00Z',
        title: 'Test Photo',
        description: 'A test photo'
      };

      const result = await agent.analyzePhoto(photo, { maxAdjectives: 5 });

      expect(result.adjectives).toHaveLength(5);
    });

    it('should handle includeCategories option', async () => {
      const photo: Photo = {
        id: 'test-4',
        path: '/test/photo.jpg',
        filename: 'photo.jpg',
        size: 512000,
        mimeType: 'image/jpeg',
        createdAt: '2025-08-05T15:30:00Z',
        title: 'Test Photo'
      };

      const resultWithCategories = await agent.analyzePhoto(photo, { includeCategories: true });
      const resultWithoutCategories = await agent.analyzePhoto(photo, { includeCategories: false });

      expect(Object.keys(resultWithCategories.categories).length).toBeGreaterThan(0);
      expect(Object.keys(resultWithoutCategories.categories).length).toBe(0);
    });

    it('should handle enhanceDescription option', async () => {
      const photo: Photo = {
        id: 'test-5',
        path: '/test/photo.jpg',
        filename: 'photo.jpg',
        size: 512000,
        mimeType: 'image/jpeg',
        createdAt: '2025-08-05T15:30:00Z',
        title: 'Test Photo',
        description: 'Original description'
      };

      const resultWithEnhancement = await agent.analyzePhoto(photo, { enhanceDescription: true });
      const resultWithoutEnhancement = await agent.analyzePhoto(photo, { enhanceDescription: false });

      expect(resultWithEnhancement.enhancedDescription).toContain('This');
      expect(resultWithoutEnhancement.enhancedDescription).toBe('Original description');
    });

    it('should learn from input when learnFromInput is enabled', async () => {
      const photo: Photo = {
        id: 'test-6',
        path: '/test/photo.jpg',
        filename: 'photo.jpg',
        size: 512000,
        mimeType: 'image/jpeg',
        createdAt: '2025-08-05T15:30:00Z',
        title: 'Spectacular Sunset',
        description: 'A breathtaking view with vibrant colors',
        tags: ['amazing', 'stunning']
      };

      const result = await agent.analyzePhoto(photo, { learnFromInput: true });
      
      // Should learn new adjectives from the photo
      expect(result.vocabularyStats!.newAdjectivesLearned).toBeGreaterThan(0);
    });

    it('should use expanded vocabulary when enabled', async () => {
      // First learn some adjectives
      await agent.learnFromText('Magnificent, extraordinary, phenomenal', 'description');
      
      const photo: Photo = {
        id: 'test-7',
        path: '/test/photo.jpg',
        filename: 'photo.jpg',
        size: 512000,
        mimeType: 'image/jpeg',
        createdAt: '2025-08-05T15:30:00Z',
        title: 'Test Photo'
      };

      const result = await agent.analyzePhoto(photo, { expandVocabulary: true });
      
      // Should use learned adjectives
      expect(result.adjectives.some(adj => ['magnificent', 'extraordinary', 'phenomenal'].includes(adj))).toBe(true);
    });
  });

  describe('analyzePhotoBatch', () => {
    it('should process multiple photos', async () => {
      const photos: Photo[] = [
        {
          id: 'batch-1',
          path: '/test/sunset.jpg',
          filename: 'sunset.jpg',
          size: 1024000,
          mimeType: 'image/jpeg',
          createdAt: '2025-08-05T14:25:00Z',
          title: 'Golden Sunset',
          description: 'A beautiful sunset'
        },
        {
          id: 'batch-2',
          path: '/test/forest.jpg',
          filename: 'forest.jpg',
          size: 1536000,
          mimeType: 'image/jpeg',
          createdAt: '2025-08-05T15:30:00Z',
          title: 'Misty Forest',
          description: 'A mysterious forest'
        }
      ];

      const results = await agent.analyzePhotoBatch(photos);

      expect(results).toHaveLength(2);
      expect(results[0].photoId).toBe('batch-1');
      expect(results[1].photoId).toBe('batch-2');
      expect(results[0].adjectives).toContain('golden');
      expect(results[1].adjectives).toContain('mysterious');
    });

    it('should apply options to all photos in batch', async () => {
      const photos: Photo[] = [
        {
          id: 'batch-3',
          path: '/test/photo1.jpg',
          filename: 'photo1.jpg',
          size: 512000,
          mimeType: 'image/jpeg',
          createdAt: '2025-08-05T16:00:00Z',
          title: 'Photo 1'
        },
        {
          id: 'batch-4',
          path: '/test/photo2.jpg',
          filename: 'photo2.jpg',
          size: 512000,
          mimeType: 'image/jpeg',
          createdAt: '2025-08-05T16:01:00Z',
          title: 'Photo 2'
        }
      ];

      const results = await agent.analyzePhotoBatch(photos, { maxAdjectives: 3 });

      results.forEach(result => {
        expect(result.adjectives).toHaveLength(3);
      });
    });
  });

  describe('vocabulary learning', () => {
    it('should learn from text', async () => {
      const text = 'This is a magnificent, extraordinary, and phenomenal photograph.';
      const learned = await agent.learnFromText(text, 'description');
      
      expect(learned).toContain('magnificent');
      expect(learned).toContain('extraordinary');
      expect(learned).toContain('phenomenal');
    });

    it('should learn from multiple texts', async () => {
      const texts = [
        'Beautiful, stunning, amazing',
        'Colorful, vibrant, bright',
        'Peaceful, serene, calm'
      ];
      
      const learned = await agent.learnFromTextBatch(texts, 'description');
      
      expect(learned).toContain('beautiful');
      expect(learned).toContain('colorful');
      expect(learned).toContain('peaceful');
    });

    it('should add custom adjectives', () => {
      agent.addCustomAdjective('custom-adjective', 'custom-category', 'test');
      
      const categories = agent.getAllCategories();
      expect(categories).toContain('custom-category');
      
      const customAdjectives = agent.getAdjectivesByCategory('custom-category');
      expect(customAdjectives).toContain('custom-adjective');
    });
  });

  describe('vocabulary management', () => {
    it('should get vocabulary statistics', () => {
      const stats = agent.getVocabularyStats();
      
      expect(stats.totalAdjectives).toBeGreaterThan(0);
      expect(stats.categories).toBeGreaterThan(0);
      expect(stats.newAdjectivesLearned).toBeGreaterThanOrEqual(0);
      expect(stats.categoryBreakdown).toBeDefined();
    });

    it('should get all categories', () => {
      const categories = agent.getAllCategories();
      
      expect(categories).toContain('mood');
      expect(categories).toContain('visual');
      expect(categories).toContain('temporal');
      expect(categories).toContain('spatial');
      expect(categories).toContain('emotional');
    });

    it('should get adjectives by category', () => {
      const moodAdjectives = agent.getAdjectivesByCategory('mood');
      expect(moodAdjectives).toContain('serene');
      expect(moodAdjectives).toContain('vibrant');
      expect(moodAdjectives).toContain('melancholic');
    });

    it('should get most frequent adjectives', () => {
      const frequentAdjectives = agent.getMostFrequentAdjectives(5);
      expect(frequentAdjectives).toHaveLength(5);
      expect(frequentAdjectives[0]).toHaveProperty('adjective');
      expect(frequentAdjectives[0]).toHaveProperty('frequency');
    });
  });

  describe('import/export vocabulary', () => {
    it('should export and import vocabulary', () => {
      // Add some custom adjectives first
      agent.addCustomAdjective('test-adjective', 'test-category', 'test');
      
      // Export vocabulary
      const exported = agent.exportVocabulary();
      expect(exported).toBeDefined();
      
      // Create new agent and import
      const newAgent = new AdjectiveAgent();
      newAgent.importVocabulary(exported);
      
      // Verify imported vocabulary
      const categories = newAgent.getAllCategories();
      expect(categories).toContain('test-category');
      
      const testAdjectives = newAgent.getAdjectivesByCategory('test-category');
      expect(testAdjectives).toContain('test-adjective');
    });
  });

  describe('version and metadata', () => {
    it('should return correct version', () => {
      expect(agent.getVersion()).toBe('7.0.1');
    });

    it('should return correct agent name', () => {
      expect(agent.getAgentName()).toBe('AdjectiveAgent');
    });
  });

  describe('confidence calculation', () => {
    it('should calculate confidence based on photo metadata', async () => {
      const basePhoto: Photo = {
        id: 'confidence-test',
        path: '/test/photo.jpg',
        filename: 'photo.jpg',
        size: 512000,
        mimeType: 'image/jpeg',
        createdAt: '2025-08-05T15:30:00Z'
      };

      const photoWithTitle = { ...basePhoto, title: 'Test Title' };
      const photoWithDescription = { ...basePhoto, description: 'Test description' };
      const photoWithTags = { ...basePhoto, tags: ['tag1', 'tag2'] };
      const photoWithMetadata = { ...basePhoto, metadata: { key: 'value' } };

      const baseResult = await agent.analyzePhoto(basePhoto);
      const titleResult = await agent.analyzePhoto(photoWithTitle);
      const descResult = await agent.analyzePhoto(photoWithDescription);
      const tagsResult = await agent.analyzePhoto(photoWithTags);
      const metaResult = await agent.analyzePhoto(photoWithMetadata);

      expect(baseResult.confidence).toBe(0.5);
      expect(titleResult.confidence).toBe(0.6);
      expect(descResult.confidence).toBe(0.7);
      expect(tagsResult.confidence).toBe(0.6);
      expect(metaResult.confidence).toBe(0.6);
    });

    it('should cap confidence at 1.0', async () => {
      const photo: Photo = {
        id: 'max-confidence',
        path: '/test/photo.jpg',
        filename: 'photo.jpg',
        size: 512000,
        mimeType: 'image/jpeg',
        createdAt: '2025-08-05T15:30:00Z',
        title: 'Test Title',
        description: 'Test description',
        tags: ['tag1', 'tag2'],
        metadata: { key: 'value' }
      };

      const result = await agent.analyzePhoto(photo);
      expect(result.confidence).toBe(1.0);
    });
  });
});
