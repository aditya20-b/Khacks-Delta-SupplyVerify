export type ContentBlockType = 
  | 'constant'    // A fixed value like product code
  | 'year'        // Manufacturing year
  | 'month'       // Manufacturing month
  | 'day'         // Manufacturing day
  | 'counter';    // An auto-incrementing number

export interface ContentBlock {
  type: ContentBlockType;
  value: string;  // For constant type, stores the actual value
  length?: number; // For counter, year - number of digits
}

export interface DelimiterBlock {
  type: 'delimiter';
  value: string;
}

export type SchemaBlock = ContentBlock | DelimiterBlock;

export interface SchemaStorage {
  blocks: SchemaBlock[];
  counters: Record<string, number>;  // Maps counter position to its latest value
  description?: string;  // Optional description of what this schema is for
}

export interface SchemaMap {
  [key: string]: SchemaStorage;
} 