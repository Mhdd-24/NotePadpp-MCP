export const NPP = {
  SERVER: {
    NAME: '@mhdd_24/notepadpp-mcp',
    VERSION: '1.0.0',
    STARTUP_MESSAGE: 'Notepad++ MCP Server Started',
    FATAL_PREFIX: 'Fatal error:',
  },
  DEFAULTS: {
    EXE: 'C:\\Program Files\\Notepad++\\notepad++.exe',
    WORKDIR: 'C:\\codeBase',
    SESSION_SUBDIR: 'notepadpp-mcp-sessions',
  },
  ENV: {
    EXE_KEYS: ['NOTEPADPP_EXE', 'notepadppExe'] as const,
    SESSION_XML_KEYS: ['NOTEPADPP_SESSION_XML', 'notepadppSessionXml'] as const,
    WORKDIR_KEYS: ['NOTEPADPP_WORKDIR', 'notepadppWorkdir'] as const,
    SESSION_STORAGE_KEYS: ['NOTEPADPP_SESSION_STORAGE_DIR', 'notepadppSessionStorageDir'] as const,
  },
  PROCESS_NAME: 'notepad++.exe',
  MESSAGES: {
    EXE_MISSING: 'Notepad++ executable not found. Set NOTEPADPP_EXE to notepad++.exe.',
    SESSION_MISSING: 'session.xml not found. Open Notepad++ and save some files first, or set NOTEPADPP_SESSION_XML.',
    NO_FILES_IN_SESSION: 'No file paths found in session.xml.',
    SESSION_NOT_FOUND: 'Named session not found.',
  },
  TOOLS: {
    STATUS: {
      NAME: 'npp_status',
      DESCRIPTION:
        'Check Notepad++ availability: exe path, whether the process is running, and resolved session/workdir paths.',
    },
    OPEN: {
      NAME: 'npp_open',
      DESCRIPTION:
        'Open one or more files in Notepad++. Paths may be absolute or relative to NOTEPADPP_WORKDIR.',
      PATHS_DESCRIPTION: 'File path(s) to open.',
      MULTI_INSTANCE_DESCRIPTION: 'If true, pass -multiInst so a separate Notepad++ instance is used.',
    },
    NEW: {
      NAME: 'npp_new',
      DESCRIPTION:
        'Launch Notepad++ with a new empty document. Optionally create and open a new file under NOTEPADPP_WORKDIR.',
      FILENAME_DESCRIPTION: 'Optional new file name (relative to NOTEPADPP_WORKDIR or absolute). Creates an empty file if missing.',
      MULTI_INSTANCE_DESCRIPTION: 'If true, pass -multiInst.',
    },
    LIST_SESSION: {
      NAME: 'npp_list_session',
      DESCRIPTION:
        'List file paths from the live Notepad++ session.xml (open/recent buffers).',
    },
    SAVE_SESSION: {
      NAME: 'npp_save_session',
      DESCRIPTION:
        'Copy the live session.xml into a named snapshot under the session storage folder.',
      NAME_DESCRIPTION: 'Session name (without .xml). Letters, digits, dash, underscore.',
    },
    LOAD_SESSION: {
      NAME: 'npp_load_session',
      DESCRIPTION:
        'Load a named session snapshot via notepad++.exe -openSession.',
      NAME_DESCRIPTION: 'Session name (without .xml) previously saved with npp_save_session.',
    },
    RUN: {
      NAME: 'npp_run',
      DESCRIPTION:
        'Escape hatch: run notepad++.exe with custom CLI arguments.',
      ARGS_DESCRIPTION: 'Arguments passed to notepad++.exe (e.g. ["-nosession", "C:/path/file.txt"]).',
    },
  },
} as const;
