"use client";

import { useContractStore } from "@/lib/store/contracts";
import { Contract } from "@/types/contract";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { createPortal } from "react-dom";

interface ContractModalProps {
  contract?: Contract;
  isOpen: boolean;
  onClose: () => void;
}

// let contractCounter = 1000;

export function ContractModal({
  contract,
  isOpen,
  onClose,
}: ContractModalProps) {
  const { addContract, updateContract, getNextId } = useContractStore();
  const [formData, setFormData] = useState<Partial<Contract>>(
    contract || {
      id: getNextId(),
      status: "draft",
      value: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 31536000000).toISOString().split("T")[0],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contract) {
      updateContract(formData as Contract);
    } else {
      addContract({
        ...formData,
        id: getNextId(),
      } as Contract);
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
        <div className="bg-background p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            {contract ? "Edit Contract" : "Create New Contract"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Client Name</label>
              <Input
                value={formData.clientName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Value ($)</label>
              <Input
                type="number"
                value={formData.value || ""}
                onChange={(e) =>
                  setFormData({ ...formData, value: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <DatePicker
                date={
                  formData.startDate ? new Date(formData.startDate) : undefined
                }
                onSelect={(date) =>
                  setFormData({
                    ...formData,
                    startDate: date
                      ? date.toISOString().split("T")[0]
                      : undefined,
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <DatePicker
                date={formData.endDate ? new Date(formData.endDate) : undefined}
                onSelect={(date) =>
                  setFormData({
                    ...formData,
                    endDate: date
                      ? date.toISOString().split("T")[0]
                      : undefined,
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as Contract["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
