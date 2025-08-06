# Kanizsa Adjective Agent

**VERSION:** 7.0.0 - Complete Separation of Concerns  
**LAST UPDATED:** August 5, 2025, 14:25:00 CDT

## 🎯 **Independent Adjective Agent Repository**

This repository contains the **Kanizsa Adjective Agent** - a standalone microservice that generates descriptive adjectives for photo analysis. It operates independently and communicates via HTTP APIs as part of the Kanizsa platform ecosystem.

### **🏗️ Architecture Principles**

- **🔗 Independent Repository**: Self-contained with no direct dependencies on other repositories
- **🌐 HTTP API**: Exposes RESTful API for photo analysis
- **📦 Containerized**: Runs as a Docker container with zero host dependencies
- **🔒 Secure**: Input validation and rate limiting
- **📊 Observable**: Health checks and metrics

## 🏗️ **Platform Integration**

This Adjective Agent is part of the **Kanizsa Platform** - a professional photo management ecosystem consisting of three independent repositories:

### **Related Repositories**
- **Kanizsa Photo Categorizer**: Core platform and API gateway
  - Repository: `kanizsa-photo-categorizer`
  - URL: https://github.com/wcervin/kanizsa-photo-categorizer
- **Kanizsa MCP Server**: AI integration and orchestration
  - Repository: `kanizsa-mcp-server`
  - URL: https://github.com/wcervin/kanizsa-mcp-server

### **Communication Flow**
```
┌─────────────────┐    HTTP    ┌─────────────────┐    HTTP    ┌─────────────────┐
│  Kanizsa Platform│ ────────── │  MCP Server     │ ────────── │  Adjective Agent│
└─────────────────┘            └─────────────────┘            └─────────────────┘
```

## 🚀 **Quick Start**

### **Prerequisites**
- Docker and Docker Compose
- Node.js 18+ (for development)

### **Start the Adjective Agent**
```bash
# Build and start
docker-compose up adjective-agent

# Or build manually
docker build -t kanizsa-adjective-agent .
docker run -p 3000:3000 kanizsa-adjective-agent
```

### **Configuration**
```bash
# Environment variables
export ADJECTIVE_AGENT_PORT=3000
export MAX_CONCURRENT_REQUESTS=10
export ANALYSIS_TIMEOUT=30000
```

## 🔌 **Communication Patterns**

### **1. HTTP API Interface**
```typescript
// Adjective Agent exposes HTTP API
POST /analyze
{
  "photoUrl": "https://example.com/photo.jpg",
  "options": {
    "maxAdjectives": 10,
    "includeCategories": true,
    "enhanceDescription": true
  }
}

// Response
{
  "success": true,
  "data": {
    "photoId": "photo_123",
    "adjectives": ["beautiful", "colorful", "dramatic"],
    "categories": {
      "style": ["modern", "artistic"],
      "mood": ["dramatic", "peaceful"]
    },
    "enhancedDescription": "A beautiful and colorful photo...",
    "confidence": 0.85,
    "processingTime": 1500
  }
}
```

### **2. Health Check**
```bash
curl http://localhost:3000/health
# Response: {"status": "healthy", "timestamp": "2025-08-05T14:25:00Z"}
```

### **3. Metrics**
```bash
curl http://localhost:3000/metrics
# Response: Prometheus-formatted metrics
```

## 📋 **API Endpoints**

### **Core Endpoints**
- `POST /analyze`: Analyze a single photo
- `POST /analyze/batch`: Analyze multiple photos
- `GET /health`: Health check
- `GET /metrics`: System metrics
- `GET /version`: Version information

### **Management Endpoints**
- `GET /status`: Agent status and configuration
- `POST /reload`: Reload configuration (if supported)
- `DELETE /cache`: Clear internal cache

## 🔧 **Development**

### **Build**
```bash
npm install
npm run build
```

### **Test**
```bash
npm test
```

### **Development Mode**
```bash
npm run dev
```

## 📊 **Monitoring**

### **Health Check**
```bash
curl http://localhost:3000/health
```

### **Metrics**
```bash
curl http://localhost:3000/metrics
```

### **Logs**
```bash
docker logs kanizsa-adjective-agent
```

## 🔒 **Security**

- **Input Validation**: Comprehensive Zod schema validation
- **Rate Limiting**: Built-in request rate limiting
- **Error Handling**: Secure error responses
- **Request Logging**: Audit trail for all requests

## 📚 **API Documentation**

### **Analyze Photo**
```http
POST /analyze
Content-Type: application/json

{
  "photoUrl": "https://example.com/photo.jpg",
  "options": {
    "maxAdjectives": 10,
    "includeCategories": true,
    "enhanceDescription": true,
    "confidence": 0.8,
    "timeout": 30000
  }
}
```

### **Batch Analysis**
```http
POST /analyze/batch
Content-Type: application/json

{
  "photos": [
    {
      "id": "photo_1",
      "url": "https://example.com/photo1.jpg"
    },
    {
      "id": "photo_2", 
      "url": "https://example.com/photo2.jpg"
    }
  ],
  "options": {
    "maxAdjectives": 5,
    "includeCategories": true
  }
}
```

## 🏗️ **Repository Independence**

This repository is **completely independent** and:

- ✅ **No direct dependencies** on other repositories
- ✅ **HTTP API interface** for external communication
- ✅ **Self-contained deployment** with Docker
- ✅ **Independent versioning** and release management
- ✅ **Separate CI/CD pipeline** support
- ✅ **Independent testing** and validation

## 📦 **Deployment**

### **Docker Compose**
```yaml
adjective-agent:
  build: ./agents/adjective-agent
  ports:
    - "3000:3000"
  environment:
    - ADJECTIVE_AGENT_PORT=3000
    - MAX_CONCURRENT_REQUESTS=10
  restart: unless-stopped
```

### **Kubernetes**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kanizsa-adjective-agent
spec:
  replicas: 3
  selector:
    matchLabels:
      app: kanizsa-adjective-agent
  template:
    metadata:
      labels:
        app: kanizsa-adjective-agent
    spec:
      containers:
      - name: adjective-agent
        image: kanizsa-adjective-agent:7.0.0
        ports:
        - containerPort: 3000
```

## 🔄 **Integration Examples**

### **MCP Server Integration**
```typescript
// MCP Server calls Adjective Agent via HTTP
const response = await fetch('http://adjective-agent:3000/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    photoUrl: photoUrl,
    options: analysisOptions
  })
});
```

### **Direct API Usage**
```bash
# Direct API call
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "photoUrl": "https://example.com/photo.jpg",
    "options": {
      "maxAdjectives": 10,
      "includeCategories": true
    }
  }'
```

## 🔄 **Integration with Kanizsa Platform**

### **Platform Communication**
The Adjective Agent integrates seamlessly with the Kanizsa platform:

1. **Receives requests** from the MCP Server or directly from the platform
2. **Analyzes photos** using AI to generate descriptive adjectives
3. **Returns results** with confidence scores and processing metadata
4. **Provides monitoring** and health information

### **Analysis Capabilities**
The Adjective Agent specializes in:
- **Photo Description**: Generating descriptive adjectives for photos
- **Category Classification**: Organizing photos by style, mood, and content
- **Confidence Scoring**: Providing reliability metrics for analysis results
- **Batch Processing**: Efficiently analyzing multiple photos

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

MIT License - see LICENSE file for details.

---

**Repository:** Independent Adjective Agent  
**Communication:** HTTP API only  
**Deployment:** Containerized  
**Dependencies:** None on other repositories  
**Platform Integration:** Kanizsa Photo Management Ecosystem