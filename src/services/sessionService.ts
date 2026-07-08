import fs from 'node:fs';
import path from 'node:path';
import { NPP } from '../config/notepadpp.config.js';
import { env } from '../env.js';
import { ensureDir, sanitizeSessionName } from '../utils/paths.js';
import { launchNotepad } from './notepadppService.js';

/** Extract file: filename="..." attributes from Notepad++ session.xml */
export function parseSessionFilePaths(xml: string): string[] {
  const paths: string[] = [];
  const re = /filename="([^"]+)"/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml)) !== null) {
    const raw = match[1]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');
    if (raw && !raw.startsWith('new ')) {
      paths.push(raw);
    }
  }
  return [...new Set(paths)];
}

export function listLiveSessionFiles(): { sessionPath: string; files: string[] } {
  const sessionPath = env.NOTEPADPP_SESSION_XML;
  if (!fs.existsSync(sessionPath)) {
    throw new Error(NPP.MESSAGES.SESSION_MISSING);
  }
  const xml = fs.readFileSync(sessionPath, 'utf8');
  const files = parseSessionFilePaths(xml);
  return { sessionPath, files };
}

export function listNamedSessions(): string[] {
  const dir = env.NOTEPADPP_SESSION_STORAGE_DIR;
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.xml'))
    .map((f) => path.basename(f, '.xml'))
    .sort();
}

export function saveNamedSession(name: string): { savedAs: string; fileCount: number } {
  const safe = sanitizeSessionName(name);
  const { sessionPath, files } = listLiveSessionFiles();
  if (files.length === 0) {
    throw new Error(NPP.MESSAGES.NO_FILES_IN_SESSION);
  }
  ensureDir(env.NOTEPADPP_SESSION_STORAGE_DIR);
  const dest = path.join(env.NOTEPADPP_SESSION_STORAGE_DIR, `${safe}.xml`);
  fs.copyFileSync(sessionPath, dest);
  return { savedAs: dest, fileCount: files.length };
}

export async function loadNamedSession(name: string): Promise<{ sessionFile: string }> {
  const safe = sanitizeSessionName(name);
  const sessionFile = path.join(env.NOTEPADPP_SESSION_STORAGE_DIR, `${safe}.xml`);
  if (!fs.existsSync(sessionFile)) {
    throw new Error(`${NPP.MESSAGES.SESSION_NOT_FOUND}: ${safe}`);
  }
  await launchNotepad(['-openSession', sessionFile]);
  return { sessionFile };
}
