"use server";

import { acceptRequest, createRequest, finishRequest, getAllPendingRequests, getMatchedRequests, getRequestById, getUserRequestHistory } from "@/lib/api/request/request";
import { revalidatePath } from "next/cache";

export const handleCreateRequest = async (requestData: any) => {
    try {
        const result = await createRequest(requestData);

        if (result.success) {
            // Revalidate request-related pages
            revalidatePath("/user/requests");

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
                success: true as const,
                data: result.data,
                pagination: result.pagination,
            };
        }

        return {
            success: false as const,
            message: result.message || "Fetch Pending requests failed",
        };
    } catch (err: Error | any) {
        return {
            success: false as const,
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
            message: err.message || "Accept request failed",
        };
    }
}

export const handleFinishRequest = async (id: string) => {
    try {
        const result = await finishRequest(id);
        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: "Finished Request Successfully"
            }
        }
        return {
            success: false,
            message: "Failed to Finish Request"
        }
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Finish request failed",
        };
    }
}

export const handleGetUserRequestHistory = async () => {
    try {
        const result = await getUserRequestHistory();
        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: "Fetched user request history successfully"
            }
        }
        return {
            success: false,
            message: "Failed to fetch user request history"
        }
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Failed to fetch user request history",
        };
    }
}

export const handleGetMatchedRequests = async ({
    lng,
    lat,
    km,
    page,
    size,
    search,
}: {
    lng: number;
    lat: number;
    km?: string;
    page?: string;
    size?: string;
    search?: string;
}) => {
    try {
        const result = await getMatchedRequests({
            lng,
            lat,
            km: km ? parseInt(km) : undefined,
            page: page ? parseInt(page) : undefined,
            size: size ? parseInt(size) : undefined,
            search,
        });

        if (result.success) {
            return {
                success: true as const,
                data: result.data,
                pagination: result.pagination,
            };
        }

        return {
            success: false as const,
            message: result.message || "Failed to fetch matched requests",
        };
    } catch (err: Error | any) {
        return {
            success: false as const,
            message: err.message || "Failed to fetch matched requests",
        };
    }
};