export default function UserHomeStats({
    counts,
}: {
    counts: {
        donated: number;
        received: number;
        requestedOngoing: number;
        donationOngoing: number;
        totalOngoing: number;
        total: number;
    };
}) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-gray-600">Donated</div>
                <div className="mt-1 text-2xl font-bold text-black">{counts.donated}</div>
                <div className="mt-1 text-xs text-gray-500">Finished donations</div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-gray-600">Received</div>
                <div className="mt-1 text-2xl font-bold text-black">{counts.received}</div>
                <div className="mt-1 text-xs text-gray-500">Finished requests</div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-gray-600">Ongoing</div>
                <div className="mt-1 text-2xl font-bold text-black">{counts.totalOngoing}</div>
                <div className="mt-1 text-xs text-gray-500">
                    Requested: {counts.requestedOngoing} • Donation: {counts.donationOngoing}
                </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-gray-600">Total Records</div>
                <div className="mt-1 text-2xl font-bold text-black">{counts.total}</div>
                <div className="mt-1 text-xs text-gray-500">All history combined</div>
            </div>
        </div>
    );
}