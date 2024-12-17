"use client";

import { Contract } from "@/types/contract";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ContractModal } from "./ContractModal";

export function ContractRow({ contract }: { contract: Contract }) {
  const [isEditing, setIsEditing] = useState(false);

  // Ensure values exist before rendering
  const value = contract?.value ?? 0;
  const status = contract?.status ?? "pending";
  const startDate = contract?.startDate ?? "";
  const endDate = contract?.endDate ?? "";

  return (
    <>
      <TableRow>
        <TableCell>{contract?.id}</TableCell>
        <TableCell>{contract?.clientName}</TableCell>
        <TableCell>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : status === "draft"
                ? "bg-gray-100 text-gray-800"
                : status === "expired"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {status}
          </span>
        </TableCell>
        <TableCell>{startDate}</TableCell>
        <TableCell>{endDate}</TableCell>
        <TableCell>${value.toLocaleString()}</TableCell>
        <TableCell>
          <Button variant="ghost" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        </TableCell>
      </TableRow>
      {isEditing && (
        <ContractModal
          contract={contract}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}
