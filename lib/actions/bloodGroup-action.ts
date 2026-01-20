"use server";

import { getAllBloodGroups, getBloodGroupById } from "../api/bloodGroup";

export const handleGetAllBloodGroups = async () => {
    try {
        const result = await getAllBloodGroups();
        if(result.success) {
            return {
                success: true,
                data: result.data,
                message: "Fetched Blood Groups Successfully"
            }
        }
        return {
            success: false,
            message: result.message || "Failed to Fetch Blood Groups"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.response?.data?.message || err.message || "Failed to Fetch Blood Groups"
        };
    }
}

export const handleGetBloodGroupById = async (id: string) => {
    try {
        const result = await getBloodGroupById(id);
        if(result.success) {
            return {
                success: true,
                data: result.data,
                message: "Fetched Blood Group Successfully"
            }
        }
        return {
            success: false,
            message: result.message || "Failed to Fetch Blood Group"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.response?.data?.message || err.message || "Failed to Fetch Blood Group"
        };
    }
}