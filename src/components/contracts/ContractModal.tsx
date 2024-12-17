"use client";

import { useContractStore } from "@/lib/store/contracts";
import { Contract } from "@/types/contract";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contractSchema, ContractFormData } from "@/lib/schemas/contract";

interface ContractModalProps {
  contract?: Contract;
  isOpen: boolean;
  onClose: () => void;
}

export function ContractModal({
  contract,
  isOpen,
  onClose,
}: ContractModalProps) {
  const { addContract, updateContract, getNextId } = useContractStore();

  const defaultValues = contract || {
    id: getNextId(),
    status: "draft",
    value: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 31536000000).toISOString().split("T")[0],
    clientName: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues,
  });

  const onSubmit = (data: ContractFormData) => {
    if (contract) {
      updateContract(data as Contract);
    } else {
      addContract({
        ...data,
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Client Name</label>
              <Input {...register("clientName")} />
              {errors.clientName && (
                <p className="text-sm text-red-500">
                  {errors.clientName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Value ($)</label>
              <Input
                type="number"
                {...register("value", { valueAsNumber: true })}
              />
              {errors.value && (
                <p className="text-sm text-red-500">{errors.value.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Start Date</label>
              <DatePicker
                date={
                  watch("startDate") ? new Date(watch("startDate")) : undefined
                }
                onSelect={(date) =>
                  setValue(
                    "startDate",
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">End Date</label>
              <DatePicker
                date={watch("endDate") ? new Date(watch("endDate")) : undefined}
                onSelect={(date) =>
                  setValue(
                    "endDate",
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <Select
                value={watch("status")}
                onValueChange={(value) =>
                  setValue("status", value as Contract["status"])
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
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
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
