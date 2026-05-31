# TypeUI tool plugins

Tool-specific TypeUI plugins live in provider namespaces:

- `codex/typeui` for the Codex plugin and Codex marketplace package.
- `claude/typeui` for a future Claude plugin.
- `cursor/typeui` for a future Cursor plugin.

The Codex marketplace entry can still expose the plugin as `typeui`; the namespaced folder only keeps repository ownership clear as more tool plugins are added.
