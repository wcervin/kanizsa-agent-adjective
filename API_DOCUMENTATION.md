# Kanizsa Adjective Agent API Documentation

**Version:** 10.0.1  
**Last Updated:** August 6, 2025  
**MCP Server Compatibility:** 100%  
**Gateway:** Kong API Gateway v3.4

## Overview

The Kanizsa Adjective Agent provides comprehensive API endpoints for photo analysis with infinite vocabulary learning capabilities. It is 100% compatible with the MCP server protocol and provides complete API coverage for photo analysis, vocabulary management, and learning features.

## Base URL

```
http://adjective-agent:3000
```

## MCP Server Compatibility

This agent implements the **exact protocol** expected by the MCP server:

- **Health Check**: `GET /health` - Returns agent status and capabilities
- **Info Endpoint**: `GET /info` - Returns agent metadata and capabilities
- **Analysis Endpoint**: `POST /analyze` - Analyzes single photo
- **Batch Analysis**: `POST /analyze/batch` - Analyzes multiple photos

## Response Headers

All responses include standard headers:

```
X-Request-ID: <correlation-id>
X-Kanizsa-Version: 10.1.0
```

## Error Handling

Standard error response format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-08-06T21:30:00Z",
  "requestId": "<correlation-id>"
}
```

---

## Health & Status Endpoints

### GET /health

**MCP Server Compatible** - Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-06T21:30:00Z",
  "version": "10.1.0",
  "agent": {
    "name": "AdjectiveAgent",
    "version": "10.1.0",
    "status": "active"
  },
  "vocabulary": {
    "totalAdjectives": 1250,
    "categories": 8,
    "newAdjectivesLearned": 45
  },
  "uptime": 3600,
  "memory": {
    "rss": 52428800,
    "heapTotal": 20971520,
    "heapUsed": 10485760
  }
}
```

### GET /status

Detailed system status and metrics.

**Response:**
```json
{
  "timestamp": "2025-08-06T21:30:00Z",
  "version": "10.1.0",
  "agent": {
    "name": "AdjectiveAgent",
    "version": "10.1.0",
    "status": "active"
  },
  "vocabulary": {
    "totalAdjectives": 1250,
    "categories": 8,
    "newAdjectivesLearned": 45,
    "categoryBreakdown": {
      "mood": 200,
      "visual": 180,
      "temporal": 150,
      "spatial": 120,
      "emotional": 100
    }
  },
  "performance": {
    "uptime": 3600,
    "memory": {
      "rss": 52428800,
      "heapTotal": 20971520,
      "heapUsed": 10485760
    },
    "cpu": {
      "user": 1500000,
      "system": 500000
    }
  }
}
```

### GET /info

**MCP Server Compatible** - Agent information endpoint.

**Response:**
```json
{
  "name": "Adjective Agent",
  "version": "10.1.0",
  "description": "Generates descriptive adjectives for photos with infinite vocabulary learning",
  "capabilities": [
    "photo_analysis",
    "adjective_generation",
    "vocabulary_learning"
  ],
  "author": "Kanizsa Team",
  "license": "MIT",
  "endpoints": {
    "health": "/health",
    "analyze": "/analyze",
    "analyze_batch": "/analyze/batch",
    "vocabulary": "/vocabulary",
    "learning": "/learning"
  }
}
```

### GET /version

Get version information.

**Response:**
```json
{
  "version": "10.1.0",
  "name": "kanizsa-adjective-agent",
  "description": "Kanizsa Adjective Agent with comprehensive API coverage",
  "timestamp": "2025-08-06T21:30:00Z"
}
```

---

## Photo Analysis Endpoints

### POST /analyze

**MCP Server Compatible** - Analyze a single photo.

**Rate Limit:** 10 requests per minute

**Request Body:**
```json
{
  "photoUrl": "https://example.com/photo.jpg",
  "options": {
    "maxAdjectives": 10,
    "includeCategories": true,
    "enhanceDescription": true,
    "learnFromInput": true,
    "expandVocabulary": true,
    "title": "Beautiful sunset",
    "description": "A stunning sunset over the mountains",
    "tags": ["sunset", "mountains", "nature"],
    "metadata": {
      "camera": "iPhone 15 Pro",
      "aperture": "f/1.8"
    }
  }
}
```

**Response:**
```json
{
  "photoId": "photo_1733520000000",
  "adjectives": ["breathtaking", "majestic", "serene", "dramatic", "golden"],
  "categories": {
    "mood": ["serene", "dramatic"],
    "visual": ["golden"],
    "emotional": ["breathtaking", "majestic"]
  },
  "confidence": 0.92,
  "processingTime": 125,
  "timestamp": "2025-08-06T21:30:00Z"
}
```

### POST /analyze/batch

