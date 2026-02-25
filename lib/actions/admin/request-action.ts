"use server";

import { getUserRequestHistoryAdmin } from "@/lib/api/admin/request";

export async function handleGetUserRequestHistoryAdmin(id: string) {
    try {
        const response = await getUserRequestHistoryAdmin(id);

        if (response.success) {
            return {
                success: true,
                data: response.data,
                message:
                    response.message ||
                    "Fetched user request history successfully",
            };
        }

        return {
            success: false,
            message: response.message || "Failed to fetch user request history",
        };
    } catch (err: Error | any) {
        throw new Error(
            err.message || "Failed to fetch user request history"
        );
    }
}