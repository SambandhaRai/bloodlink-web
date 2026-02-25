import Link from "next/link";

export default function RecentUsersCard({ users }: { users: any[] }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-black/10 p-4">
                <div>
                    <div className="text-base font-semibold text-black">Recent Users</div>
                    <div className="text-sm text-gray-500">Latest users from admin list</div>
                </div>

                <Link
                    href="/admin/users"
                    className="text-sm font-semibold text-red-800 hover:underline"
                >
                    View all
                </Link>
            </div>

            <div className="divide-y divide-black/5">
                {users?.length ? (
                    users.map((u) => (
                        <div key={u._id} className="flex items-center justify-between p-4">
                            <div>
                                <div className="text-sm font-semibold text-black">
                                    {u.fullName || "Unnamed"}
                                </div>
                                <div className="text-xs text-gray-600">
                                    {u.email || "—"} • {u.phoneNumber || "—"}
                                </div>
                            </div>

                            <Link
                                href={`/admin/users/${u._id}`}
                                className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-gray-50 transition"
                            >
                                View
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="p-6 text-sm text-gray-500">No users found.</div>
                )}
            </div>
        </div>
    );
}