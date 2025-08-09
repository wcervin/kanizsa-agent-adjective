# Kanizsa Adjective Agent

**VERSION:** 11.0.0 - MCP Server Compatibility & Comprehensive API Coverage  
**LAST UPDATED:** August 09, 2025, 11:14:17 CDT

## 🎯 **Agent Overview**

The **Kanizsa Adjective Agent** is a TypeScript library that generates descriptive adjectives for photos with **infinite vocabulary expansion**. It analyzes photo metadata, titles, descriptions, and tags to produce relevant adjectives categorized by mood, visual characteristics, temporal aspects, spatial qualities, and emotional impact. The agent continuously learns and expands its vocabulary from input data, making it increasingly sophisticated over time.

### **🏗️ Architecture**

- **🔗 Independent Repository**: Self-contained with no direct dependencies on other repositories
- **🐳 Containerized**: Zero host dependencies - runs entirely in Docker containers
- **🌐 HTTP API**: Primary interface via RESTful HTTP API
- **🔒 Type-Safe**: Comprehensive TypeScript types and validation
- **🧪 Testable**: Comprehensive test coverage with Jest
- **📊 Observable**: Built-in confidence scoring and processing metrics
- **🧠 Learning**: Continuously expands vocabulary from input data
- **♾️ Infinite**: Vocabulary grows infinitely through learning and pattern recognition

## 🚀 **Quick Start**

### **Installation**
```bash
# Containerized installation (zero host dependencies)
docker pull kanizsa/adjective-agent:latest

# Or build from source
git clone https://github.com/wcervin/kanizsa-agent-adjective.git
cd kanizsa-agent-adjective
docker build -t kanizsa/adjective-agent .
```

### **Basic Usage**
```bash
# Run the agent container
docker run -d --name kanizsa-adjective-agent \
  -p 3001:3001 \
  kanizsa/adjective-agent:latest

# Use via HTTP API
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "photo": {
      "id": "photo-123",
      "path": "/photos/sunset.jpg",
      "filename": "sunset.jpg",
      "size": 2048576,
      "mimeType": "image/jpeg",
      "createdAt": "2025-08-05T14:25:00Z",
      "title": "Golden Sunset",
      "description": "A beautiful sunset over the mountains",
      "tags": ["nature", "landscape", "golden"]
    },
    "options": {
      "maxAdjectives": 10,
      "includeCategories": true,
      "enhanceDescription": true
    }
  }'
```

### **Docker Compose Integration**
```yaml
# Add to your docker-compose.yml
adjective-agent:
  image: kanizsa/adjective-agent:latest
  container_name: kanizsa-adjective-agent
  ports:
    - "3001:3001"
  environment:
    - NODE_ENV=production
  restart: unless-stopped
  networks:
    - kanizsa-network
```

## 📋 **API Reference**

### **Core Methods**

#### `analyzePhoto(photo, options)`
Analyzes a single photo and generates descriptive adjectives.

**Parameters:**
- `photo: Photo` - Photo object with metadata
- `options: AnalysisOptions` - Analysis configuration options

**Returns:** `Promise<AdjectiveResult>`

#### `analyzePhotoBatch(photos, options)`
Analyzes multiple photos in batch for improved efficiency.

**Parameters:**
- `photos: Photo[]` - Array of photo objects
- `options: AnalysisOptions` - Analysis configuration options

**Returns:** `Promise<AdjectiveResult[]>`

#### `learnFromText(text, context)`
Learns new adjectives from text input to expand vocabulary.

**Parameters:**
- `text: string` - Text to extract adjectives from
- `context: string` - Context for learning (e.g., 'description', 'title', 'tag')

**Returns:** `Promise<string[]>` - Array of learned adjectives

#### `learnFromTextBatch(texts, context)`
Learns new adjectives from multiple text sources.

**Parameters:**
- `texts: string[]` - Array of text sources
- `context: string` - Context for learning

**Returns:** `Promise<string[]>` - Array of learned adjectives

#### `addCustomAdjective(adjective, category, context)`
Adds a custom adjective to the vocabulary.

