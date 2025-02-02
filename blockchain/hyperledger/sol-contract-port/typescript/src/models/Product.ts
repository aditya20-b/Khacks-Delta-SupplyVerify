export interface Product {
    id: string;
    name: string;
    manufacturer: string;
    status: ProductStatus;
    location: string;
    trackingEvents: TrackingEvent[];
  }
  
  export enum ProductStatus {
    Created = 0,
    InTransit = 1,
    Delivered = 2,
  }
  
  export interface TrackingEvent {
    timestamp: number;
    location: string;
    data: string;
    participant: string;
  }