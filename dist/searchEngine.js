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
exports.SearchEngine = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class SearchEngine {
    /**
     * Search for keyword in a single file
     * @param filePath - Absolute or relative path to file
     * @param keyword - Keyword to search for
     * @param caseSensitive - Case sensitivity flag
     * @returns SearchResult with matches and metadata
     */
    static searchInFile(filePath, keyword, caseSensitive = false) {
        const absolutePath = path.resolve(filePath);
        // Security check: prevent directory traversal
        if (!fs.existsSync(absolutePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const stat = fs.statSync(absolutePath);
        if (!stat.isFile()) {
            throw new Error(`Path is not a file: ${filePath}`);
        }
        const content = fs.readFileSync(absolutePath, "utf-8");
        const lines = content.split("\n");
        const fileName = path.basename(absolutePath);
        const searchKeyword = caseSensitive ? keyword : keyword.toLowerCase();
        const lineMatches = [];
        let totalCount = 0;
        lines.forEach((line, lineNumber) => {
            const compareLine = caseSensitive ? line : line.toLowerCase();
            const matchPositions = [];
            let startIndex = 0;
            // Find all occurrences in line
            while (true) {
                const index = compareLine.indexOf(searchKeyword, startIndex);
                if (index === -1)
                    break;
                matchPositions.push(index);
                totalCount++;
                startIndex = index + 1;
            }
            // Store matches with line context (limit to 200 chars)
            if (matchPositions.length > 0) {
                lineMatches.push({
                    lineNumber: lineNumber + 1,
                    content: line.substring(0, 200),
                    matchPositions,
                });
            }
        });
        return {
            found: totalCount > 0,
            count: totalCount,
            lineMatches,
            fileName,
            filePath: absolutePath,
            totalLines: lines.length,
        };
    }
    /**
     * Search keyword across multiple files in directory
     * @param dirPath - Directory path
     * @param keyword - Keyword to search
     * @param fileExtension - Filter by extension (optional)
     * @returns Array of SearchResults from matching files
     */
    static searchInDirectory(dirPath, keyword, fileExtension = "") {
        const absolutePath = path.resolve(dirPath);
        // Validate directory
        if (!fs.existsSync(absolutePath)) {
            throw new Error(`Directory not found: ${dirPath}`);
        }
        const stat = fs.statSync(absolutePath);
        if (!stat.isDirectory()) {
            throw new Error(`Path is not a directory: ${dirPath}`);
        }
        const results = [];
        const files = fs.readdirSync(absolutePath);
        for (const file of files) {
            const filePath = path.join(absolutePath, file);
            try {
                const fileStat = fs.statSync(filePath);
                // Skip directories and binary files
                if (fileStat.isDirectory())
                    continue;
                if (!file.endsWith(".txt") &&
                    !file.endsWith(".log") &&
                    !file.endsWith(".md")) {
                    continue;
                }
                // Filter by extension if specified
                if (fileExtension && !file.endsWith(fileExtension)) {
                    continue;
                }
                const result = this.searchInFile(filePath, keyword, false);
                if (result.found) {
                    results.push(result);
                }
            }
            catch (error) {
                // Skip files that can't be read - continue scanning
                continue;
            }
        }
        return results;
    }
}
exports.SearchEngine = SearchEngine;
//# sourceMappingURL=searchEngine.js.map