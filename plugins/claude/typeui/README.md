# TypeUI Claude Code Plugin

TypeUI connects Claude Code to the TypeUI MCP server so it can use curated design systems, UI prompts, and layout variations while building interfaces.

## Install

First, add the Bergside plugin marketplace so Claude Code can find TypeUI:

```bash
claude plugin marketplace add bergside/typeui
```

Then install the TypeUI plugin from that marketplace:

```bash
claude plugin install typeui@bergside
```

If Claude Code is already running, reload plugins:

```text
/reload-plugins
```

After installation, Claude Code will connect to TypeUI MCP. Sign in with TypeUI if Claude asks you to authorize the connection.

## MCP server

This plugin registers the TypeUI remote HTTP MCP server:

```text
https://mcp.typeui.sh/mcp
```

## Links

- Website: https://www.typeui.sh
- Documentation: https://www.typeui.sh/docs
- Claude setup guide: https://www.typeui.sh/docs/guides/claude
- Privacy policy: https://www.typeui.sh/privacy
- Terms of service: https://www.typeui.sh/terms
