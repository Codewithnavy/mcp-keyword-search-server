"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const searchEngine_js_1 = require("./searchEngine.js");
const server = new index_js_1.Server({
    name: "keyword-search-server",
    version: "1.0.0",
});
// List available tools
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "search_keyword_in_file",
                description: "Search for a keyword in a specific file and return all matching lines with positions. Returns line numbers, content context, and exact match positions within each line.",
                inputSchema: {
                    type: "object",
                    properties: {
                        filePath: {
                            type: "string",
                            description: "Path to the file to search in (absolute or relative path)",
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
            },
            {
                name: "search_keyword_in_directory",
                description: "Search for a keyword across multiple files in a directory. Scans all .txt, .log, and .md files and returns results only from files containing matches.",
                inputSchema: {
                    type: "object",
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
                            description: "Optional file extension filter (e.g., '.txt', '.log'). If not specified, searches all supported file types.",
                            default: "",
                        },
                    },
                    required: ["dirPath", "keyword"],
                },
            },
        ],
    };
});
// Handle tool execution
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        if (name === "search_keyword_in_file") {
            const result = searchEngine_js_1.SearchEngine.searchInFile(args.filePath, args.keyword, args.caseSensitive);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        }
        else if (name === "search_keyword_in_directory") {
            const results = searchEngine_js_1.SearchEngine.searchInDirectory(args.dirPath, args.keyword, args.fileExtension);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            totalFilesMatched: results.length,
                            results,
                        }, null, 2),
                    },
                ],
            };
        }
        else {
            throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${errorMessage}`,
                },
            ],
            isError: true,
        };
    }
});
// Start server on stdio transport
async function main() {
    const { StdioServerTransport } = await Promise.resolve().then(() => __importStar(require("@modelcontextprotocol/sdk/server/stdio.js")));
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Keyword Search MCP Server started successfully");
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map