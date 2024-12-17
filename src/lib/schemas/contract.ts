import * as z from "zod";

export const contractSchema = z.object({
    id: z.string().optional(),
    clientName: z.string().min(1, "Client name is required"),
    value: z.number().min(0, "Value must be positive"),
    startDate: z.string(),
    endDate: z.string(),
    status: z.enum(["draft", "active", "pending", "expired"]),
    description: z.string().optional()
}).refine((data) => {
    return new Date(data.endDate) > new Date(data.startDate);
}, {
    message: "End date must be after start date",
    path: ["endDate"]
});

export type ContractFormData = z.infer<typeof contractSchema>;