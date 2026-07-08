import dotenv from 'dotenv';
import path from 'node:path';
import os from 'node:os';
import { NPP } from './config/notepadpp.config.js';

dotenv.config();

function readEnv(keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }
  return undefined;
}

function defaultSessionXml(): string {
  return path.join(os.homedir(), 'AppData', 'Roaming', 'Notepad++', 'session.xml');
}

function defaultSessionStorage(): string {
  return path.join(os.homedir(), 'AppData', 'Roaming', 'Notepad++', NPP.DEFAULTS.SESSION_SUBDIR);
}

function defaultWorkdir(): string {
  if (NPP.DEFAULTS.WORKDIR.trim()) {
    return NPP.DEFAULTS.WORKDIR;
  }
  return path.join(os.homedir(), 'Documents', 'NotepadPP-Notes');
}

export const env = {
  NOTEPADPP_EXE: readEnv(NPP.ENV.EXE_KEYS) ?? NPP.DEFAULTS.EXE,
  NOTEPADPP_SESSION_XML: readEnv(NPP.ENV.SESSION_XML_KEYS) ?? defaultSessionXml(),
  NOTEPADPP_WORKDIR: readEnv(NPP.ENV.WORKDIR_KEYS) ?? defaultWorkdir(),
  NOTEPADPP_SESSION_STORAGE_DIR: readEnv(NPP.ENV.SESSION_STORAGE_KEYS) ?? defaultSessionStorage(),
};

export function validateEnv(): void {
  // Soft validation only — tools report concrete errors if exe/session missing.
}