**MCP Server Compatible** - Analyze multiple photos in batch.

**Rate Limit:** 5 requests per minute

**Request Body:**
```json
{
  "photos": [
    {
      "url": "https://example.com/photo1.jpg",
      "title": "Sunset",
      "description": "Beautiful sunset"
    },
    {
      "url": "https://example.com/photo2.jpg",
      "title": "Mountain",
      "description": "Majestic mountain"
    }
  ],
  "options": {
    "maxAdjectives": 5,
    "includeCategories": true
  }
}
```

**Response:**
```json
{
  "results": [
    {
      "photoId": "photo_1733520000000_0",
      "adjectives": ["breathtaking", "golden", "serene"],
      "categories": {
        "mood": ["serene"],
        "visual": ["golden"],
        "emotional": ["breathtaking"]
      },
      "confidence": 0.92,
      "timestamp": "2025-08-06T21:30:00Z"
    },
    {
      "photoId": "photo_1733520000000_1",
      "adjectives": ["majestic", "towering", "imposing"],
      "categories": {
        "spatial": ["towering"],
        "emotional": ["majestic", "imposing"]
      },
      "confidence": 0.88,
      "timestamp": "2025-08-06T21:30:01Z"
    }
  ],
  "totalProcessed": 2,
  "timestamp": "2025-08-06T21:30:01Z"
}
```

### POST /api/photos/analyze

Analyze photo with detailed options.

**Rate Limit:** 10 requests per minute

**Request Body:**
```json
{
  "photo": {
    "id": "photo_123",
    "url": "https://example.com/photo.jpg",
    "title": "Beautiful sunset",
    "description": "A stunning sunset over the mountains",
    "tags": ["sunset", "mountains", "nature"],
    "metadata": {
      "camera": "iPhone 15 Pro",
      "aperture": "f/1.8"
    }
  },
  "options": {
    "maxAdjectives": 10,
    "includeCategories": true,
    "enhanceDescription": true,
    "learnFromInput": true,
    "expandVocabulary": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "photoId": "photo_123",
    "adjectives": ["breathtaking", "majestic", "serene", "dramatic", "golden"],
    "categories": {
      "mood": ["serene", "dramatic"],
      "visual": ["golden"],
      "emotional": ["breathtaking", "majestic"]
    },
    "enhancedDescription": "A stunning sunset over the mountains. This breathtaking, majestic, serene image captures a unique moment.",
    "confidence": 0.92,
    "timestamp": "2025-08-06T21:30:00Z",
    "vocabularyStats": {
      "totalAdjectives": 1250,
      "categories": 8,
      "newAdjectivesLearned": 45
    }
  },
  "timestamp": "2025-08-06T21:30:00Z"
}
```

---

## Vocabulary Management Endpoints

### GET /vocabulary/stats

Get vocabulary statistics.

**Rate Limit:** 50 requests per minute

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAdjectives": 1250,
    "categories": 8,
    "newAdjectivesLearned": 45,
    "categoryBreakdown": {
      "mood": 200,
      "visual": 180,
      "temporal": 150,
      "spatial": 120,
      "emotional": 100,
      "custom": 50
    }
  },
  "timestamp": "2025-08-06T21:30:00Z"
}
```

### GET /vocabulary/categories

Get all available categories.

**Rate Limit:** 50 requests per minute

**Response:**
```json
{
  "success": true,
  "data": [
    "mood",
    "visual",
    "temporal",
    "spatial",
    "emotional",
    "custom"
  ],
  "timestamp": "2025-08-06T21:30:00Z"
}
```

### GET /vocabulary/categories/{category}

Get adjectives by category.

**Rate Limit:** 50 requests per minute

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "mood",
    "adjectives": [
      "serene",
      "vibrant",
      "melancholic",
      "energetic",
      "peaceful",
      "dramatic",
      "whimsical",
      "mysterious"
    ],
    "count": 8
  },
  "timestamp": "2025-08-06T21:30:00Z"
}
```

### GET /vocabulary/frequent

Get most frequent adjectives.

**Rate Limit:** 50 requests per minute

