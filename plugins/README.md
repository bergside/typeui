# TypeUI tool plugins

Tool-specific TypeUI plugins live in provider namespaces:

- `codex/typeui` for the Codex plugin and Codex marketplace package.
- `claude/typeui` for the Claude Code plugin and Claude marketplace package.
- `cursor/typeui` for the Cursor plugin and Cursor marketplace package.

Marketplace entries can still expose each plugin as `typeui`; the namespaced folders only keep repository ownership clear as more tool plugins are added.
