export type ContractStatus = 'draft' | 'active' | 'expired' | 'pending';

export interface Contract {
    id: string;
    clientName: string;
    status: ContractStatus;
    startDate: string;
    endDate: string;
    value: number;
    description: string;
}