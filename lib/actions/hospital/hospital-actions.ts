"use server";

import { getAllHospitals, getHospitalById } from "@/lib/api/hospital/hospital";

export async function handleGetAllHospitals(params?: {
    page?: number;
    size?: number;
    search?: string;
    isActive?: boolean;
}) {
    try {
        const currentPage = params?.page ?? 1;
        const pageSize = params?.size ?? 10;
        const searchQuery = params?.search ?? "";

        const response = await getAllHospitals({
            page: currentPage,
            size: pageSize,
            search: searchQuery,
            ...(typeof params?.isActive === "boolean" ? { isActive: params.isActive } : {}),
        });

        if (response.success) {
            return {
                success: true,
                message: response.message ?? "Hospitals fetched successfully",
                data: response.data,
                pagination: response.pagination,
            };
        }

        return {
            success: false,
            message: response.message ?? "Failed to fetch hospitals",
            data: [],
            pagination: null,
        };
    } catch (err: any) {
        return {
            success: false,
            message: err?.message || "Failed to fetch hospitals",
            data: [],
            pagination: null,
        };
    }
}

export const handleGetHospitalById = async (id: string) => {
    try {
        const result = await getHospitalById(id);
        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: "Fetched hospital successfully"
            }
        }
        return {
            success: true,
            message: "Failed to fetch hospital"
        }
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.response?.data?.message || err.message || "Failed to fetch hospital"
        };
    }
}