"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ContractModal } from "./ContractModal";

export function CreateContractButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create New Contract</Button>
      <ContractModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
