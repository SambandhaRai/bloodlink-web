import z from "zod";

export const loginSchema = z.object({
    email: z.email( {message: "Invalid email address"} ),
    password: z.string().min(6, "Password should be atleast 6 characters"),
});
export type LoginType = z.infer<typeof loginSchema>;