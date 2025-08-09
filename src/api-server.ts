/**
 * Kanizsa Adjective Agent - Comprehensive API Server
 * 
 * This module provides a comprehensive API server for the Adjective Agent
 * that is 100% compatible with the MCP server protocol and provides
 * complete API coverage for photo analysis and vocabulary management.
 * 
 * VERSION: 11.0.0 - MCP Server Compatibility
 * LAST UPDATED: August 09, 2025, 11:14:17 CDT
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AdjectiveAgent } from './agent.js';
import { Photo, AdjectiveResult, AnalysisOptions, ErrorResponse } from './types.js';

// =============================================================================
// API SERVER CLASS
// =============================================================================

export class AdjectiveAgentApiServer {
  private app: express.Application;
  private agent: AdjectiveAgent;
  private requestId: number = 0;

  constructor() {
    this.app = express();
    this.agent = new AdjectiveAgent();
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup middleware for security and monitoring
   */
  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        error: 'Too many requests from this IP',
        code: 'RATE_LIMIT_EXCEEDED',
        timestamp: new Date().toISOString()
      }
    });
    this.app.use(limiter);

    // Request parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req, res, next) => {
      const start = Date.now();
      const requestId = this.generateRequestId();
      
      // Add request ID to response headers
      res.set('X-Request-ID', requestId);
      res.set('X-Kanizsa-Version', '10.0.1');
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - ${requestId}`);
      });
      next();
    });
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `adj_${++this.requestId}_${Date.now()}`;
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    // Health and status endpoints
    this.setupHealthRoutes();
    
    // Photo analysis endpoints
    this.setupPhotoAnalysisRoutes();
    
    // Vocabulary management endpoints
    this.setupVocabularyRoutes();
    
    // Agent management endpoints
    this.setupAgentManagementRoutes();
    
    // Learning and training endpoints
    this.setupLearningRoutes();
    
    // Error handling
    this.setupErrorHandling();
  }

  /**
   * Setup health and status routes
   */
  private setupHealthRoutes(): void {
    // Health check (MCP Server compatible)
    this.app.get('/health', (req, res) => {
      try {
        const stats = this.agent.getVocabularyStats();
        res.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '11.0.0',
          agent: {
            name: this.agent.getAgentName(),
            version: this.agent.getVersion(),
            status: 'active'
          },
          vocabulary: {
            totalAdjectives: stats.totalAdjectives,
            categories: stats.categories,
            newAdjectivesLearned: stats.newAdjectivesLearned
          },
          uptime: process.uptime(),
          memory: process.memoryUsage()
        });
      } catch (error) {
        res.status(503).json({
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Status endpoint
    this.app.get('/status', (req, res) => {
      try {
        const stats = this.agent.getVocabularyStats();
        res.json({
          timestamp: new Date().toISOString(),
          version: '11.0.0',
          agent: {
            name: this.agent.getAgentName(),
            version: this.agent.getVersion(),
            status: 'active'
          },
          vocabulary: stats,
          performance: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpu: process.cpuUsage()
          }
        });
      } catch (error) {
        res.status(500).json({
          error: 'Failed to get status',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Info endpoint (MCP Server compatible)
    this.app.get('/info', (req, res) => {
      res.json({
        name: 'Adjective Agent',
        version: '11.0.0',
        description: 'Generates descriptive adjectives for photos with infinite vocabulary learning',
        capabilities: ['photo_analysis', 'adjective_generation', 'vocabulary_learning'],
        author: 'Kanizsa Team',
        license: 'MIT',
        endpoints: {
          health: '/health',
          analyze: '/analyze',
          analyze_batch: '/analyze/batch',
          vocabulary: '/vocabulary',
          learning: '/learning'
        }
      });
    });

    // Version endpoint
    this.app.get('/version', (req, res) => {
      res.json({
        version: '11.0.0',
        name: 'kanizsa-adjective-agent',
        description: 'Kanizsa Adjective Agent with comprehensive API coverage',
        timestamp: new Date().toISOString()
      });
    });
  }

  /**
   * Setup photo analysis routes
   */
  private setupPhotoAnalysisRoutes(): void {
    // Analyze single photo (MCP Server compatible)
    this.app.post('/analyze', async (req, res) => {
      try {
        const { photoUrl, options } = req.body;
        
        if (!photoUrl) {
          return res.status(400).json({
            error: 'photoUrl is required',
            code: 'MISSING_PHOTO_URL',
            timestamp: new Date().toISOString()
          });
        }

        // Convert URL to Photo object
        const photo: Photo = {
          id: `photo_${Date.now()}`,
          path: photoUrl,
          filename: photoUrl.split('/').pop() || 'unknown.jpg',
          size: 0,
          mimeType: 'image/jpeg',
          createdAt: new Date().toISOString(),
          title: options?.title,
          description: options?.description,
          tags: options?.tags,
          metadata: options?.metadata
        };

        const result = await this.agent.analyzePhoto(photo, options);
        
        res.json({
          photoId: result.photoId,
          adjectives: result.adjectives,
          categories: result.categories,
          confidence: result.confidence,
          processingTime: Date.now() - parseInt(result.photoId.split('_')[1]),
          timestamp: result.timestamp
        });

      } catch (error) {
        this.handleError(res, error);
      }
    });

    // Analyze multiple photos in batch (MCP Server compatible)
    this.app.post('/analyze/batch', async (req, res) => {
      try {
        const { photos, options } = req.body;
        
        if (!photos || !Array.isArray(photos)) {
          return res.status(400).json({
            error: 'photos array is required',
            code: 'MISSING_PHOTOS_ARRAY',
            timestamp: new Date().toISOString()
          });
        }

        const photoObjects: Photo[] = photos.map((photoData: any, index: number) => ({
          id: `photo_${Date.now()}_${index}`,
          path: photoData.url || photoData.path,
          filename: (photoData.url || photoData.path).split('/').pop() || 'unknown.jpg',
          size: photoData.size || 0,
          mimeType: photoData.mimeType || 'image/jpeg',
          createdAt: new Date().toISOString(),
          title: photoData.title,
          description: photoData.description,
          tags: photoData.tags,
          metadata: photoData.metadata
        }));

        const results = await this.agent.analyzePhotoBatch(photoObjects, options);
        
        res.json({
          results: results.map(result => ({
            photoId: result.photoId,
            adjectives: result.adjectives,
            categories: result.categories,
            confidence: result.confidence,
            timestamp: result.timestamp
          })),
          totalProcessed: results.length,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        this.handleError(res, error);
      }
    });

    // Analyze photo with detailed options
    this.app.post('/api/photos/analyze', async (req, res) => {
      try {
        const { photo, options } = req.body;
        
        if (!photo) {
          return res.status(400).json({
            error: 'photo object is required',
            code: 'MISSING_PHOTO_OBJECT',
            timestamp: new Date().toISOString()
          });
        }

        const photoObject: Photo = {
          id: photo.id || `photo_${Date.now()}`,
          path: photo.url || photo.path,
          filename: (photo.url || photo.path).split('/').pop() || 'unknown.jpg',
          size: photo.size || 0,
          mimeType: photo.mimeType || 'image/jpeg',
          createdAt: new Date().toISOString(),
          title: photo.title,
          description: photo.description,
          tags: photo.tags,
          metadata: photo.metadata
        };

        const result = await this.agent.analyzePhoto(photoObject, options);
        
        res.json({
          success: true,
          data: result,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        this.handleError(res, error);
      }
    });
  }

  /**
   * Setup vocabulary management routes
   */
  private setupVocabularyRoutes(): void {
    // Get vocabulary statistics
    this.app.get('/vocabulary/stats', (req, res) => {
      try {
        const stats = this.agent.getVocabularyStats();
        res.json({
          success: true,
          data: stats,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // Get all categories
    this.app.get('/vocabulary/categories', (req, res) => {
      try {
        const categories = this.agent.getAllCategories();
        res.json({
          success: true,
          data: categories,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // Get adjectives by category
    this.app.get('/vocabulary/categories/:category', (req, res) => {
      try {
        const { category } = req.params;
        const adjectives = this.agent.getAdjectivesByCategory(category);
        res.json({
          success: true,
          data: {
            category,
            adjectives,
            count: adjectives.length
          },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // Get most frequent adjectives
    this.app.get('/vocabulary/frequent', (req, res) => {
      try {
        const { limit } = req.query;
        const adjectives = this.agent.getMostFrequentAdjectives(parseInt(limit as string) || 10);
        res.json({
          success: true,
          data: adjectives,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // Export vocabulary
    this.app.get('/vocabulary/export', (req, res) => {
      try {
        const vocabulary = this.agent.exportVocabulary();
        res.json({
          success: true,
          data: vocabulary,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // Import vocabulary
    this.app.post('/vocabulary/import', (req, res) => {
      try {
        const { vocabulary } = req.body;
        
        if (!vocabulary) {
          return res.status(400).json({
            error: 'vocabulary object is required',
            code: 'MISSING_VOCABULARY_OBJECT',
            timestamp: new Date().toISOString()
          });
        }

        this.agent.importVocabulary(vocabulary);
        
        res.json({
          success: true,
          message: 'Vocabulary imported successfully',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // Add custom adjective
    this.app.post('/vocabulary/adjectives', (req, res) => {
      try {
        const { adjective, category, context } = req.body;
        
        if (!adjective || !category) {
          return res.status(400).json({
            error: 'adjective and category are required',
            code: 'MISSING_REQUIRED_FIELDS',
            timestamp: new Date().toISOString()
          });
        }

        this.agent.addCustomAdjective(adjective, category, context);
        
        res.json({
          success: true,
          message: 'Custom adjective added successfully',
          data: { adjective, category, context },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });
  }

  /**
   * Setup agent management routes
   */
  private setupAgentManagementRoutes(): void {
    // Get agent information
    this.app.get('/agent/info', (req, res) => {
      try {
        const stats = this.agent.getVocabularyStats();
        res.json({
          success: true,
          data: {
            name: this.agent.getAgentName(),
            version: this.agent.getVersion(),
            vocabulary: stats,
            capabilities: ['photo_analysis', 'adjective_generation', 'vocabulary_learning'],
            status: 'active'
          },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // Get agent capabilities
    this.app.get('/agent/capabilities', (req, res) => {
      try {
        res.json({
          success: true,
          data: {
            capabilities: [
              'photo_analysis',
              'adjective_generation',
              'vocabulary_learning',
              'batch_processing',
              'custom_adjectives',
              'vocabulary_export_import'
            ],
            supported_formats: ['jpeg', 'png', 'gif', 'webp'],
            max_batch_size: 100,
            rate_limits: {
              single_analysis: '10/minute',
              batch_analysis: '5/minute',
              vocabulary_operations: '50/minute'
            }
          },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });
  }

  /**
   * Setup learning and training routes
   */
  private setupLearningRoutes(): void {
    // Learn from text
    this.app.post('/learning/text', async (req, res) => {
      try {
        const { text, context } = req.body;
        
        if (!text) {
          return res.status(400).json({
            error: 'text is required',
            code: 'MISSING_TEXT',
            timestamp: new Date().toISOString()
          });
        }

        const learnedAdjectives = await this.agent.learnFromText(text, context || 'general');
        
        res.json({
          success: true,
          data: {
            learnedAdjectives,
            count: learnedAdjectives.length,
            context: context || 'general'
          },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // Learn from multiple texts
    this.app.post('/learning/text/batch', async (req, res) => {
      try {
        const { texts, context } = req.body;
        
        if (!texts || !Array.isArray(texts)) {
          return res.status(400).json({
            error: 'texts array is required',
            code: 'MISSING_TEXTS_ARRAY',
            timestamp: new Date().toISOString()
          });
        }

        const learnedAdjectives = await this.agent.learnFromTextBatch(texts, context || 'general');
        
        res.json({
          success: true,
          data: {
            learnedAdjectives,
            count: learnedAdjectives.length,
            textsProcessed: texts.length,
            context: context || 'general'
          },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });

    // Get learning statistics
    this.app.get('/learning/stats', (req, res) => {
      try {
        const stats = this.agent.getVocabularyStats();
        res.json({
          success: true,
          data: {
            totalAdjectives: stats.totalAdjectives,
            newAdjectivesLearned: stats.newAdjectivesLearned,
            categories: stats.categories,
            categoryBreakdown: stats.categoryBreakdown
          },
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        this.handleError(res, error);
      }
    });
  }

  /**
   * Setup error handling
   */
  private setupErrorHandling(): void {
    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Endpoint not found',
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
        requestId: res.get('X-Request-ID')
      });
    });

    // Global error handler
    this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Unhandled error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString(),
        requestId: res.get('X-Request-ID')
      });
    });
  }

  /**
   * Handle API errors
   */
  private handleError(res: express.Response, error: any): void {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    
    res.status(statusCode).json({
      error: message,
      code: error.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      requestId: res.get('X-Request-ID')
    });
  }

  /**
   * Get Express app
   */
  getApp(): express.Application {
    return this.app;
  }

  /**
   * Start the API server
   */
  async start(port: number = 3000): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(port, () => {
        console.log(`Adjective Agent API Server running on port ${port}`);
        console.log(`Health check: http://localhost:${port}/health`);
        console.log(`API documentation: http://localhost:${port}/info`);
        resolve();
      });
    });
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export { AdjectiveAgentApiServer };
