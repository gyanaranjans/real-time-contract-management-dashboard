export type ContractStatus = 'draft' | 'active' | 'expired' | 'pending';

export interface Contract {
    id: string;
    clientName: string;
    value: number;
    startDate: string;
    endDate: string;
    status: "draft" | "active" | "pending" | "expired";
}

export type NewContractData = Omit<Contract, 'id'>;