import { Contract } from '@/types/contract';

export const mockContracts: Contract[] = [
    {
        id: 'CNT-001',
        clientName: 'Acme Corporation',
        status: 'active',
        startDate: '2024-03-01',
        endDate: '2025-03-01',
        value: 50000,
        description: 'Annual software license agreement'
    },
    {
        id: 'CNT-002',
        clientName: 'TechStart Inc',
        status: 'draft',
        startDate: '2024-04-01',
        endDate: '2024-12-31',
        value: 25000,
        description: 'Consulting services contract'
    },
    {
        id: 'CNT-003',
        clientName: 'Global Industries',
        status: 'pending',
        startDate: '2024-05-01',
        endDate: '2025-05-01',
        value: 75000,
        description: 'Enterprise solution implementation'
    }
];