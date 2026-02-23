import { API } from "../endpoints";
import axios from "../axios";

export const getAllHospitals = async () => {
    try {
        const res = await axios.get(
            API.HOSPITAL.GET_ALL
        );
        return res.data;
    } catch (err: Error | any) {
        return (
            err.response?.data?.message
            || err.message
            || "Failed to fetch hospitals"
        );
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