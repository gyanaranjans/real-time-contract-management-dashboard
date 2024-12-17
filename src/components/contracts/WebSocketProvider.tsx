"use client";

import { useEffect } from "react";
import { useContractStore } from "@/lib/store/contracts";

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { setWebSocket, handleWebSocketMessage } = useContractStore();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");

    ws.addEventListener("open", () => {
      console.log("Connected to Bun WebSocket server");
      setWebSocket(ws);
    });

    ws.addEventListener("message", handleWebSocketMessage);

    ws.addEventListener("close", () => {
      console.log("Disconnected from Bun WebSocket server");
      setWebSocket(null);
    });

    return () => {
      ws.close();
    };
  }, [setWebSocket, handleWebSocketMessage]);

  return children;
}
