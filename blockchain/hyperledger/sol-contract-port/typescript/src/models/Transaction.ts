export interface Transaction {
    id: string;
    type: TransactionType;
    proposer: string;
    data: string;
    approvals: { [mspId: string]: boolean };
    approvalCount: number;
    executed: boolean;
  }
  
  export enum TransactionType {
    UpdateProduct = 0,
    AddParticipant = 1,
  }