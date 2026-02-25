import { notFound } from "next/navigation";
import Link from "next/link";
import UserProfileView from "../_components/UserProfileView";
import { handleGetUserById } from "@/lib/actions/admin/user-action";
import { userSchema } from "../../schema/user-schema";
import { handleGetUserRequestHistoryAdmin } from "@/lib/actions/admin/request-action";
import UserRequestHistoryView from "../_components/UserRequestHistoryView";

export default async function AdminUserProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const userRes = await handleGetUserById(id);
    if (!userRes?.success || !userRes?.data) notFound();

    const parsedUser = userSchema.safeParse(userRes.data);
    if (!parsedUser.success) notFound();

    const historyRes = await handleGetUserRequestHistoryAdmin(id);

    return (
        <div className="space-y-5">
            {/* Top bar */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-black">User Profile</h1>
                    <p className="text-sm text-gray-500">
                        View user details and request history.
                    </p>
                </div>

                <Link
                    href="/admin/users"
                    className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-50 transition"
                >
                    Back to Users
                </Link>
            </div>

            <UserProfileView user={parsedUser.data} />

            <UserRequestHistoryView
                userId={parsedUser.data._id}
                history={historyRes.success ? historyRes.data : null}
                errorMessage={!historyRes.success ? historyRes.message : undefined}
            />
        </div>
    );
}