**Query Parameters:**
- `limit` (optional): Number of adjectives to return (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "adjective": "beautiful",
      "frequency": 150,
      "category": "visual"
    },
    {
      "adjective": "amazing",
      "frequency": 120,
      "category": "emotional"
    },
    {
      "adjective": "stunning",
      "frequency": 100,
      "category": "visual"
    }
  ],
  "timestamp": "2025-08-06T21:30:00Z"
}
```

### GET /vocabulary/export

Export vocabulary for persistence.

**Rate Limit:** 10 requests per minute

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": {
      "mood": ["serene", "vibrant", "melancholic"],
      "visual": ["luminous", "shadowy", "colorful"],
      "temporal": ["timeless", "nostalgic", "modern"],
      "spatial": ["expansive", "intimate", "vast"],
      "emotional": ["inspiring", "contemplative", "joyful"]
    },
    "learningData": {
      "serene": {
        "category": "mood",
        "context": "general",
        "frequency": 25,
        "confidence": 0.9,
        "lastUsed": "2025-08-06T21:30:00Z"
      }
    },
    "customCategories": ["custom"],
    "adjectiveFrequency": {
      "serene": 25,
      "vibrant": 20,
      "luminous": 18
    },
    "contextPatterns": {
      "nature": ["serene", "peaceful", "natural"],
      "urban": ["vibrant", "energetic", "modern"]
    }
  },
  "timestamp": "2025-08-06T21:30:00Z"
}
```

### POST /vocabulary/import

Import vocabulary from external source.

**Rate Limit:** 10 requests per minute

**Request Body:**
```json
{
  "vocabulary": {
    "categories": {
      "mood": ["serene", "vibrant"],
      "visual": ["luminous", "shadowy"]
    },
    "learningData": {
      "serene": {
        "category": "mood",
        "context": "general",
        "frequency": 25,
        "confidence": 0.9,
        "lastUsed": "2025-08-06T21:30:00Z"
      }
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vocabulary imported successfully",
  "timestamp": "2025-08-06T21:30:00Z"
}
```

### POST /vocabulary/adjectives

Add custom adjective to vocabulary.

**Rate Limit:** 50 requests per minute

**Request Body:**
```json
{
  "adjective": "ethereal",
  "category": "mood",
  "context": "custom"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Custom adjective added successfully",
  "data": {
    "adjective": "ethereal",
    "category": "mood",
    "context": "custom"
  },
  "timestamp": "2025-08-06T21:30:00Z"
}
```

---

## Agent Management Endpoints

### GET /agent/info

Get agent information.

**Rate Limit:** 30 requests per minute

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "AdjectiveAgent",
    "version": "10.1.0",
    "vocabulary": {
      "totalAdjectives": 1250,
      "categories": 8,
      "newAdjectivesLearned": 45
    },
    "capabilities": [
      "photo_analysis",
      "adjective_generation",
      "vocabulary_learning"
    ],
    "status": "active"
  },
  "timestamp": "2025-08-06T21:30:00Z"
}
```

### GET /agent/capabilities

Get agent capabilities.

**Rate Limit:** 30 requests per minute

**Response:**
```json
{
  "success": true,
  "data": {
    "capabilities": [
      "photo_analysis",
      "adjective_generation",
      "vocabulary_learning",
      "batch_processing",
      "custom_adjectives",
      "vocabulary_export_import"
    ],
    "supported_formats": ["jpeg", "png", "gif", "webp"],
    "max_batch_size": 100,
    "rate_limits": {
      "single_analysis": "10/minute",
      "batch_analysis": "5/minute",
      "vocabulary_operations": "50/minute"
    }
  },
  "timestamp": "2025-08-06T21:30:00Z"
}
```

---

## Learning and Training Endpoints

### POST /learning/text

Learn from text to expand vocabulary.

**Rate Limit:** 20 requests per minute

**Request Body:**
```json
{
  "text": "The breathtaking sunset painted the sky with golden hues, creating a serene and peaceful atmosphere.",
  "context": "nature"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "learnedAdjectives": ["breathtaking", "golden", "serene", "peaceful"],
    "count": 4,
    "context": "nature"
  },
  "timestamp": "2025-08-06T21:30:00Z"
}
```

### POST /learning/text/batch

Learn from multiple texts.

**Rate Limit:** 10 requests per minute

**Request Body:**
```json
{
  "texts": [
    "The majestic mountains stood tall against the sky.",
    "The vibrant city lights illuminated the night.",
    "The timeless beauty of the ancient ruins."
  ],
  "context": "landscape"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "learnedAdjectives": ["majestic", "vibrant", "timeless", "ancient"],
    "count": 4,
    "textsProcessed": 3,
    "context": "landscape"
  },
  "timestamp": "2025-08-06T21:30:00Z"
}
```

### GET /learning/stats

Get learning statistics.

**Rate Limit:** 30 requests per minute

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAdjectives": 1250,
    "newAdjectivesLearned": 45,
    "categories": 8,
    "categoryBreakdown": {
      "mood": 200,
      "visual": 180,
      "temporal": 150,
      "spatial": 120,
      "emotional": 100,
      "custom": 50
    }
  },
  "timestamp": "2025-08-06T21:30:00Z"
}
```

---

## MCP Server Protocol Compatibility

### Agent Communication Protocol

The Adjective Agent implements the **exact protocol** expected by the MCP server:

