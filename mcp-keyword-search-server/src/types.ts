export interface SearchResult {
  found: boolean;
  count: number;
  lineMatches: LineMatch[];
  fileName: string;
  filePath: string;
  totalLines: number;
}

export interface LineMatch {
  lineNumber: number;
  content: string;
  matchPositions: number[];
}

export interface DirectorySearchResult {
  totalFilesMatched: number;
  results: SearchResult[];
}
