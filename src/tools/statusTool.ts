import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { env } from '../env.js';
import { NPP } from '../config/notepadpp.config.js';
import { getExeVersionHint, isNotepadRunning } from '../services/notepadppService.js';
import { listNamedSessions } from '../services/sessionService.js';
import { toolError, toolText } from '../utils/toolResponse.js';
import fs from 'node:fs';

export function registerStatusTool(server: McpServer): void {
  const cfg = NPP.TOOLS.STATUS;
  server.tool(cfg.NAME, cfg.DESCRIPTION, {}, async () => {
    try {
      const exe = env.NOTEPADPP_EXE;
      const exeExists = fs.existsSync(exe);
      const running = await isNotepadRunning();
      const sessionExists = fs.existsSync(env.NOTEPADPP_SESSION_XML);
      const named = listNamedSessions();
      const hint = exeExists ? getExeVersionHint(exe) : undefined;

      const lines = [
        'Notepad++ MCP status:',
        `- exe: ${exe}`,
        `- exeExists: ${exeExists}`,
        hint ? `- fileHint: ${hint}` : undefined,
        `- running: ${running}`,
        `- workdir: ${env.NOTEPADPP_WORKDIR}`,
        `- sessionXml: ${env.NOTEPADPP_SESSION_XML}`,
        `- sessionXmlExists: ${sessionExists}`,
        `- sessionStorage: ${env.NOTEPADPP_SESSION_STORAGE_DIR}`,
        `- namedSessions: ${named.length ? named.join(', ') : '(none)'}`,
      ].filter(Boolean) as string[];

      return toolText(lines.join('\n'), !exeExists);
    } catch (error) {
      return toolError(error);
    }
  });
}
