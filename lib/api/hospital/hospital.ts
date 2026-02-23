import { API } from "../endpoints";
import axios from "../axios";

export const getAllHospitals = async ({ page, size, search }: {
    page: number;
    size: number;
    search: string;
}) => {
    try {
        const response = await axios.get(
            API.HOSPITAL.GET_ALL,
            {
                params: {
                    page,
                    size,
                    search
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(err.response?.data?.message || "Failed to fetch hospitals");
    }
}

export const getHospitalById = async (id: string) => {
    try {
        const res = await axios.get(
            API.HOSPITAL.GET_BY_ID(id)
        );
        return res.data;
    } catch (err: Error | any) {
        return (
            err.response?.data?.message
            || err.message
            || "Failed to fetch hospital"
        );
    }
}