"use server";

import { createRequest, getAllRequests } from "@/lib/api/request/request";
import { revalidatePath } from "next/cache";

export const handleCreateRequest = async (requestData: any) => {
    try {
        const result = await createRequest(requestData);

        if (result.success) {
            // Revalidate request-related pages
            revalidatePath("/user/requests");
            revalidatePath("/user/home"); // if shown on home/dashboard

            return {
                success: true,
                message: "Request created successfully",
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Create request failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Create request failed",
        };
    }
};

export const handleGetAllRequests = async ({
    page,
    size,
    search,
}: {
    page?: string;
    size?: string;
    search?: string;
}) => {
    try {
        const result = await getAllRequests({
            page: page ? parseInt(page) : undefined,
            size: size ? parseInt(size) : undefined,
            search,
        });

        if (result.success) {
            return {
                success: true,
                data: result.data,
                pagination: result.pagination,
            };
        }

        return {
            success: false,
            message: result.message || "Fetch requests failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Fetch requests failed",
        };
    }
};
