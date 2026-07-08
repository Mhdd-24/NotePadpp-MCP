import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';
import { NPP } from '../config/notepadpp.config.js';
import { launchNotepad } from '../services/notepadppService.js';
import { ensureDir, resolvePath } from '../utils/paths.js';
import { toolError, toolText } from '../utils/toolResponse.js';

export function registerNewTool(server: McpServer): void {
  const cfg = NPP.TOOLS.NEW;
  server.tool(
    cfg.NAME,
    cfg.DESCRIPTION,
    {
      filename: z.string().optional().describe(cfg.FILENAME_DESCRIPTION),
      multiInstance: z.boolean().optional().describe(cfg.MULTI_INSTANCE_DESCRIPTION),
    },
    async ({ filename, multiInstance }) => {
      try {
        const args: string[] = [];
        if (multiInstance) {
          args.push('-multiInst');
        }

        let created: string | undefined;
        if (filename) {
          const target = resolvePath(filename);
          ensureDir(path.dirname(target));
          if (!fs.existsSync(target)) {
            fs.writeFileSync(target, '', 'utf8');
            created = target;
          }
          args.push(target);
        } else {
          args.push('-nosession');
        }

        const result = await launchNotepad(args);
        const detail = created
          ? `Created and opened: ${created}`
          : filename
            ? `Opened existing: ${resolvePath(filename)}`
            : 'Launched Notepad++ with a fresh session (-nosession)';

        return toolText(`${detail}\n(pid ${result.pid ?? 'n/a'})`);
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
