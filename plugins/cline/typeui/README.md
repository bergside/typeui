# TypeUI Cline Plugin

TypeUI helps Cline use curated design systems, UI prompts, and layout variations while building interfaces.

## Install the plugin

Install the single-file plugin from GitHub:

```bash
cline plugin install https://github.com/bergside/typeui/blob/main/plugins/cline/typeui/index.ts
```

The plugin adds a `typeui_setup_help` tool that shows the hosted TypeUI MCP configuration and links back to the TypeUI Cline guide.

## Connect TypeUI MCP

Add the hosted TypeUI MCP server in Cline:

```json
{
  "mcpServers": {
    "typeui": {
      "url": "https://mcp.typeui.sh/mcp",
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

Sign in with TypeUI if Cline asks you to authorize the connection.

## Links

- Website: https://www.typeui.sh
- Documentation: https://www.typeui.sh/docs
- Cline setup guide: https://www.typeui.sh/docs/guides/cline
- Privacy policy: https://www.typeui.sh/privacy
- Terms of service: https://www.typeui.sh/terms

