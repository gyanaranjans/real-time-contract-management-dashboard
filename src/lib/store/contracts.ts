import { create } from 'zustand'
import { Contract } from '@/types/contract'

interface ContractStore {
    contracts: Contract[]
    searchQuery: string
    statusFilter: string
    setContracts: (contracts: Contract[]) => void
    setSearchQuery: (query: string) => void
    setStatusFilter: (status: string) => void
    addContract: (contract: Contract) => void
    updateContract: (contract: Contract) => void
}

export const useContractStore = create<ContractStore>((set) => ({
    contracts: [],
    searchQuery: '',
    statusFilter: 'all',
    setContracts: (contracts) => set({ contracts }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setStatusFilter: (status) => set({ statusFilter: status }),
    addContract: (contract) =>
        set((state) => ({ contracts: [...state.contracts, contract] })),
    updateContract: (contract) =>
        set((state) => ({
            contracts: state.contracts.map((c) =>
                c.id === contract.id ? contract : c
            ),
        })),
}))