import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import fs from 'node:fs';
import { NPP } from '../config/notepadpp.config.js';
import { launchNotepad } from '../services/notepadppService.js';
import { resolvePath } from '../utils/paths.js';
import { toolError, toolText } from '../utils/toolResponse.js';

export function registerOpenTool(server: McpServer): void {
  const cfg = NPP.TOOLS.OPEN;
  server.tool(
    cfg.NAME,
    cfg.DESCRIPTION,
    {
      paths: z.union([z.string(), z.array(z.string()).min(1)]).describe(cfg.PATHS_DESCRIPTION),
      multiInstance: z.boolean().optional().describe(cfg.MULTI_INSTANCE_DESCRIPTION),
    },
    async ({ paths, multiInstance }) => {
      try {
        const list = (Array.isArray(paths) ? paths : [paths]).map(resolvePath);
        const missing = list.filter((p) => !fs.existsSync(p));
        if (missing.length === list.length) {
          return toolText(`None of the paths exist:\n${missing.map((p) => `- ${p}`).join('\n')}`, true);
        }

        const args: string[] = [];
        if (multiInstance) {
          args.push('-multiInst');
        }
        args.push(...list);

        const result = await launchNotepad(args);
        const warn =
          missing.length > 0
            ? `\nWarning — missing paths still passed to Notepad++:\n${missing.map((p) => `- ${p}`).join('\n')}`
            : '';

        return toolText(
          `Opened in Notepad++ (pid ${result.pid ?? 'n/a'}):\n${list.map((p) => `- ${p}`).join('\n')}${warn}`,
        );
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
