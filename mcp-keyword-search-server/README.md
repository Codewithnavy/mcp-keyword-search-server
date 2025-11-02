# Keyword Search MCP Server

A Model Context Protocol (MCP) server that enables keyword searching within files and directories. Built with TypeScript for robust, type-safe file operations.

## Overview

This MCP server provides Claude and other AI models with the ability to search for keywords in files, useful for:
- Analyzing log files for errors or patterns
- Searching through documentation
- Finding specific code patterns in text files
- Extracting relevant information from large documents

## Features

- **Single File Search**: Search for keywords in a specific file with line-level precision
- **Directory Search**: Batch search across multiple files
- **Match Metadata**: Get exact match positions, line numbers, and context
- **Case Control**: Optional case-sensitive searching
- **Error Handling**: Graceful error messages for missing files or invalid paths
- **Security**: Path traversal attack prevention

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

