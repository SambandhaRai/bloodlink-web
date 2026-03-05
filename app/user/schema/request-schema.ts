import z from "zod";

export const requestSchema = z.object({
    recipientBloodId: z.string().min(1, "Select blood type"),
    recipientDetails: z.string().min(1, "Recipient details required"),
    recipientCondition: z.enum(["critical", "urgent", "stable"], {
        message: "Select condition",
    }),
    hospitalId: z.string().min(1, "Select hospital"),

    requestFor: z.enum(["self", "others"]),
    relationToPatient: z.string().trim().min(2, "Relation is required").optional(),
    patientName: z.string().trim().min(2, "Patient name is required").optional(),
    patientPhone: z.string().trim().min(6, "Patient phone is required").optional(),
})
    .superRefine((data, ctx) => {
        if (data.requestFor === "others") {
            if (!data.relationToPatient) {
                ctx.addIssue({ code: "custom", path: ["relationToPatient"], message: "Relation is required" });
            }
            if (!data.patientName) {
                ctx.addIssue({ code: "custom", path: ["patientName"], message: "Patient name is required" });
            }
            if (!data.patientPhone) {
                ctx.addIssue({ code: "custom", path: ["patientPhone"], message: "Patient phone is required" });
            }
        }
    });

export type RequestType = z.infer<typeof requestSchema>;