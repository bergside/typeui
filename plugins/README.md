# TypeUI tool plugins

Tool-specific TypeUI plugins live in provider namespaces:

- `../plugin.json` for direct VS Code / GitHub Copilot source installs from the repository root.
- `../.github/plugin/marketplace.json` for VS Code / GitHub Copilot plugin marketplace discovery.
- `../.mcp/server.json` for MCP registry and VS Code MCP gallery discovery.
- `codex/typeui` for the Codex plugin and Codex marketplace package.
- `claude/typeui` for the Claude Code plugin and Claude marketplace package.
- `cursor/typeui` for the Cursor plugin and Cursor marketplace package.
- `vscode/typeui` for the VS Code / GitHub Copilot agent plugin and MCP configuration.
- `cline/typeui` for the Cline plugin and MCP setup helper.
- `opencode/typeui` for the OpenCode helper plugin and MCP configuration.
- `antigravity/typeui` for the Antigravity CLI plugin and MCP configuration.

Marketplace entries can still expose each plugin as `typeui`; the namespaced folders only keep repository ownership clear as more tool plugins are added.
