```markdown
# Keyword Search MCP Server

A Model Context Protocol (MCP) server that enables intelligent keyword searching within files and directories. Built with TypeScript for robust, type-safe file operations.

## Overview

This MCP server provides Claude and other AI models with the ability to search for keywords in files with precision. Perfect for analyzing logs, searching documentation, and extracting relevant information from large text files.

### Use Cases

- Analyzing log files for errors or patterns
- Searching through documentation and knowledge bases
- Finding specific code patterns in text files
- Extracting relevant information from large documents
- Log analysis for debugging and monitoring

## Features

- Single File Search: Search for keywords with line-level precision
- Directory Search: Batch search across multiple files
- Match Metadata: Get exact match positions, line numbers, and context
- Case Control: Optional case-sensitive searching
- Error Handling: Graceful error messages for missing files or invalid paths
- Security: Path traversal attack prevention
- Performance: Efficient file streaming and memory management

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```
# Clone repository
git clone https://github.com/Codewithnavy/mcp-keyword-search-server.git
cd mcp-keyword-search-server

# Install dependencies
npm install

# Build TypeScript
npm run build
```

## Usage

### Starting the Server

```
# Production
npm start

# Development with live reloading
npm run dev
```

Output should show:
```
Keyword Search MCP Server started successfully
```

## Available Tools

### 1. search_keyword_in_file

Search for a keyword in a specific file and get all matching lines with positions.

**Parameters:**
- `filePath` (string, required): Path to file (absolute or relative)
- `keyword` (string, required): Keyword to search for
- `caseSensitive` (boolean, optional): Case-sensitive search (default: false)

**Example Input:**
```
{
  "filePath": "test-data/log.log",
  "keyword": "ERROR",
  "caseSensitive": true
}
```

**Example Output:**
```
{
  "found": true,
  "count": 3,
  "lineMatches": [
    {
      "lineNumber": 1,
      "content": "[2025-11-02 08:00:00] ERROR: Database connection failed",
      "matchPositions": 
    },
    {
      "lineNumber": 3,
      "content": "[2025-11-02 08:00:10] ERROR: Max retries exceeded",
      "matchPositions": 
    }
  ],
  "fileName": "log.log",
  "filePath": "/absolute/path/to/test-data/log.log",
  "totalLines": 6
}
```

### 2. search_keyword_in_directory

Search for a keyword across multiple files in a directory.

**Parameters:**
- `dirPath` (string, required): Directory path to search in
- `keyword` (string, required): Keyword to search for
- `fileExtension` (string, optional): Filter by extension (e.g., '.txt', '.log')

**Example Input:**
```
{
  "dirPath": "test-data",
  "keyword": "search",
  "fileExtension": ".txt"
}
```

**Example Output:**
```
{
  "totalFilesMatched": 1,
  "results": [
    {
      "found": true,
      "count": 4,
      "lineMatches": [...],
      "fileName": "sample.txt",
      "filePath": "/absolute/path/to/test-data/sample.txt",
      "totalLines": 7
    }
  ]
}
```

## Testing with MCP Inspector

MCP Inspector provides a web-based debugging interface for testing tools interactively.

```
# Install globally (one-time)
npm install -g @modelcontextprotocol/inspector

# Run server with inspector
mcp-inspector tsx src/index.ts

# Opens http://localhost:5173
```

### Test Workflow

1. Open http://localhost:5173 in browser
2. Select tool from dropdown
3. Enter parameters in JSON format
4. Click "Send Request"
5. View results in real-time

## Project Structure

```
mcp-keyword-search-server/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── searchEngine.ts       # Core search logic
│   └── types.ts              # TypeScript interfaces
├── test-data/
│   ├── sample.txt            # Test file with search examples
│   └── log.log               # Test log file with ERROR entries
├── dist/                     # Compiled JavaScript (generated)
├── node_modules/             # Dependencies (generated)
├── package.json              # Project configuration
├── tsconfig.json             # TypeScript configuration
├── README.md                 # This file
└── .gitignore                # Git ignore rules
```

## Development

### Build

```
npm run build
```

Compiles TypeScript to JavaScript in `dist/` directory.

### Run Tests

```
npm test
```

## Security Considerations

- **Path Traversal Prevention**: Validates file paths to prevent directory traversal attacks
- **File Type Restrictions**: Only searches .txt, .log, and .md files in directory mode
- **File Validation**: Checks file existence before reading
- **Content Limits**: Truncates line content to 200 characters for memory efficiency
- **Error Handling**: Returns specific error messages without exposing system details

## Performance

- **Single File Search**: O(n) where n = file size
- **Directory Search**: O(m*n) where m = number of files, n = average file size
- **Memory Efficient**: Streams files without loading entire contents into memory
- **Supports**: Files up to system memory limits

## Error Handling

The server returns detailed error messages for:
- File not found errors
- Permission denied errors
- Invalid path errors
- Missing required arguments
- Type validation errors

## Contributing

Improvements and contributions are welcome! Areas for enhancement:
- [ ] Regex pattern support
- [ ] Multi-keyword search
- [ ] Results caching
- [ ] Streaming output for large results
- [ ] File modification date filtering

## Technical Stack

- **Language**: TypeScript
- **Protocol**: Model Context Protocol (MCP)
- **Runtime**: Node.js 18+
- **Key Dependencies**:
  - @modelcontextprotocol/sdk - MCP protocol implementation
  - TypeScript - Type-safe development
  - tsx - ES module support for TypeScript

## Related Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [MCP Inspector Guide](https://modelcontextprotocol.io/docs/tools/inspector)
- [TypeScript Documentation](https://www.typescriptlang.org)

---

**Last Updated**: November 2, 2025
