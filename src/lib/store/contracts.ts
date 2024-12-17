import { create } from 'zustand'
import { Contract, ContractStatus } from '@/types/contract'

interface ContractStore {
  contracts: Contract[]
  searchQuery: string
  statusFilter: string
  lastId: number
  setContracts: (contracts: Contract[]) => void
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  addContract: (contract: Contract) => void
  updateContract: (contract: Contract) => void
  getNextId: () => string
}

export const useContractStore = create<ContractStore>((set, get) => ({
  contracts: [],
  searchQuery: '',
  statusFilter: 'all',
  lastId: 1000,
  setContracts: (contracts) => set({ contracts }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  getNextId: () => {
    const nextId = get().lastId + 1;
    return `CNT-${nextId}`;
  },
  addContract: (contract) =>
    set((state) => {
      const nextId = state.lastId + 1;
      return {
        contracts: [...state.contracts, { ...contract, id: `CNT-${nextId}` }],
        lastId: nextId
      };
    }),
  updateContract: (contract) =>
    set((state) => ({
      contracts: state.contracts.map((c) =>
        c.id === contract.id ? { ...contract } : c
      ),
    })),
}));