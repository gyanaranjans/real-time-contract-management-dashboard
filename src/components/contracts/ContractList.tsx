"use client";

import { useContractStore } from "@/lib/store/contracts";
import { ContractRow } from "./ContractRow";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ContractList() {
  const { contracts, searchQuery, statusFilter } = useContractStore();

  const filteredContracts =
    contracts?.filter((contract) => {
      if (!contract) return false;
      const matchesSearch = contract.clientName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || contract.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) ?? [];

  if (!contracts?.length) {
    return <div>No contracts found</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contract ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContracts.map((contract) => (
            <ContractRow key={contract.id} contract={contract} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
