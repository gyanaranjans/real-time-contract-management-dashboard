import { ContractList } from "@/components/contracts/ContractList";
import { SearchBar } from "@/components/contracts/SearchBar";
import { CreateContractButton } from "@/components/contracts/CreateContractButton";
import { ModeToggle } from "@/components/themeSwitcher";
import { Suspense } from "react";

export default function ContractsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Contracts</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your contracts
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <CreateContractButton />
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchBar />
        <ContractList />
      </Suspense>
    </div>
  );
}
