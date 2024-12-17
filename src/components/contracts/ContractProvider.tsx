"use client";

import { createContext, useEffect, useState } from "react";
import { useContractStore } from "@/lib/store/contracts";
import { mockContracts } from "@/lib/mock/contracts";

export const ContractContext = createContext({});

export function ContractProvider({ children }: { children: React.ReactNode }) {
  const { setContracts } = useContractStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with minimal delay
    const timer = setTimeout(() => {
      setContracts(mockContracts);
      setIsLoading(false);
    }, 100);

    return () => {
      clearTimeout(timer);
      setContracts([]);
    };
  }, [setContracts]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
