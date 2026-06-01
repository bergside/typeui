import { createTool, type AgentPlugin } from "@cline/sdk";

const TYPEUI_MCP_URL = "https://mcp.typeui.sh/mcp";
const TYPEUI_DOCS_URL = "https://www.typeui.sh/docs/guides/cline";

const mcpConfig = `{
  "mcpServers": {
    "typeui": {
      "url": "${TYPEUI_MCP_URL}",
      "disabled": false,
      "autoApprove": []
    }
  }
}`;

const typeuiPlugin: AgentPlugin = {
  name: "typeui",
  manifest: {
    capabilities: ["tools"],
  },
  setup(api) {
    api.registerTool(
      createTool({
        name: "typeui_setup_help",
        description:
          "Show how to connect TypeUI MCP to Cline for design systems, UI prompts, and layout variations.",
        inputSchema: {
          type: "object",
          properties: {},
        },
        async execute() {
          return [
            "Connect Cline to the hosted TypeUI MCP server:",
            "",
            mcpConfig,
            "",
            "After TypeUI is connected, ask Cline for UI in plain language:",
            "",
            "Build me a landing page.",
            "",
            "Docs:",
            TYPEUI_DOCS_URL,
          ].join("\n");
        },
      }),
    );
  },
};

export default typeuiPlugin;

