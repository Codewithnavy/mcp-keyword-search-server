import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  TextContent,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { SearchEngine } from "./searchEngine";

const server = new Server({
  name: "keyword-search-server",
  version: "1.0.0",
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_keyword_in_file",
        description:
          "Search for a keyword in a specific file and return all matching lines with positions. Returns line numbers, content context, and exact match positions within each line.",
        inputSchema: {
          type: "object" as const,
          properties: {
            filePath: {
              type: "string",
              description:
                "Path to the file to search in (absolute or relative path)",
            },
            keyword: {
              type: "string",
              description: "Keyword or phrase to search for",
            },
            caseSensitive: {
              type: "boolean",
              description: "Whether search should be case-sensitive (default: false)",
              default: false,
            },
          },
          required: ["filePath", "keyword"],
        },
      } as Tool,
      {
        name: "search_keyword_in_directory",
        description:
          "Search for a keyword across multiple files in a directory. Scans all .txt, .log, and .md files and returns results only from files containing matches.",
        inputSchema: {
          type: "object" as const,
          properties: {
            dirPath: {
              type: "string",
              description: "Path to the directory to search in",
            },
            keyword: {
              type: "string",
              description: "Keyword or phrase to search for",
            },
            fileExtension: {
              type: "string",
              description:
                "Optional file extension filter (e.g., '.txt', '.log'). If not specified, searches all supported file types.",
              default: "",
            },
          },
          required: ["dirPath", "keyword"],
        },
      } as Tool,
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "search_keyword_in_file") {
      const result = SearchEngine.searchInFile(
        args.filePath as string,
        args.keyword as string,
        args.caseSensitive as boolean
      );
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          } as TextContent,
        ],
      };
    } else if (name === "search_keyword_in_directory") {
      const results = SearchEngine.searchInDirectory(
        args.dirPath as string,
        args.keyword as string,
        args.fileExtension as string
      );
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                totalFilesMatched: results.length,
                results,
              },
              null,
              2
            ),
          } as TextContent,
        ],
      };
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text" as const,
          text: `Error: ${errorMessage}`,
        } as TextContent,
      ],
      isError: true,
    };
  }
});

// Start server on stdio transport
async function main() {
  const { StdioServerTransport } = await import(
    "@modelcontextprotocol/sdk/server/stdio.js"
  );
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Keyword Search MCP Server started successfully");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
