import axios from "../axios";
import { API } from "../endpoints";

export const getAllBloodGroups = async () => {
    try{
        const res = await axios.get(API.BLOODGROUP.GETALL);
        return res.data;
    } catch (err: Error | any) {
        return(
            err.response?.data?.message 
            || err.message
            || "Failed to Fetch Blood Groups"
        );
    }
}

export const getBloodGroupById = async (id: string) => {
    try{
        const res = await axios.get(API.BLOODGROUP.GETBYID(id));
        return res.data;
    } catch (err: Error | any) {
        return(
            err.response?.data?.message 
            || err.message
            || "Failed to Fetch Blood Group"
        );
    }
}