**Parameters:**
- `adjective: string` - The adjective to add
- `category: string` - Category for the adjective
- `context: string` - Context for the adjective

#### `getVocabularyStats()`
Gets statistics about the current vocabulary.

**Returns:** `VocabularyStats` - Vocabulary statistics

#### `getAllCategories()`
Gets all available adjective categories.

**Returns:** `string[]` - Array of category names

#### `getAdjectivesByCategory(category)`
Gets adjectives in a specific category.

**Parameters:**
- `category: string` - Category name

**Returns:** `string[]` - Array of adjectives in the category

#### `getMostFrequentAdjectives(limit)`
Gets the most frequently used adjectives.

**Parameters:**
- `limit: number` - Maximum number of adjectives to return

**Returns:** `Array<{adjective: string, frequency: number}>` - Most frequent adjectives

#### `exportVocabulary()`
Exports the current vocabulary for persistence.

**Returns:** `VocabularyManager` - Complete vocabulary data

#### `importVocabulary(vocabulary)`
Imports vocabulary from external source.

**Parameters:**
- `vocabulary: VocabularyManager` - Vocabulary data to import

### **Types**

#### `Photo`
```typescript
interface Photo {
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
```

#### `AdjectiveResult`
```typescript
interface AdjectiveResult {
  photoId: string;
  adjectives: string[];
  categories: Record<string, string[]>;
  enhancedDescription: string;
  confidence: number;
  timestamp: string;
}
```

#### `AnalysisOptions`
```typescript
interface AnalysisOptions {
  maxAdjectives?: number;        // Default: 10
  includeCategories?: boolean;   // Default: true
  enhanceDescription?: boolean;  // Default: true
  learnFromInput?: boolean;      // Default: true - learn new adjectives from input
  expandVocabulary?: boolean;    // Default: true - use expanded vocabulary
}
```

#### `VocabularyStats`
```typescript
interface VocabularyStats {
  totalAdjectives: number;
  categories: number;
  newAdjectivesLearned: number;
  categoryBreakdown: Record<string, number>;
}
```

## 🎨 **Adjective Categories**

The agent generates adjectives across multiple categories, with the ability to create new categories dynamically:

### **Core Categories**
- **Mood**: `serene`, `vibrant`, `melancholic`, `energetic`, `peaceful`, `dramatic`, `whimsical`, `mysterious`
- **Visual**: `luminous`, `shadowy`, `colorful`, `monochromatic`, `textured`, `smooth`, `geometric`, `organic`
- **Temporal**: `timeless`, `nostalgic`, `modern`, `vintage`, `ephemeral`, `eternal`, `fleeting`, `enduring`
- **Spatial**: `expansive`, `intimate`, `vast`, `confined`, `open`, `layered`, `minimal`, `dense`
- **Emotional**: `inspiring`, `contemplative`, `joyful`, `somber`, `hopeful`, `introspective`, `uplifting`, `profound`

### **Dynamic Categories**
The agent automatically creates new categories as it learns:
- **Descriptive**: Adjectives learned from descriptions
- **Categorized**: Adjectives learned from tags
- **Custom**: User-defined categories
- **Context-specific**: Categories based on usage patterns

## 📊 **Confidence Scoring**

The agent calculates confidence scores based on:
- **Photo Title**: +0.1 confidence
- **Photo Description**: +0.2 confidence  
- **Photo Tags**: +0.1 confidence
- **Photo Metadata**: +0.1 confidence

Base confidence starts at 0.5, with a maximum of 1.0.

## 🔄 **Integration Examples**

