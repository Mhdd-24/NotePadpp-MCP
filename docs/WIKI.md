# Notepad++ MCP — Project Wiki

Guide for **@mhdd_24/notepadpp-mcp**: Windows Notepad++ automation over MCP for Cursor and other clients.

---

## 1. What this project does

Lets an AI assistant open files in Notepad++, inspect status, and manage session snapshots via natural language — without Python.

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

## 2. Architecture

```
MCP client (stdio)
    → src/index.ts (McpServer)
    → tools/ (Zod schemas + handlers)
    → services/ (spawn notepad++.exe, parse session.xml)
    → env + config constants (NPP)
```

Control surface: Notepad++ CLI and `%APPDATA%\Notepad++\session.xml`. No Win32 message injection in v1.

---

## 3. Environment variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `NOTEPADPP_EXE` | No | `C:\Program Files\Notepad++\notepad++.exe` | Editor binary |
| `NOTEPADPP_WORKDIR` | No | `C:\codeBase` | Relative path base |
| `NOTEPADPP_SESSION_XML` | No | `%APPDATA%\Notepad++\session.xml` | Live session |
| `NOTEPADPP_SESSION_STORAGE_DIR` | No | `%APPDATA%\Notepad++\notepadpp-mcp-sessions` | Snapshots |

Aliases: `notepadppExe`, `notepadppWorkdir`, `notepadppSessionXml`, `notepadppSessionStorageDir`.

---

## 4. Project structure

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
└── README.md
```

---

## 5. Publishing checklist

- [ ] `npm run build`
- [ ] Version bump in `package.json` and `NPP.SERVER.VERSION`
- [ ] Smoke: `npp_status`, `npp_open`
- [ ] No secrets in repo (`.env` gitignored)
- [ ] `npm publish --access public`

---

## 6. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Exe not found | Set `NOTEPADPP_EXE` |
| Empty session list | Open saved files in N++ first |
| New window on load | Check multi-instance preferences |

---

*v1.0.0 — @mhdd_24/notepadpp-mcp*
