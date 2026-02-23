import { API } from "../endpoints";
import axios from "../axios";

export const addHospital = async (hospitalData: any) => {
    try {
        const response = await axios.post(
            API.ADMIN.HOSPITAL.ADD,
            hospitalData
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message || "Failed to add hospital"
        )
    }
}

export const updateHospital = async (id: string, hospitalData: any) => {
    try {
        const response = await axios.put(
            API.ADMIN.HOSPITAL.UPDATE(id),
            hospitalData
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message || err.message || "Failed to update hospital"
        );
    }
}