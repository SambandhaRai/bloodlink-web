import z from "zod";

export const resetPasswordSchema = z.object({
    password: z.string().min(6, "Password should be atleast 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password should be atleast 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
});

export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;