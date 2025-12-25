import z from "zod";

export const registerSchema = z.object(
    {
        fullName: z.string().trim().min(2, "Full name is required").max(60, "Full Name is too long"),
        dob: z.string().min(1, "Date of Birth is required").refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date of birth"),
        gender: z.enum(["male", "female", "other"] as const, { message: "Please select your gender" }),
        bloodGroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const, { message: "Please select your blood group" }),
        healthConditions: z.string().max(300, "Maximum 300 characters").optional(),
        email: z.email( {message: "Invalid email address"} ),
        password: z.string().min(6, "Password should be atleast 6 characters"),
        confirmPassword: z.string().min(6, { message: "Minimum 6 characters" }),
    }
).refine(
    (v) => v.password === v.confirmPassword, {
            path: ["confirmPassword"],
            message: "Passwords do not match",
        }
);
export type RegisterType = z.infer<typeof registerSchema>;