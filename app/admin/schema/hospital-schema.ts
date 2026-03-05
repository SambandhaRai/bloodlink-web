import z from "zod";

export const hospitalSchema = z.object({
    name: z.string().trim().min(2, "Hospital name must be at least 2 characters"),

    lng: z
        .number()
        .refine((v) => Number.isFinite(v), "Longitude is required")
        .min(-180, "Invalid longitude")
        .max(180, "Invalid longitude"),

    lat: z
        .number()
        .refine((v) => Number.isFinite(v), "Latitude is required")
        .min(-90, "Invalid latitude")
        .max(90, "Invalid latitude"),
});

export type HospitalType = z.infer<typeof hospitalSchema>;