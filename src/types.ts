// Independent type definitions for Adjective Agent
// No direct dependencies on other repositories

export interface Photo {
  id: string;
  path: string;
  filename: string;
  size: number;
  mimeType: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface AdjectiveResult {
  photoId: string;
  adjectives: string[];
  confidence: number;
  processingTime: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AnalysisOptions {
  maxAdjectives?: number;
  confidenceThreshold?: number;
  includeMetadata?: boolean;
  processingTimeout?: number;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
  };
  cpu: {
    usage: number;
  };
}

export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: string;
  requestId?: string;
}