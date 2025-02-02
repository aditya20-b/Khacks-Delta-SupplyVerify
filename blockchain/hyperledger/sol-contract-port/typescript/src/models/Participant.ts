export interface Participant {
    id: string;
    name: string;
    type: ParticipantType;
  }
  
  export enum ParticipantType {
    Manufacturer = 0,
    Distributor = 1,
    Retailer = 2,
  }