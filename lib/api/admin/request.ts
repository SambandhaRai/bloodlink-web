import { API } from "../endpoints";
import axios from "../axios";

export const getUserRequestHistoryAdmin = async (id: string) => {
    try {
        const response = await axios.get(
            API.ADMIN.REQUEST.GET_REQUEST_HISTORY(id)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message || "Failed to fetch user request history"
        );
    }
};