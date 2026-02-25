import Link from "next/link";

import AdminStatsCards from "./_components/AdminStatsCard";
import RecentUsersCard from "./_components/RecentUsersCard";
import RecentHospitalsCard from "./_components/RecentHospitalsCard";
import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import { handleGetAllHospitals } from "@/lib/actions/hospital/hospital-actions";
import { handleGetRequestStatsAdmin } from "@/lib/actions/admin/request-action";

export default async function AdminDashboardPage() {
    const [usersRes, hospitalsRes, statsRes] = await Promise.all([
        handleGetAllUsers({ page: 1, size: 6, search: "" }),
        handleGetAllHospitals({ page: 1, size: 6, search: "" }),
        handleGetRequestStatsAdmin(),
    ]);

    const users = usersRes.success ? usersRes.data : [];
    const usersPagination = usersRes.success ? usersRes.pagination : null;

    const hospitals = hospitalsRes.success ? hospitalsRes.data : [];
    const hospitalsPagination = hospitalsRes.success ? hospitalsRes.pagination : null;

    const totalUsers =
        usersPagination?.totalUsers ??
        usersPagination?.totalItems ??
        usersPagination?.total ??
        0;

    const totalHospitals =
        hospitalsPagination?.totalHospitals ??
        hospitalsPagination?.totalItems ??
        hospitalsPagination?.total ??
        0;

    const requestStats = statsRes.success ? statsRes.data : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-black">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500">
                        Overview of users, hospitals, and request history.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Link
                        href="/admin/users"
                        className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-50 transition"
                    >
                        Manage Users
                    </Link>

                    <Link
                        href="/admin/hospitals"
                        className="rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold text-white hover:bg-red-900 transition"
                    >
                        Manage Hospitals
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <AdminStatsCards
                totalUsers={totalUsers}
                totalHospitals={totalHospitals}
                requestStats={requestStats}
            />

            {/* Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="lg:col-span-2 space-y-6">
                    <RecentUsersCard users={users} />
                    <RecentHospitalsCard hospitals={hospitals} />
                </div>
            </div>
        </div>
    );
}