# TypeUI Codex Plugin

TypeUI connects Codex to the TypeUI MCP server so it can use curated design systems, UI prompts, and layout variations while building interfaces.

## Install

First, add the Bergside plugin marketplace so Codex can find TypeUI:

```bash
codex plugin marketplace add bergside/typeui --sparse .agents/plugins --ref main
```

Then install the TypeUI plugin from that marketplace:

```bash
codex plugin add typeui@bergside
```

After installation, Codex will ask you to authenticate TypeUI when needed.

## MCP server

This plugin registers the TypeUI Streamable HTTP MCP server:

```text
https://mcp.typeui.sh/mcp
```

## Links

- Website: https://www.typeui.sh
- Documentation: https://www.typeui.sh/docs
- Codex setup guide: https://www.typeui.sh/docs/guides/codex
- Privacy policy: https://www.typeui.sh/privacy
- Terms of service: https://www.typeui.sh/terms
