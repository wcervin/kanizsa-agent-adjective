# Kanizsa Agent Template

**VERSION:** 10.2.2 - Agent Template  
**LAST UPDATED:** August 5, 2025, 14:25:00 CDT

## 🎯 **Kanizsa Agent Template**

This template provides the standard structure and documentation format for all Kanizsa agents. Use this as a foundation when creating new agents in the Kanizsa platform ecosystem.

### **🏗️ Agent Architecture Principles**

- **🔗 Independent Repository**: Self-contained with no direct dependencies on other repositories
- **📦 Library-First**: Primary interface is a TypeScript library, not HTTP API
- **🔒 Type-Safe**: Comprehensive TypeScript types and Zod validation
- **📊 Observable**: Built-in logging and metrics capabilities
- **🧪 Testable**: Comprehensive test coverage with Jest

## 📁 **Standard Repository Structure**

```
kanizsa-agent-[name]/
├── src/
│   ├── index.ts          # Main exports
│   ├── agent.ts          # Core agent logic
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions (optional)
├── tests/
│   ├── agent.test.ts     # Unit tests
│   └── integration.test.ts # Integration tests (optional)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── Dockerfile            # Containerization
├── README.md             # Agent-specific documentation
├── AGENT_TEMPLATE.md     # This template (copy for new agents)
├── ZERO_DEPENDENCIES.md  # Zero dependencies documentation
├── verify_zero_dependencies.sh # Zero dependencies verification
├── VERSION               # Version file
├── update_version.sh     # Version update script
├── commit_and_push.sh    # Git operations script
└── .gitignore           # Git ignore rules
```

## 🚀 **Quick Start Template**

### **1. Package.json Template**
```json
{
  "name": "kanizsa-[agent-name]-agent",
  "version": "10.2.2",
  "description": "Kanizsa [agent-name] agent for [specific functionality]",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "dev": "tsx src/index.ts",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "dependencies": {
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/jest": "^29.5.11",
    "jest": "^29.7.0",
    "tsx": "^4.6.2",
    "typescript": "^5.3.2"
  }
}
```

### **2. TypeScript Configuration (tsconfig.json)**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### **3. Core Agent Class Template (src/agent.ts)**
```typescript
import { InputType, OutputType, AgentOptions } from './types.js';

export class [AgentName]Agent {
  private readonly version = '8.0.0';
  private readonly agentName = '[AgentName]';

  constructor(options: AgentOptions = {}) {
    // Initialize agent with options
  }

  async process(input: InputType, options: AgentOptions = {}): Promise<OutputType> {
    const startTime = Date.now();
    
    try {
      // Core processing logic here
      const result = await this.performAnalysis(input, options);
      
      return {
        ...result,
        processingTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        agent: this.agentName,
        version: this.version
      };
    } catch (error) {
      throw new Error(`[AgentName] processing failed: ${error.message}`);
    }
  }

  async processBatch(inputs: InputType[], options: AgentOptions = {}): Promise<OutputType[]> {
    return Promise.all(inputs.map(input => this.process(input, options)));
  }

  private async performAnalysis(input: InputType, options: AgentOptions): Promise<Partial<OutputType>> {
    // Implement core analysis logic
    throw new Error('Analysis logic not implemented');
  }

  getVersion(): string {
    return this.version;
  }

  getAgentName(): string {
    return this.agentName;
  }
}
```

### **4. Type Definitions Template (src/types.ts)**
```typescript
// Independent type definitions for [AgentName] Agent
// No direct dependencies on other repositories

export interface InputType {
  id: string;
  data: any;
  metadata?: Record<string, any>;
}

export interface OutputType {
  id: string;
  result: any;
  confidence: number;
  processingTime: number;
  timestamp: string;
  agent: string;
  version: string;
  metadata?: Record<string, any>;
}

export interface AgentOptions {
  confidenceThreshold?: number;
  includeMetadata?: boolean;
  processingTimeout?: number;
  // Add agent-specific options here
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
```

### **5. Main Exports Template (src/index.ts)**
```typescript
export { [AgentName]Agent } from './agent.js';
export type { InputType, OutputType, AgentOptions } from './types.js';
```

## 🧪 **Testing Template**

### **Unit Test Template (tests/agent.test.ts)**
```typescript
import { [AgentName]Agent } from '../src/agent.js';
import type { InputType, OutputType } from '../src/types.js';

describe('[AgentName]Agent', () => {
  let agent: [AgentName]Agent;

  beforeEach(() => {
    agent = new [AgentName]Agent();
  });

  describe('process', () => {
    it('should process input correctly', async () => {
      const input: InputType = {
        id: 'test-1',
        data: { /* test data */ }
      };

      const result = await agent.process(input);

      expect(result).toMatchObject({
        id: 'test-1',
        confidence: expect.any(Number),
        processingTime: expect.any(Number),
        timestamp: expect.any(String),
        agent: '[AgentName]',
        version: '7.0.1'
      });
    });

    it('should handle batch processing', async () => {
      const inputs: InputType[] = [
        { id: 'test-1', data: { /* test data */ } },
        { id: 'test-2', data: { /* test data */ } }
      ];

      const results = await agent.processBatch(inputs);

      expect(results).toHaveLength(2);
      results.forEach(result => {
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('confidence');
      });
    });
  });

  describe('version and metadata', () => {
    it('should return correct version', () => {
             expect(agent.getVersion()).toBe('8.0.0');
    });

    it('should return correct agent name', () => {
      expect(agent.getAgentName()).toBe('[AgentName]');
    });
  });
});
```

