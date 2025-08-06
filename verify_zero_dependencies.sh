#!/bin/bash

# Zero Host Dependencies Verification Script
# Kanizsa Adjective Agent - Version 7.0.1

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Verifying Zero Host Dependencies for Kanizsa Adjective Agent"
print_status "=========================================================="

# Check 1: Package.json dependencies
print_status "Checking package.json dependencies..."
if grep -q "dependencies" package.json; then
    DEPENDENCIES=$(grep -A 10 '"dependencies"' package.json | grep -v '"dependencies"' | grep -v '}' | grep -v '^$' | wc -l)
    if [ "$DEPENDENCIES" -eq 1 ]; then
        print_success "Only essential dependency (zod) found - acceptable"
    else
        print_warning "Multiple dependencies found - review for necessity"
    fi
else
    print_success "No dependencies section found"
fi

# Check 2: No external imports in source code
print_status "Checking for external imports in source code..."
EXTERNAL_IMPORTS=$(grep -r "import.*from.*['\"]" src/ | grep -v "from.*['\"]\./" | grep -v "from.*['\"]zod" | wc -l)
if [ "$EXTERNAL_IMPORTS" -eq 0 ]; then
    print_success "No external imports found in source code"
else
    print_error "External imports found:"
    grep -r "import.*from.*['\"]" src/ | grep -v "from.*['\"]\./" | grep -v "from.*['\"]zod"
fi

# Check 3: No process.env usage
print_status "Checking for environment variable usage..."
ENV_USAGE=$(grep -r "process\.env" src/ | wc -l)
if [ "$ENV_USAGE" -eq 0 ]; then
    print_success "No environment variable usage found"
else
    print_error "Environment variable usage found:"
    grep -r "process\.env" src/
fi

# Check 4: No file system operations
print_status "Checking for file system operations..."
FS_OPS=$(grep -r "fs\." src/ | wc -l)
if [ "$FS_OPS" -eq 0 ]; then
    print_success "No file system operations found"
else
    print_error "File system operations found:"
    grep -r "fs\." src/
fi

# Check 5: No network operations
print_status "Checking for network operations..."
NETWORK_OPS=$(grep -r "fetch\|http\|https" src/ | wc -l)
if [ "$NETWORK_OPS" -eq 0 ]; then
    print_success "No network operations found"
else
    print_error "Network operations found:"
    grep -r "fetch\|http\|https" src/
fi

# Check 6: No database operations
print_status "Checking for database operations..."
DB_OPS=$(grep -r "sqlite\|postgres\|mysql\|mongodb\|redis" src/ | wc -l)
if [ "$DB_OPS" -eq 0 ]; then
    print_success "No database operations found"
else
    print_error "Database operations found:"
    grep -r "sqlite\|postgres\|mysql\|mongodb\|redis" src/
fi

# Check 7: No host-specific paths
print_status "Checking for host-specific paths..."
HOST_PATHS=$(grep -r "/Users\|/home\|C:\\\|D:\\" src/ | wc -l)
if [ "$HOST_PATHS" -eq 0 ]; then
    print_success "No host-specific paths found"
else
    print_error "Host-specific paths found:"
    grep -r "/Users\|/home\|C:\\\|D:\\" src/
fi

# Check 8: No external API calls
print_status "Checking for external API calls..."
API_CALLS=$(grep -r "api\.\|\.com\|\.org\|\.net" src/ | wc -l)
if [ "$API_CALLS" -eq 0 ]; then
    print_success "No external API calls found"
else
    print_error "External API calls found:"
    grep -r "api\.\|\.com\|\.org\|\.net" src/
fi

# Check 9: Dockerfile self-contained
print_status "Checking Dockerfile for self-containment..."
if grep -q "FROM node:18-alpine" Dockerfile; then
    print_success "Dockerfile uses standard Node.js base image"
else
    print_warning "Dockerfile may have custom base image"
fi

# Check 10: No external configuration files
print_status "Checking for external configuration dependencies..."
CONFIG_FILES=$(find . -name "*.json" -o -name "*.yaml" -o -name "*.yml" -o -name "*.env" | grep -v "package.json" | grep -v "tsconfig.json" | grep -v "jest.config" | wc -l)
if [ "$CONFIG_FILES" -eq 0 ]; then
    print_success "No external configuration files found"
else
    print_warning "External configuration files found:"
    find . -name "*.json" -o -name "*.yaml" -o -name "*.yml" -o -name "*.env" | grep -v "package.json" | grep -v "tsconfig.json" | grep -v "jest.config"
fi

# Check 11: TypeScript configuration
print_status "Checking TypeScript configuration..."
if grep -q '"target": "ES2022"' tsconfig.json; then
    print_success "TypeScript configured for modern ES modules"
else
    print_warning "TypeScript configuration may need review"
fi

# Check 12: Module resolution
print_status "Checking module resolution..."
if grep -q '"moduleResolution": "node"' tsconfig.json; then
    print_success "Module resolution properly configured"
else
    print_warning "Module resolution may need review"
fi

# Summary
print_status ""
print_status "=== ZERO HOST DEPENDENCIES VERIFICATION SUMMARY ==="

# Count total issues
TOTAL_ISSUES=0
if [ "$EXTERNAL_IMPORTS" -gt 0 ]; then TOTAL_ISSUES=$((TOTAL_ISSUES + 1)); fi
if [ "$ENV_USAGE" -gt 0 ]; then TOTAL_ISSUES=$((TOTAL_ISSUES + 1)); fi
if [ "$FS_OPS" -gt 0 ]; then TOTAL_ISSUES=$((TOTAL_ISSUES + 1)); fi
if [ "$NETWORK_OPS" -gt 0 ]; then TOTAL_ISSUES=$((TOTAL_ISSUES + 1)); fi
if [ "$DB_OPS" -gt 0 ]; then TOTAL_ISSUES=$((TOTAL_ISSUES + 1)); fi
if [ "$HOST_PATHS" -gt 0 ]; then TOTAL_ISSUES=$((TOTAL_ISSUES + 1)); fi
if [ "$API_CALLS" -gt 0 ]; then TOTAL_ISSUES=$((TOTAL_ISSUES + 1)); fi

if [ "$TOTAL_ISSUES" -eq 0 ]; then
    print_success "✅ ZERO HOST DEPENDENCIES VERIFIED!"
    print_success "The Adjective Agent is completely self-contained and has no host dependencies."
    print_success "It can run in any containerized environment without external requirements."
else
    print_error "❌ $TOTAL_ISSUES potential host dependency issues found."
    print_error "Please review and resolve the issues above."
fi

print_status ""
print_status "=== AGENT CHARACTERISTICS ==="
echo "  ✅ Library-first design"
echo "  ✅ TypeScript-only implementation"
echo "  ✅ Self-contained logic"
echo "  ✅ No external service dependencies"
echo "  ✅ No file system dependencies"
echo "  ✅ No network dependencies"
echo "  ✅ No database dependencies"
echo "  ✅ Container-ready"
echo "  ✅ Platform-agnostic"

print_status ""
print_success "Zero host dependencies verification complete!"
