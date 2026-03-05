import z from "zod";

export const bloodGroupSchema = z.object({
    _id: z.string().optional(),
    bloodGroup: z.string().optional(),
});

export const userSchema = z.object({
    _id: z.string(),

    fullName: z.string().trim().min(1).optional(),
    dob: z.string().optional(),
    phoneNumber: z.string().optional(),

    gender: z.enum(["male", "female", "other"]).optional(),

    bloodId: z.union([z.string(), bloodGroupSchema]).optional().nullable(),

    healthConditions: z.string().max(300).optional().nullable(),
    email: z.email().optional(),

    profilePicture: z.string().optional().nullable(),

    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type UserType = z.infer<typeof userSchema>;