## 📦 **Docker Template (Dockerfile)**
```dockerfile
# Multi-stage build for Kanizsa [AgentName] Agent
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('Health check passed')"

# Default command
CMD ["node", "dist/index.js"]

# Labels
LABEL version="8.0.0"
LABEL description="Kanizsa [AgentName] Agent"
LABEL maintainer="Kanizsa Team"
```

## 📚 **README Template**

### **README.md Structure**
```markdown
# Kanizsa [AgentName] Agent

**VERSION:** 10.2.2 - [Specific Feature]  
**LAST UPDATED:** [Date]

## 🎯 **Agent Overview**

Brief description of what this agent does and its purpose in the Kanizsa ecosystem.

## 🏗️ **Architecture**

- **🔗 Independent Repository**: Self-contained with no direct dependencies
- **📦 Library-First**: Primary interface is a TypeScript library
- **🔒 Type-Safe**: Comprehensive TypeScript types and validation
- **🧪 Testable**: Comprehensive test coverage

## 🚀 **Quick Start**

### **Installation**
```bash
npm install kanizsa-[agent-name]-agent
```

### **Basic Usage**
```typescript
import { [AgentName]Agent } from 'kanizsa-[agent-name]-agent';

const agent = new [AgentName]Agent();
const result = await agent.process(inputData);
```

## 📋 **API Reference**

### **Core Methods**
- `process(input, options)`: Process single input
- `processBatch(inputs, options)`: Process multiple inputs
- `getVersion()`: Get agent version
- `getAgentName()`: Get agent name

### **Types**
- `InputType`: Input data structure
- `OutputType`: Output data structure
- `AgentOptions`: Configuration options

## 🧪 **Testing**

```bash
npm test
npm run test:coverage
```

## 📦 **Development**

```bash
npm install
npm run build
npm run dev
```

## 🔄 **Integration**

### **With Kanizsa Platform**
```typescript
// Example integration with main platform
import { [AgentName]Agent } from 'kanizsa-[agent-name]-agent';

const agent = new [AgentName]Agent();
const results = await agent.processBatch(photos);
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

MIT License - see LICENSE file for details.
```

## 🔧 **Scripts Template**

### **update_version.sh Template**
```bash
#!/bin/bash

# Update Version References for Kanizsa [AgentName] Agent
# This script reads the VERSION file and updates all version references

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if VERSION file exists
if [[ ! -f "VERSION" ]]; then
    print_error "VERSION file not found!"
    exit 1
fi

# Read version from VERSION file
VERSION=$(cat VERSION)
print_status "Updating all version references to: $VERSION"

# Update package.json
print_status "Updating package.json..."
sed -i '' "s/\"version\": \"[0-9]\+\.[0-9]\+\.[0-9]\+\"/\"version\": \"$VERSION\"/g" package.json

# Update Dockerfile
print_status "Updating Dockerfile..."
sed -i '' "s/LABEL version=\"[0-9]\+\.[0-9]\+\.[0-9]\+\"/LABEL version=\"$VERSION\"/g" Dockerfile

# Update README.md
print_status "Updating README.md..."
sed -i '' "s/Version: [0-9]\+\.[0-9]\+\.[0-9]\+/Version: $VERSION/g" README.md

# Update source files
print_status "Updating source files..."
find src/ -name "*.ts" -type f -exec sed -i '' "s/version = '[0-9]\+\.[0-9]\+\.[0-9]\+'/version = '$VERSION'/g" {} \;

print_success "All version references updated to $VERSION!"
```

## 🎯 **Best Practices**

### **1. Zero Host Dependencies**
- **No External Services**: No HTTP APIs, databases, or file systems
- **No Environment Variables**: No process.env usage
- **No Network Calls**: No fetch, http, or https operations
- **Pure Functions**: All operations are pure and deterministic
- **Self-Contained**: All logic within the agent

### **2. Agent Design**
- Keep agents focused on a single responsibility
- Use clear, descriptive names
- Implement comprehensive error handling
- Provide meaningful confidence scores
- Ensure library-first design

### **3. Type Safety**
- Define comprehensive TypeScript interfaces
- Use Zod for runtime validation (if needed)
- Export all types for consumers
- Ensure type safety throughout

### **4. Testing**
- Aim for 90%+ test coverage
- Test both success and error cases
- No external dependencies in tests
- Pure unit tests without mocks

### **5. Documentation**
- Keep README focused on usage, not implementation
- Include code examples
- Document all public APIs
- Include zero dependencies verification

### **6. Version Management**
- Follow semantic versioning
- Update version in all relevant files
- Use the sync script for cross-repository updates

## 🔄 **Integration Guidelines**

### **1. Platform Integration**
- Agents should be library-first, not service-first
- Use standard interfaces for input/output
- Provide consistent error handling
- Ensure zero host dependencies

### **2. Communication**
- Use TypeScript interfaces for type safety
- Implement standard health check patterns
- Provide version and metadata information
- No external service communication

### **3. Deployment**
- Containerize with Docker
- Use multi-stage builds for efficiency
- Implement health checks
- Ensure self-contained deployment

### **4. Zero Dependencies Verification**
- Include `verify_zero_dependencies.sh` script
- Run verification before releases
- Document zero dependencies architecture
- Ensure pure function design

---

**Template Version:** 8.0.0  
**Last Updated:** August 5, 2025  
**Status:** ✅ **AGENT TEMPLATE ESTABLISHED**
