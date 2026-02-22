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

export const getAllPendingRequests = async ({
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
            API.REQUEST.GET_ALL_PENDING,
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
            || "Fetch pending requests failed"
        );
    }
};

export const getRequestById = async (id: string) => {
    try {
        const response = await axios.get(
            API.REQUEST.GET_BY_ID(id)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Fetch request failed"
        )
    }
}

export const acceptRequest = async (id: string) => {
    try {
        const response = await axios.patch(
            API.REQUEST.ACCEPT(id)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Accept request failed"
        )
    }
}

export const finishRequest = async (id: string) => {
    try {
        const response = await axios.patch(
            API.REQUEST.FINISH(id)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Finish request failed"
        )
    }
}

export const getUserRequestHistory = async () => {
    try {
        const response = await axios.get(
            API.REQUEST.GET_USER_HISTORY
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch user request history"
        )
    }
}