import { SearchResult } from "./types";
export declare class SearchEngine {
    /**
     * Search for keyword in a single file
     * @param filePath - Absolute or relative path to file
     * @param keyword - Keyword to search for
     * @param caseSensitive - Case sensitivity flag
     * @returns SearchResult with matches and metadata
     */
    static searchInFile(filePath: string, keyword: string, caseSensitive?: boolean): SearchResult;
    /**
     * Search keyword across multiple files in directory
     * @param dirPath - Directory path
     * @param keyword - Keyword to search
     * @param fileExtension - Filter by extension (optional)
     * @returns Array of SearchResults from matching files
     */
    static searchInDirectory(dirPath: string, keyword: string, fileExtension?: string): SearchResult[];
}
//# sourceMappingURL=searchEngine.d.ts.map