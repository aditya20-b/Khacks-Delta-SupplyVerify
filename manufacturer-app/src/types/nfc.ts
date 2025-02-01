export interface NFCRecord {
  recordType: string;
  mediaType?: string;
  data: any;
  id: string;
}

export interface NDEFReadingEvent {
  serialNumber: string;
  message: {
    records: {
      recordType: string;
      mediaType?: string;
      data: ArrayBuffer;
      encoding?: string;
    }[];
  };
}

// Declaring the NDEFReader API types
declare global {
  interface Window {
    NDEFReader: any;
  }
} 