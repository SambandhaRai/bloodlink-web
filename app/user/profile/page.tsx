import { handleGetProfile } from "@/lib/actions/user/user-action";
import UpdateUserForm from "../_components/UpdateUserForm";

export default async function Page() {
    const response = await handleGetProfile();
    if(!response.success) {
        throw new Error("Failed to fetch user data");
    }

    return (
        <div>
            <UpdateUserForm user = { response.data } />
        </div>
    );
}