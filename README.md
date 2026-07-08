# @mhdd_24/notepadpp-mcp

MCP server for **Notepad++** on Windows. Use it from [Cursor](https://cursor.com), Claude Desktop, VS Code Copilot, or any MCP-compatible client to open files, check editor status, and save/load session snapshots.

**Full documentation:** [docs/WIKI.md](./docs/WIKI.md)

---

## How it works (30 seconds)

```
You (chat) → MCP client → notepadpp-mcp → notepad++.exe / session.xml
```

1. **Status** — resolves `NOTEPADPP_EXE`, checks if the process is running
2. **Open / new** — launches Notepad++ with file paths or a fresh buffer
3. **Sessions** — reads live `session.xml`; save/load named snapshots via `-openSession`

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| **Node.js 18+** | Required for MCP server |
| **Notepad++ 8+** | Default: `C:\Program Files\Notepad++\notepad++.exe` |
| **Windows** | CLI + `session.xml` (no Python) |

---

## Install

### Option A — npm (recommended after publish)

```bash
npm install -g @mhdd_24/notepadpp-mcp
```

### Option B — npx (no global install)

```bash
npx @mhdd_24/notepadpp-mcp
```

### Option C — clone and build (contributors)

```bash
git clone https://github.com/Mhdd-24/NotePadpp-MCP.git
cd NotePadpp-MCP
npm install
npm run build
node dist/index.js
```

---

## Configure your MCP client

### Cursor

Edit **Cursor Settings → MCP** or `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "notepadpp": {
      "command": "npx",
      "args": ["-y", "@mhdd_24/notepadpp-mcp"],
      "env": {
        "NOTEPADPP_EXE": "C:/Program Files/Notepad++/notepad++.exe",
        "NOTEPADPP_WORKDIR": "C:/Users/You/Documents/NotepadPP-Notes"
      }
    }
  }
}
```

**After global install**, you can use:

```json
"command": "notepadpp-mcp"
```

**Local development:**

```json
"command": "node",
"args": ["C:/path/to/notepadpp-mcp/dist/index.js"]
```

Restart Cursor (or toggle the MCP server off/on) after saving.

---

## Environment variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `NOTEPADPP_EXE` | No | Program Files path | Path to `notepad++.exe` |
| `NOTEPADPP_WORKDIR` | No | `%USERPROFILE%\Documents\NotepadPP-Notes` | Base for relative paths |
| `NOTEPADPP_SESSION_XML` | No | `%APPDATA%\Notepad++\session.xml` | Live session file |
| `NOTEPADPP_SESSION_STORAGE_DIR` | No | `%APPDATA%\Notepad++\notepadpp-mcp-sessions` | Named snapshots |

**Never commit** machine-specific paths that identify private orgs. Put local overrides only in MCP `env` or a gitignored `.env`.

---

## Tools

| Tool | Purpose |
|------|---------|
| `npp_status` | Exe path, process running, session/workdir |
| `npp_open` | Open file(s) in Notepad++ |
| `npp_new` | New empty buffer or create+open a file |
| `npp_list_session` | List paths from live `session.xml` |
| `npp_save_session` | Snapshot live session under a name |
| `npp_load_session` | Load named session via `-openSession` |
| `npp_run` | Escape hatch with custom CLI args |

---

## What happens after `npm install`?

1. Package files land in `node_modules/@mhdd_24/notepadpp-mcp/` (or global prefix if `-g`).
2. `prepack` / publish includes compiled **`dist/`** — no local build needed for end users.
3. The **`notepadpp-mcp`** bin points to `dist/index.js`.
4. Your MCP client runs that entry over **stdio**.
5. Tools are registered; the server waits for `CallTool` requests from the AI.

---

## After publishing to npm (maintainers)

1. **Bump version** in `package.json` and `src/config/notepadpp.config.ts` (`NPP.SERVER.VERSION`).
2. **Build and test:** `npm run build` then test with local `mcp.json`.
3. **Publish:** `npm publish --access public` (logged in as package owner).
4. **Users update** by restarting MCP — `npx` picks up the new version automatically.

Current package version: **1.0.1**.

See [WIKI — Publishing](./docs/WIKI.md#5-publishing-checklist) for the checklist.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Exe not found | Set `NOTEPADPP_EXE` |
| Empty session list | Open saved files in Notepad++, then retry |
| Session load opens new window | Check Notepad++ multi-instance preferences |

---

## License

ISC
