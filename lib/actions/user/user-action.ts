"use server";

import { getProfile, updateUserProfile } from "@/lib/api/user/user";
import { setUserData } from "@/lib/cookie";
import { revalidatePath } from "next/cache";

export const handleGetProfile = async () => {
    try {
        const result = await getProfile(); 
        if(result.success) {
            return { success: true, data: result.data}
        }
        return {
            success: false,
            message: result.message || "Fetch WhoAmI Failed"
        }
    } catch(err: Error | any) {
        return {
            success: false,
            message: err.message || "Fetch WhoAmI Failed"
        };
    }
}

export const handleUpdateUserProfile = async (formData: any) => {
    try{
        const result = await updateUserProfile(formData);
        if(result.success){
            // update user data in cookie
            await setUserData(result.data);
            // revalidate user profile page
            revalidatePath("/user/profile"); // refresh page date after update
            return {
                success: true,
                message: "Profile updated successfully",
                data: result.data
            }
        }
        return {
            success: false,
            message: result.message || "Update profile failed"
        }
    }catch(err: Error | any){
        return {
            success: false,
            message: err.message || "Update profile failed"
        }
    }
}