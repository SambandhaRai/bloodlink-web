export default function AdminStatsCards({
    totalUsers,
    totalHospitals,
    requestStats,
}: {
    totalUsers: number;
    totalHospitals: number;
    requestStats: {
        totalRequests: number;
        pendingRequests: number;
        acceptedRequests: number;
        finishedRequests: number;
    } | null;
}) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-gray-600">Total Users</div>
                <div className="mt-1 text-2xl font-bold text-black">{totalUsers}</div>
                <div className="mt-1 text-xs text-gray-500">From admin users list</div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-gray-600">Total Hospitals</div>
                <div className="mt-1 text-2xl font-bold text-black">{totalHospitals}</div>
                <div className="mt-1 text-xs text-gray-500">From hospitals list</div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-gray-600">Requests</div>

                <div className="mt-1 text-2xl font-bold text-black">
                    {requestStats ? requestStats.totalRequests : "—"}
                </div>

                {requestStats ? (
                    <div className="mt-2 text-xs text-gray-600 space-y-1">
                        <div className="flex items-center justify-between">
                            <span>Pending</span>
                            <span className="font-semibold text-black">
                                {requestStats.pendingRequests}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Accepted</span>
                            <span className="font-semibold text-black">
                                {requestStats.acceptedRequests}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Finished</span>
                            <span className="font-semibold text-black">
                                {requestStats.finishedRequests}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="mt-1 text-xs text-gray-500">
                        Couldn&apos;t load request stats
                    </div>
                )}
            </div>
        </div>
    );
}