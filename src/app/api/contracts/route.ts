import { NextApiRequest, NextApiResponse } from "next";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

const connectedClients = new Set<WebSocket>();

const statuses = ["draft", "active", "expired", "pending"];

function getRandomStatus() {
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function sendRandomUpdate() {
  const randomUpdate = {
    type: "CONTRACT_UPDATE",
    data: {
      id: `CNT-00${Math.floor(Math.random() * 3) + 1}`,
      status: getRandomStatus(),
    },
  };

  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(randomUpdate));
    }
  });
}

wss.on("connection", (ws) => {
  connectedClients.add(ws);
  // Send random updates every 5 seconds
  const interval = setInterval(sendRandomUpdate, 5000);

  ws.on("close", () => {
    connectedClients.delete(ws);
    clearInterval(interval);
  });

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    // Broadcast the update to all connected clients except sender
    connectedClients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    if (!res.socket.server.wss) {
      res.socket.server.wss = wss;
      res.socket.server.on("upgrade", (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request);
        });
      });
    }
    res.status(200).end();
  } else {
    res.status(405).end();
  }
}
