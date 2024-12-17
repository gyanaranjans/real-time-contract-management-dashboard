import { ServerWebSocket } from "bun";
import { Contract } from "./src/types/contract";
type ContractStatus = "draft" | "active" | "pending" | "expired";
const statuses: ContractStatus[] = ["active", "pending", "expired", "draft"];

// Mock contracts store
let mockContracts: Contract[] = Array.from({ length: 10 }, (_, i) => ({
  id: `CNT-${1000 + i}`,
  clientName: `Client ${i + 1}`,
  value: Math.floor(Math.random() * 100000),
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 31536000000).toISOString().split('T')[0],
  status: statuses[Math.floor(Math.random() * statuses.length)],
}));

interface WebSocketMessage {
  type: string;
  contract?: Contract;
  contracts?: Contract[];
}

const connectedClients = new Set<ServerWebSocket>();

const server = Bun.serve({
  port: 8000,
  fetch(req, server) {
    if (server.upgrade(req)) return;
    return new Response("Contract WebSocket Server");
  },
  websocket: {
    open(ws) {
      connectedClients.add(ws);
      console.log("Client connected");

      // Send initial contracts
      ws.send(JSON.stringify({
        type: "INITIAL_CONTRACTS",
        contracts: mockContracts
      }));

      // Start random status updates
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * mockContracts.length);
        const randomContract = mockContracts[randomIndex];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        if (randomContract.status !== randomStatus) {
          mockContracts[randomIndex] = {
            ...randomContract,
            status: randomStatus
          };

          const message: WebSocketMessage = {
            type: "STATUS_UPDATE",
            contract: {
              id: mockContracts[randomIndex].id,
              status: randomStatus
            }
          };

          connectedClients.forEach(client => {
            client.send(JSON.stringify(message));
          });
        }
      }, 3000);

      ws.data = { interval };
    },

    message(ws, message) {
      try {
        const data = JSON.parse(message.toString());
        console.log('Server received message:', data);

        switch (data.type) {
          case 'CONTRACT_CREATE':
            if (!data.contract.id) {
              console.error('Contract missing ID');
              return;
            }
            // Check for duplicate contract ID
            if (mockContracts.some(c => c.id === data.contract.id)) {
              console.error('Duplicate contract ID:', data.contract.id);
              return;
            }
            console.log('Creating new contract:', data.contract);
            mockContracts.push(data.contract);

            // Broadcast to all clients including sender
            connectedClients.forEach(client => {
              client.send(JSON.stringify({
                type: 'CONTRACT_CREATE',
                contract: data.contract
              }));
            });
            break;

          case 'CONTRACT_UPDATE':
            const index = mockContracts.findIndex(c => c.id === data.contract.id);
            if (index !== -1) {
              mockContracts[index] = data.contract;
              console.log('Contract updated:', data.contract);

              // Broadcast to all clients including sender
              connectedClients.forEach(client => {
                client.send(JSON.stringify({
                  type: 'CONTRACT_UPDATE',
                  contract: data.contract
                }));
              });
            }
            break;
        }
      } catch (error) {
        console.error('Server error:', error);
      }
    },

    close(ws) {
      connectedClients.delete(ws);
      if (ws.data?.interval) {
        clearInterval(ws.data.interval);
      }
      console.log("Client disconnected");
    }
  }
});

console.log(`WebSocket server running on http://localhost:${server.port}`);