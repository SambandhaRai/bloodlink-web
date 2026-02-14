import z from "zod";

export const requestPasswordResetSchema = z.object({
    email: z.email()
});

export type RequestPasswordResetType = z.infer<typeof requestPasswordResetSchema>;