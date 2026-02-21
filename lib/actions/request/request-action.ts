"use server";

import { acceptRequest, createRequest, getAllPendingRequests, getRequestById } from "@/lib/api/request/request";
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

export const handleGetAllPendingRequests = async ({
    page,
    size,
    search,
}: {
    page?: string;
    size?: string;
    search?: string;
}) => {
    try {
        const result = await getAllPendingRequests({
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
            message: result.message || "Fetch Pending requests failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Fetch Pending requests failed",
        };
    }
};

export const handleGetRequestById = async (id: string) => {
    try {
        const result = await getRequestById(id);
        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: "Fetched Request Successfully"
            }
        }
        return {
            success: false,
            message: "Failed to fetch Request"
        }
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Fetch request failed",
        };
    }
}

export const handleAcceptRequest = async (id: string) => {
    try {
        const result = await acceptRequest(id);
        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: "Accepted Request Successfully"
            }
        }
        return {
            success: false,
            message: "Failed to Accept Request"
        }
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Accpet request failed",
        };
    }
}