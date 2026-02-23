"use server";

import { getAllHospitals, getHospitalById } from "@/lib/api/hospital/hospital";

export async function handleGetAllHospitals(params: {
    page?: number;
    size?: number;
    search?: string;
}) {
    try {
        const currentPage = params.page || 1;
        const pageSize = params.size || 10;
        const searchQuery = params.search || '';
        const response = await getAllHospitals({
            page: currentPage,
            size: pageSize,
            search: searchQuery,
        });
        if (response.success) {
            return {
                success: true,
                data: response.data,
                pagination: response.pagination
            }
        }
        return { success: false, data: [], pagination: null };
    } catch (err: Error | any) {
        throw new Error(
            err.message || "Failed to fetch hospitals"
        );
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