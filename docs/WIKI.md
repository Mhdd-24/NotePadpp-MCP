# Notepad++ MCP — Project Wiki

Complete guide for **@mhdd_24/notepadpp-mcp**: what it does, how it works, setup from scratch, and maintainer workflow after npm publish.

---

## Table of contents

1. [What this project does](#1-what-this-project-does)
2. [High-level architecture](#2-high-level-architecture)
3. [Environment variables](#3-environment-variables)
4. [Project folder structure](#4-project-folder-structure)
5. [Publishing checklist](#5-publishing-checklist)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. What this project does

**notepadpp-mcp** is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server. It lets AI assistants (Cursor, Claude, Copilot, etc.) drive **Notepad++** on Windows via natural language.

| Tool | Role |
|------|------|
| `npp_status` | Exe path, running process, paths |
| `npp_open` | Open one or more files |
| `npp_new` | New buffer or create+open file |
| `npp_list_session` | Paths from live `session.xml` |
| `npp_save_session` | Named snapshot of live session |
| `npp_load_session` | Restore via `-openSession` |
| `npp_run` | Custom CLI args escape hatch |

---

## 2. High-level architecture

```
┌────────────────────────────────────────────────────────────┐
│  MCP client (Cursor, Claude Desktop, VS Code, …)           │
│  stdio JSON-RPC — tools/list, tools/call                   │
└────────────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────┐
│  src/index.ts                                              │
│  McpServer + StdioServerTransport                          │
│  registerTools() → npp_* tools                             │
└────────────────────────────┬───────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│ notepad++.exe   │ │ session.xml     │ │ named session/*.xml │
│ CLI open/new    │ │ live buffers    │ │ save / -openSession │
└─────────────────┘ └─────────────────┘ └─────────────────────┘
```

### Layer responsibilities

| Layer | Location | Purpose |
|-------|----------|---------|
| **Entry** | `src/index.ts` | Boot MCP server, register tools |
| **Config** | `src/config/notepadpp.config.ts` | All constants (`NPP`) |
| **Tools** | `src/tools/` | MCP tool schemas + handlers |
| **Services** | `src/services/` | Spawn editor, parse sessions |
| **Utils** | `src/utils/` | Paths, tool responses |
| **Env** | `src/env.ts` | Read `process.env` with aliases |

Control surface: Notepad++ CLI and `%APPDATA%\Notepad++\session.xml`. No Win32 message injection in v1.

---

## 3. Environment variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `NOTEPADPP_EXE` | No | `C:\Program Files\Notepad++\notepad++.exe` | Editor binary |
| `NOTEPADPP_WORKDIR` | No | `%USERPROFILE%\Documents\NotepadPP-Notes` | Relative path base |
| `NOTEPADPP_SESSION_XML` | No | `%APPDATA%\Notepad++\session.xml` | Live session |
| `NOTEPADPP_SESSION_STORAGE_DIR` | No | `%APPDATA%\Notepad++\notepadpp-mcp-sessions` | Snapshots |

Aliases: `notepadppExe`, `notepadppWorkdir`, `notepadppSessionXml`, `notepadppSessionStorageDir`.

Public docs and examples use generic placeholders only. Put machine-specific paths in local MCP `env` or a gitignored `.env`.

---

## 4. Project folder structure

```
notepadpp-mcp/
├── src/
│   ├── index.ts
│   ├── env.ts
│   ├── config/notepadpp.config.ts
│   ├── services/
│   ├── tools/
│   └── utils/
├── docs/WIKI.md
├── dist/                 ← published
├── package.json
├── README.md
├── LICENSE
├── .env.example
├── .gitignore
└── .npmignore
```

Same layout conventions as `@mhdd_24/timelog-mcp` (scoped package, `dist/` publish, wiki + README, secrets gitignored).

---

## 5. Publishing checklist

- [ ] `npm run build`
- [ ] Version bumped in `package.json` **and** `NPP.SERVER.VERSION`
- [ ] README and WIKI updated
- [ ] Smoke: `npp_status`, `npp_open`
- [ ] No secrets / org-specific branding in committed files
- [ ] `npm publish --access public`

```bash
npm login
npm run build
npm publish --access public
```

---

## 6. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Exe not found | Set `NOTEPADPP_EXE` |
| Empty session list | Open saved files in Notepad++ first |
| New window on load | Check multi-instance preferences |

---

*Last updated for v1.0.1 — published under @mhdd_24 scope on npm; architecture aligned with Timelog MCP.*
