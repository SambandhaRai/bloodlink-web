import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(2, "Full name should be more than 2 characters").optional(),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .optional(),
  dob: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Invalid date"),

  gender: z.string().trim().optional(),
  bloodId: z.string().trim().optional(),
  healthCondition: z.string().optional(),
  email: z.email().optional(),
  password: z.string().trim().min(6, "Password can't be less than 6 characters").optional(),
  profilePicture: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, { message: "Max file size is 5MB" })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported",
    }),
});

export type UpdateUserType = z.infer<typeof updateUserSchema>;
