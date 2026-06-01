# TypeUI Antigravity Plugin

TypeUI connects Antigravity to the TypeUI MCP server so it can use curated design systems, UI prompts, and layout variations while building interfaces.

## Install

For local validation from a checkout of the public repository:

```bash
agy plugin install ./plugins/antigravity/typeui
```

After installation, Antigravity will connect to TypeUI through the bundled MCP configuration. Sign in with TypeUI if Antigravity asks you to authorize the connection.

## MCP server

This plugin registers the TypeUI Streamable HTTP MCP server:

```text
https://mcp.typeui.sh/mcp
```

Antigravity uses `serverUrl` for remote MCP servers, so the plugin ships this MCP configuration:

```json
{
  "mcpServers": {
    "typeui": {
      "serverUrl": "https://mcp.typeui.sh/mcp"
    }
  }
}
```

## Directory preparation

To submit TypeUI to an Antigravity plugin directory, use `plugins/antigravity/typeui` as the plugin package root. It contains the required `plugin.json` marker file, MCP server definition, and TypeUI usage rules.

If the directory requires a GitHub URL that installs from the repository root, publish this folder as its own release artifact, branch, or dedicated repository so `plugin.json`, `mcp_config.json`, and `rules/` are at the artifact root.

## Links

- Website: https://www.typeui.sh
- Documentation: https://www.typeui.sh/docs
- Antigravity setup guide: https://www.typeui.sh/docs/guides/antigravity
- Privacy policy: https://www.typeui.sh/privacy
- Terms of service: https://www.typeui.sh/terms
