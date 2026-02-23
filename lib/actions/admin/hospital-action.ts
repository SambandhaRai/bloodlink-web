"use server";

import { addHospital, updateHospital } from "@/lib/api/admin/hospital";
import { revalidatePath } from "next/cache";

export const handleAddHospital = async (formData: any) => {
    try {
        const result = await addHospital(formData);

        if (result.success) {
            revalidatePath("/admin/hospitals");

            return {
                success: true as const,
                data: result.data,
                message: result.message || "Added hospital successfully",
            };
        }

        return {
            success: false as const,
            message: result.message || "Failed to add hospital",
        };
    } catch (err: Error | any) {
        return {
            success: false as const,
            message: err.message || "Failed to add hospital",
        };
    }
};

export const handleUpdateHospital = async (id: string, formData: any) => {
    try {
        const result = await updateHospital(id, formData);

        if (result.success) {
            revalidatePath("/admin/hospitals");
            revalidatePath(`/admin/hospitals/${id}`);

            return {
                success: true as const,
                data: result.data,
                message: result.message || "Updated hospital successfully",
            };
        }

        return {
            success: false as const,
            message: result.message || "Failed to update hospital",
        };
    } catch (err: Error | any) {
        return {
            success: false as const,
            message: err.message || "Failed to update hospital",
        };
    }
};