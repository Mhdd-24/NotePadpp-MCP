import { spawn } from 'node:child_process';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import { NPP } from '../config/notepadpp.config.js';
import { env } from '../env.js';
import { assertExeExists } from '../utils/paths.js';

const execFileAsync = promisify(execFile);

export async function isNotepadRunning(): Promise<boolean> {
  try {
    const { stdout } = await execFileAsync('tasklist', [
      '/FI',
      `IMAGENAME eq ${NPP.PROCESS_NAME}`,
      '/NH',
    ]);
    return stdout.toLowerCase().includes('notepad++.exe');
  } catch {
    return false;
  }
}

export function launchNotepad(args: string[] = []): Promise<{ pid?: number; args: string[] }> {
  const exe = assertExeExists();
  return new Promise((resolve, reject) => {
    const child = spawn(exe, args, {
      detached: true,
      stdio: 'ignore',
      windowsHide: false,
      cwd: env.NOTEPADPP_WORKDIR,
    });
    child.unref();
    child.on('error', reject);
    // Give spawn a tick to fail early if exe is invalid
    setImmediate(() => {
      resolve({ pid: child.pid, args });
    });
  });
}

export function getExeVersionHint(exe: string): string | undefined {
  try {
    // File may exist; Windows version resource is not trivial without win32 APIs.
    // Report file size + mtime as a lightweight presence marker.
    const stat = fs.statSync(exe);
    return `size=${stat.size} mtime=${stat.mtime.toISOString()}`;
  } catch {
    return undefined;
  }
}
