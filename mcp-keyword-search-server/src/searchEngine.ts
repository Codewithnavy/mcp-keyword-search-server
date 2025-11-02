import * as fs from "fs";
import * as path from "path";
import { SearchResult, LineMatch } from "./types";

export class SearchEngine {
  /**
   * Search for keyword in a single file
   * @param filePath - Absolute or relative path to file
   * @param keyword - Keyword to search for
   * @param caseSensitive - Case sensitivity flag
   * @returns SearchResult with matches and metadata
   */
  static searchInFile(
    filePath: string,
    keyword: string,
    caseSensitive: boolean = false
  ): SearchResult {
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
    const lineMatches: LineMatch[] = [];
    let totalCount = 0;

    lines.forEach((line, lineNumber) => {
      const compareLine = caseSensitive ? line : line.toLowerCase();
      const matchPositions: number[] = [];
      let startIndex = 0;

      // Find all occurrences in line
      while (true) {
        const index = compareLine.indexOf(searchKeyword, startIndex);
        if (index === -1) break;

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
  static searchInDirectory(
    dirPath: string,
    keyword: string,
    fileExtension: string = ""
  ): SearchResult[] {
    const absolutePath = path.resolve(dirPath);

    // Validate directory
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Directory not found: ${dirPath}`);
    }

    const stat = fs.statSync(absolutePath);
    if (!stat.isDirectory()) {
      throw new Error(`Path is not a directory: ${dirPath}`);
    }

    const results: SearchResult[] = [];
    const files = fs.readdirSync(absolutePath);

    for (const file of files) {
      const filePath = path.join(absolutePath, file);

      try {
        const fileStat = fs.statSync(filePath);

        // Skip directories and binary files
        if (fileStat.isDirectory()) continue;
        if (
          !file.endsWith(".txt") &&
          !file.endsWith(".log") &&
          !file.endsWith(".md")
        ) {
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
      } catch (error) {
        // Skip files that can't be read - continue scanning
        continue;
      }
    }

    return results;
  }
}