### **With Kanizsa Platform**
```typescript
import { AdjectiveAgent } from 'kanizsa-adjective-agent';

const agent = new AdjectiveAgent();

// Learn from existing photo descriptions to expand vocabulary
const existingDescriptions = await getExistingPhotoDescriptions();
await agent.learnFromTextBatch(existingDescriptions, 'description');

// Process photos from the main platform
const photos = await getPhotosFromPlatform();
const results = await agent.analyzePhotoBatch(photos, {
  maxAdjectives: 8,
  includeCategories: true,
  enhanceDescription: true,
  learnFromInput: true,      // Learn from new photos
  expandVocabulary: true     // Use expanded vocabulary
});

// Store results back to platform
await storeAdjectiveResults(results);

// Export vocabulary for persistence
const vocabulary = agent.exportVocabulary();
await saveVocabularyToDatabase(vocabulary);
```

### **Batch Processing**
```typescript
const photos = [
  {
    id: 'photo-1',
    path: '/photos/sunset.jpg',
    filename: 'sunset.jpg',
    size: 2048576,
    mimeType: 'image/jpeg',
    createdAt: '2025-08-05T14:25:00Z',
    title: 'Golden Sunset',
    description: 'A beautiful sunset over the mountains'
  },
  {
    id: 'photo-2',
    path: '/photos/forest.jpg',
    filename: 'forest.jpg',
    size: 1536000,
    mimeType: 'image/jpeg',
    createdAt: '2025-08-05T15:30:00Z',
    title: 'Misty Forest',
    description: 'A mysterious forest shrouded in mist'
  }
];

const results = await agent.analyzePhotoBatch(photos);
console.log(results[0].adjectives); // ['golden', 'beautiful', 'warm', ...]
console.log(results[1].adjectives); // ['mysterious', 'misty', 'shadowy', ...]
```

### **Custom Analysis Options**
```typescript
const result = await agent.analyzePhoto(photo, {
  maxAdjectives: 5,           // Limit to 5 adjectives
  includeCategories: false,   // Don't include category breakdown
  enhanceDescription: true,   // Generate enhanced description
  learnFromInput: true,       // Learn new adjectives from this photo
  expandVocabulary: true      // Use expanded vocabulary
});

console.log(result.adjectives);        // Array of 5 adjectives
console.log(result.categories);        // Empty object
console.log(result.enhancedDescription); // Enhanced description
console.log(result.vocabularyStats);   // Vocabulary statistics
```

### **Vocabulary Learning**
```typescript
// Learn from text sources
const learned = await agent.learnFromText(
  'This is a magnificent, extraordinary, and phenomenal photograph',
  'description'
);
console.log('Learned adjectives:', learned); // ['magnificent', 'extraordinary', 'phenomenal']

// Learn from multiple sources
const texts = [
  'Beautiful, stunning, amazing',
  'Colorful, vibrant, bright',
  'Peaceful, serene, calm'
];
const batchLearned = await agent.learnFromTextBatch(texts, 'description');

// Add custom adjectives
agent.addCustomAdjective('custom-adjective', 'custom-category', 'user-defined');

// Get vocabulary statistics
const stats = agent.getVocabularyStats();
console.log('Total adjectives:', stats.totalAdjectives);
console.log('Categories:', stats.categories);
console.log('Newly learned:', stats.newAdjectivesLearned);
```

## 🧪 **Testing**

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### **Test Examples**
```typescript
import { AdjectiveAgent } from '../src/agent.js';

describe('AdjectiveAgent', () => {
  let agent: AdjectiveAgent;

  beforeEach(() => {
    agent = new AdjectiveAgent();
  });

  it('should generate adjectives for a photo', async () => {
    const photo = {
      id: 'test-1',
      path: '/test/sunset.jpg',
      filename: 'sunset.jpg',
      size: 1024000,
      mimeType: 'image/jpeg',
      createdAt: '2025-08-05T14:25:00Z',
      title: 'Golden Sunset',
      description: 'A beautiful sunset'
    };

    const result = await agent.analyzePhoto(photo);

    expect(result.photoId).toBe('test-1');
    expect(result.adjectives).toContain('golden');
    expect(result.adjectives).toContain('beautiful');
    expect(result.confidence).toBeGreaterThan(0.5);
  });
});
```

## 📦 **Development**

### **Setup**
```bash
# Clone repository
git clone https://github.com/wcervin/kanizsa-agent-adjective.git
cd kanizsa-agent-adjective

# Install dependencies
npm install

# Build the project
npm run build
```

