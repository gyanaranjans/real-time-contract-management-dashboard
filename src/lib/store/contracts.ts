import { create } from 'zustand';
import { Contract, NewContractData } from '@/types/contract';

interface ContractStore {
  contracts: Contract[];
  searchQuery: string;
  statusFilter: string;
  lastId: number;
  websocket: WebSocket | null;
  setContracts: (contracts: Contract[]) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  addContract: (contract: NewContractData) => void;
  updateContract: (contract: Contract) => void;
  getNextId: () => string;
  setWebSocket: (ws: WebSocket | null) => void;
  handleWebSocketMessage: (event: MessageEvent) => void;
}

export const useContractStore = create<ContractStore>((set, get) => ({
  contracts: [],
  searchQuery: '',
  statusFilter: 'all',
  lastId: 1000,
  websocket: null,
  setContracts: (contracts) => set({ contracts }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  getNextId: () => {
    const { contracts } = get();
    const existingIds = new Set(contracts.map(c => c.id));
    let nextId = 1000;

    while (existingIds.has(`CNT-${nextId}`)) {
      nextId++;
    }

    return `CNT-${nextId}`;
  },
  setWebSocket: (ws) => set({ websocket: ws }),
  addContract: (contract) => {
    const { contracts } = get();
    const nextId = get().getNextId();

    // Check if ID already exists
    if (contracts.some(c => c.id === nextId)) {
      console.error('Duplicate contract ID detected');
      throw new Error('Contract ID already exists');
    }

    const newContract: Contract = {
      ...contract,
      id: nextId,
      status: contract.status || 'draft',
      value: Number(contract.value) || 0,
      startDate: contract.startDate || new Date().toISOString().split('T')[0],
      endDate: contract.endDate || new Date(Date.now() + 31536000000).toISOString().split('T')[0],
    };

    console.log('Creating new contract:', newContract);

    // Update local state
    set((state) => ({
      contracts: [...state.contracts, newContract]
    }));

    // Broadcast via WebSocket
    const ws = get().websocket;
    if (ws?.readyState === WebSocket.OPEN) {
      const message = {
        type: 'CONTRACT_CREATE',
        contract: newContract
      };
      console.log('Sending WebSocket message:', message);
      ws.send(JSON.stringify(message));
    }

    return newContract;
  },
  updateContract: (contract) => {
    console.log('Updating contract:', contract);
    set((state) => ({
      contracts: state.contracts.map((c) =>
        c.id === contract.id ? contract : c
      ),
    }));

    const ws = get().websocket;
    if (ws?.readyState === WebSocket.OPEN) {
      const message = { type: 'CONTRACT_UPDATE', contract: contract };
      console.log('Sending websocket message:', message);
      ws.send(JSON.stringify(message));
    }
  },
  handleWebSocketMessage: (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received websocket message:', data);

      switch (data.type) {
        case 'INITIAL_CONTRACTS':
          set({ contracts: data.contracts });
          break;
        case 'CONTRACT_CREATE':
          set((state) => {
            if (state.contracts.some(c => c.id === data.contract.id)) {
              return state; // Don't add if already exists
            }
            return {
              contracts: [...state.contracts, data.contract]
            };
          });
          break;
        case 'CONTRACT_UPDATE':
          set((state) => ({
            contracts: state.contracts.map((c) =>
              c.id === data.contract.id ? data.contract : c
            ),
          }));
          break;
        case 'STATUS_UPDATE':
          set((state) => ({
            contracts: state.contracts.map((c) =>
              c.id === data.contract.id
                ? { ...c, status: data.contract.status }
                : c
            ),
          }));
          break;
      }
    } catch (error) {
      console.error('Error handling websocket message:', error);
    }
  }
}));