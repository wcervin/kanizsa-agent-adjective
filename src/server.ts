#!/usr/bin/env node
/**
 * Kanizsa Adjective Agent - Main Server
 * 
 * This is the main entry point for the Adjective Agent API server.
 * It starts the comprehensive API server with proper configuration
 * and ensures 100% compatibility with the MCP server protocol.
 * 
 * VERSION: 10.2.3 - MCP Server Compatibility
 * LAST UPDATED: August 08, 2025, 22:06:40 CDT
 */

import { AdjectiveAgentApiServer } from './api-server.js';

// =============================================================================
// MAIN SERVER
// =============================================================================

async function main() {
  try {
    console.log('🚀 Starting Kanizsa Adjective Agent API Server...');
    console.log('📋 Version: 10.0.1');
    console.log('🔗 MCP Server Compatibility: 100%');
    
    // Create API server instance
    const apiServer = new AdjectiveAgentApiServer();
    
    // Get port from environment or use default
    const port = parseInt(process.env.AGENT_PORT || '3000');
    
    // Start the server
    await apiServer.start(port);
    
    console.log('✅ Adjective Agent API Server started successfully!');
    console.log(`🌐 Server running on port ${port}`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(`📚 API info: http://localhost:${port}/info`);
    console.log(`📖 Documentation: http://localhost:${port}/version`);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Received SIGINT, shutting down gracefully...');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start Adjective Agent API Server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error('❌ Unhandled error in main:', error);
  process.exit(1);
});