### **Development Commands**
```bash
# Build TypeScript
npm run build

# Start API server in development mode
npm run dev

# Start API server in production mode
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### **API Server Development**
```bash
# Start the API server
npm run dev

# The server will be available at:
# - Health check: http://localhost:3000/health
# - API info: http://localhost:3000/info
# - Documentation: http://localhost:3000/version
```

## 🏗️ **Repository Independence**

This repository is **completely independent** and:

- ✅ **No direct dependencies** on other repositories
- ✅ **TypeScript library interface** for easy integration
- ✅ **Self-contained deployment** with Docker
- ✅ **Independent versioning** and release management
- ✅ **Separate CI/CD pipeline** support
- ✅ **Independent testing** and validation

## 📦 **Deployment**

### **Docker**
```bash
# Build image
docker build -t kanizsa-adjective-agent .

# Run container
docker run kanizsa-adjective-agent
```

### **Docker Compose**
```yaml
adjective-agent:
  build: ./kanizsa-agent-adjective
  environment:
    - NODE_ENV=production
  restart: unless-stopped
```

## 🌐 **Comprehensive API Coverage**

The Adjective Agent provides **100% API coverage** with complete MCP server compatibility:

### **API Endpoints (Port 3000)**

#### **Health & Status**
- `GET /health` - Health check (MCP Server compatible)
- `GET /status` - Detailed system status
- `GET /info` - Agent information (MCP Server compatible)
- `GET /version` - Version information

#### **Photo Analysis**
- `POST /analyze` - Analyze single photo (MCP Server compatible)
- `POST /analyze/batch` - Analyze multiple photos (MCP Server compatible)
- `POST /api/photos/analyze` - Analyze with detailed options

#### **Vocabulary Management**
- `GET /vocabulary/stats` - Get vocabulary statistics
- `GET /vocabulary/categories` - Get all categories
- `GET /vocabulary/categories/{category}` - Get adjectives by category
- `GET /vocabulary/frequent` - Get most frequent adjectives
- `GET /vocabulary/export` - Export vocabulary
- `POST /vocabulary/import` - Import vocabulary
- `POST /vocabulary/adjectives` - Add custom adjective

#### **Agent Management**
- `GET /agent/info` - Get agent information
- `GET /agent/capabilities` - Get agent capabilities

#### **Learning & Training**
- `POST /learning/text` - Learn from text
- `POST /learning/text/batch` - Learn from multiple texts
- `GET /learning/stats` - Get learning statistics

### **MCP Server Compatibility**

The agent implements the **exact protocol** expected by the MCP server:

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

### **API Documentation**

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for comprehensive endpoint documentation with examples, rate limits, and error codes.

## 🔄 **Platform Integration**

The Adjective Agent integrates seamlessly with the Kanizsa platform:

1. **Receives photo data** from the main platform
2. **Analyzes photos** to generate descriptive adjectives
3. **Returns structured results** with confidence scores and categories
4. **Provides enhanced descriptions** for better photo understanding

### **Analysis Capabilities**
- **Smart Adjective Generation**: Context-aware adjective selection
- **Category Classification**: Organizes adjectives by type and impact
- **Confidence Scoring**: Provides reliability metrics for results
- **Batch Processing**: Efficiently analyzes multiple photos
- **Enhanced Descriptions**: Creates improved photo descriptions
- **Infinite Vocabulary Expansion**: Continuously learns and grows vocabulary
- **Pattern Recognition**: Identifies and learns from usage patterns
- **Frequency Tracking**: Tracks and prioritizes frequently used adjectives
- **Context Learning**: Learns context-specific adjective usage
- **Dynamic Categories**: Creates new categories as needed

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 **License**

MIT License - see LICENSE file for details.

---

**Repository:** Independent Adjective Agent  
**Interface:** TypeScript Library  
**Deployment:** Containerized  
**Dependencies:** None on other repositories  
**Platform Integration:** Kanizsa Photo Management Ecosystem
