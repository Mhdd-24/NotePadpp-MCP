import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { NPP } from '../config/notepadpp.config.js';
import { launchNotepad } from '../services/notepadppService.js';
import { toolError, toolText } from '../utils/toolResponse.js';

export function registerRunTool(server: McpServer): void {
  const cfg = NPP.TOOLS.RUN;
  server.tool(
    cfg.NAME,
    cfg.DESCRIPTION,
    {
      args: z.array(z.string()).default([]).describe(cfg.ARGS_DESCRIPTION),
    },
    async ({ args }) => {
      try {
        const result = await launchNotepad(args);
        return toolText(
          `Launched Notepad++ (pid ${result.pid ?? 'n/a'})\nargs: ${JSON.stringify(result.args)}`,
        );
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
