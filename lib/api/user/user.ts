import { API } from "../endpoints";
import axios from "../axios";

export const getProfile = async () => {
    try {
        const response = await axios.get(
            API.USER.GET_PROFILE,
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message 
            || err.message 
            || "Profile Fetch Failed" 
        );
    }
}

export const updateUserProfile = async (updateData: any) => {
    try{
        const response = await axios.put(
            API.USER.UPDATE_PROFILE,
            updateData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data' // IMPORTANT: for file upload/multer
                }
            }
        );
        return response.data;
    } catch(err: Error | any){
        throw new Error
            (
                err.response?.data?.message  // from backend
                || err.message // general error message
                || "Update profile failed" // change
            );
    }
}