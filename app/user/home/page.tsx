import Link from "next/link";

import { handleGetProfile } from "@/lib/actions/user/user-action";
import { handleGetAllPendingRequests, handleGetMyRequestHistory } from "@/lib/actions/request/request-action";

import UserHomeHeader from "./_components/UserHomeHeader";
import UserHomeStats from "./_components/UserHomeStats";
import HomeRequestsPreview from "./_components/HomeRequestsPreview";
import HomeHistoryPreview from "./_components/HomeHistoryPreview";

export default async function UserHomePage() {
    const [profileRes, pendingRes, historyRes] = await Promise.all([
        handleGetProfile(),
        handleGetAllPendingRequests({ page: "1", size: "2", search: "" }),
        handleGetMyRequestHistory(),
    ]);

    const user = profileRes.success ? profileRes.data : null;

    const pendingRequests = pendingRes.success ? pendingRes.data : [];
    const pendingPagination = pendingRes.success ? pendingRes.pagination : null;

    const history = historyRes.success ? historyRes.data : null;

    const donatedCount = history?.donated?.length ?? 0;
    const receivedCount = history?.received?.length ?? 0;

    const requestedOngoingCount = history?.ongoing?.requestedOngoing?.length ?? 0;
    const donationOngoingCount = history?.ongoing?.donationOngoing?.length ?? 0;

    const counts = {
        donated: donatedCount,
        received: receivedCount,
        requestedOngoing: requestedOngoingCount,
        donationOngoing: donationOngoingCount,
        totalOngoing: requestedOngoingCount + donationOngoingCount,
        total: donatedCount + receivedCount + requestedOngoingCount + donationOngoingCount,
    };

    return (
        <section className="mx-auto max-w-7xl px-6 py-10">
            <div className="space-y-6">
                {/* Top header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-black">Welcome, {user.fullName}</h1>
                        <p className="text-sm text-gray-500">
                            Quick overview of your profile, requests, and donation history.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href="/user/find-donor"
                            className="rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold text-white hover:bg-red-900 transition"
                        >
                            Find Donors
                        </Link>
                        <Link
                            href="/user/requests"
                            className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-50 transition"
                        >
                            View Requests
                        </Link>
                    </div>
                </div>

                <UserHomeHeader user={user} />
                <UserHomeStats counts={counts} />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <HomeRequestsPreview
                        data={pendingRequests}
                        total={pendingPagination?.totalRequests ?? pendingPagination?.total ?? 0}
                    />
                    <HomeHistoryPreview history={history} />
                </div>
            </div>
        </section>
    );
}