#### Health Check Endpoint
```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "version": "10.1.0",
  "capabilities": ["photo_analysis", "adjective_generation", "vocabulary_learning"],
  "uptime": 3600
}
```

#### Analysis Endpoint
```
POST /analyze
```

**Request Body:**
```json
{
  "photoUrl": "https://example.com/photo.jpg",
  "options": {
    "maxAdjectives": 10,
    "includeCategories": true
  }
}
```

**Response:**
```json
{
  "photoId": "photo_1733520000000",
  "adjectives": ["breathtaking", "majestic", "serene"],
  "categories": {
    "mood": ["serene"],
    "emotional": ["breathtaking", "majestic"]
  },
  "confidence": 0.92,
  "processingTime": 125,
  "timestamp": "2025-08-06T21:30:00Z"
}
```

#### Info Endpoint
```
GET /info
```

**Response:**
```json
{
  "name": "Adjective Agent",
  "version": "10.1.0",
  "description": "Generates descriptive adjectives for photos with infinite vocabulary learning",
  "capabilities": ["photo_analysis", "adjective_generation", "vocabulary_learning"],
  "author": "Kanizsa Team",
  "license": "MIT"
}
```

---

## Rate Limiting

All endpoints have configurable rate limits:

- **Health/Status:** No limits
- **Photo Analysis:** 10/minute (single), 5/minute (batch)
- **Vocabulary Management:** 50/minute
- **Agent Management:** 30/minute
- **Learning:** 20/minute (single), 10/minute (batch)

## Error Codes

| Code | Description |
|------|-------------|
| `MISSING_PHOTO_URL` | Photo URL is required |
| `MISSING_PHOTOS_ARRAY` | Photos array is required |
| `MISSING_PHOTO_OBJECT` | Photo object is required |
| `MISSING_VOCABULARY_OBJECT` | Vocabulary object is required |
| `MISSING_REQUIRED_FIELDS` | Required fields are missing |
| `MISSING_TEXT` | Text is required for learning |
| `MISSING_TEXTS_ARRAY` | Texts array is required |
| `RATE_LIMIT_EXCEEDED` | Rate limit exceeded |
| `INTERNAL_ERROR` | Internal server error |

## SDK Examples

### JavaScript

```javascript
// Analyze photo
const response = await fetch('http://adjective-agent:3000/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    photoUrl: 'https://example.com/photo.jpg',
    options: {
      maxAdjectives: 10,
      includeCategories: true
    }
  })
});

const result = await response.json();
console.log(result);
```

### Python

```python
import requests

# Analyze photo
response = requests.post(
    'http://adjective-agent:3000/analyze',
    headers={'Content-Type': 'application/json'},
    json={
        'photoUrl': 'https://example.com/photo.jpg',
        'options': {
            'maxAdjectives': 10,
            'includeCategories': True
        }
    }
)

result = response.json()
print(result)
```

### MCP Server Integration

```javascript
// MCP Server calling Adjective Agent
const agentResponse = await fetch('http://adjective-agent:3000/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    photoUrl: validatedArgs.photo.url,
    options: validatedArgs.options
  })
});

if (agentResponse.ok) {
  const result = await agentResponse.json();
  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
  };
}
```

---

## Infinite Vocabulary Learning

### Learning Features

The Adjective Agent features **infinite vocabulary learning**:

1. **Text Learning**: Learn new adjectives from text input
2. **Context Awareness**: Understand context for better adjective selection
3. **Frequency Tracking**: Track adjective usage frequency
4. **Custom Adjectives**: Add custom adjectives to vocabulary
5. **Category Management**: Organize adjectives by categories
6. **Export/Import**: Persist vocabulary across sessions

### Learning Process

1. **Input Processing**: Analyze text for potential adjectives
2. **Context Extraction**: Identify context and category
3. **Frequency Update**: Update usage frequency
4. **Confidence Scoring**: Calculate confidence for new adjectives
5. **Vocabulary Expansion**: Add new adjectives to vocabulary
6. **Category Assignment**: Assign appropriate categories

### Vocabulary Categories

- **Mood**: Emotional atmosphere (serene, vibrant, melancholic)
- **Visual**: Visual characteristics (luminous, shadowy, colorful)
- **Temporal**: Time-related qualities (timeless, nostalgic, modern)
- **Spatial**: Spatial characteristics (expansive, intimate, vast)
- **Emotional**: Emotional impact (inspiring, contemplative, joyful)
- **Custom**: User-defined categories

---

## Support

For API support and questions:

- **Documentation:** https://docs.kanizsa.app/adjective-agent
- **Support:** support@kanizsa.app
- **Status Page:** https://status.kanizsa.app
- **GitHub Issues:** https://github.com/wcervin/kanizsa-agent-adjective/issues
