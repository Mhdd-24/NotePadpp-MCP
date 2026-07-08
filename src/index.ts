#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { NPP } from './config/notepadpp.config.js';
import { validateEnv } from './env.js';
import { registerTools } from './tools/index.js';

validateEnv();

const server = new McpServer({
  name: NPP.SERVER.NAME,
  version: NPP.SERVER.VERSION,
});

registerTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(NPP.SERVER.STARTUP_MESSAGE);
}

main().catch((error) => {
  console.error(NPP.SERVER.FATAL_PREFIX, error);
  process.exit(1);
});
