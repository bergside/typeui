# Install TypeUI in Cline

TypeUI is a hosted Streamable HTTP MCP server. Do not clone or build a local server for TypeUI.

## Server

- Name: `typeui`
- URL: `https://mcp.typeui.sh/mcp`
- Transport: Streamable HTTP

## Cline MCP config

Add this server to Cline MCP settings:

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

If Cline asks the user to authenticate, tell them to sign in with their TypeUI account.

## Verification

After installation, Cline should be able to use TypeUI tools for:

- browsing available design systems
- browsing UI prompts
- generating layout variations
- downloading TypeUI Pro resources for authenticated Pro users

Documentation: https://www.typeui.sh/docs/guides/cline

