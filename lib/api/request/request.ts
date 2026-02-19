import { API } from "../endpoints";
import axios from "../axios";

export const createRequest = async (requestData: any) => {
    try {
        const response = await axios.post(
            API.REQUEST.CREATE,
            requestData
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Create request failed"
        );
    }
};

export const getAllRequests = async ({
    page,
    size,
    search,
}: {
    page?: number;
    size?: number;
    search?: string;
}) => {
    try {
        const response = await axios.get(
            API.REQUEST.GET_ALL,
            {
                params: {
                    page,
                    size,
                    search,
                },
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Fetch requests failed"
        );
    }
};
