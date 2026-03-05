"use client";

import Link from "next/link";

type HistoryPayload = {
    donated: any[];
    received: any[];
    ongoing: {
        requestedOngoing: any[];
        donationOngoing: any[];
    };
    counts?: {
        donated: number;
        received: number;
        requestedOngoing: number;
        donationOngoing: number;
        totalOngoing: number;
        total: number;
    };
};

function StatCard({
    label,
    value,
    hint,
}: {
    label: string;
    value: number;
    hint?: string;
}) {
    return (
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-600">{label}</div>
            <div className="mt-1 text-2xl font-bold text-black">{value}</div>
            {hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
        </div>
    );
}

function safeBloodLabel(req: any) {
    return req?.recipientBloodId?.bloodGroup || "Unknown";
}

function safeHospitalName(req: any) {
    return req?.hospitalId?.name || req?.hospital?.name || "Unknown hospital";
}

function safeStatus(req: any) {
    return req?.requestStatus || "—";
}

export default function UserRequestHistoryView({
    userId,
    history,
    errorMessage,
}: {
    userId: string;
    history: HistoryPayload | null;
    errorMessage?: string;
}) {
    if (!history) {
        return (
            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="text-lg font-semibold text-black">Request History</div>
                <p className="mt-1 text-sm text-gray-600">
                    {errorMessage || "No history available for this user."}
                </p>
            </div>
        );
    }

    const donatedCount = history.counts?.donated ?? history.donated?.length ?? 0;
    const receivedCount =
        history.counts?.received ?? history.received?.length ?? 0;

    const requestedOngoingCount =
        history.counts?.requestedOngoing ??
        history.ongoing?.requestedOngoing?.length ??
        0;

    const donationOngoingCount =
        history.counts?.donationOngoing ??
        history.ongoing?.donationOngoing?.length ??
        0;

    const donatedPreview = (history.donated || []).slice(0, 5);
    const receivedPreview = (history.received || []).slice(0, 5);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-black">Request History</h2>
                    <p className="text-sm text-gray-500">
                        Donated vs Received stats for this user.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Donated"
                    value={donatedCount}
                    hint="Finished requests where user was donor"
                />
                <StatCard
                    label="Received"
                    value={receivedCount}
                    hint="Finished requests posted by the user"
                />
                <StatCard
                    label="Requested Ongoing"
                    value={requestedOngoingCount}
                    hint="Pending/Accepted posted by user"
                />
                <StatCard
                    label="Donation Ongoing"
                    value={donationOngoingCount}
                    hint="Accepted where user is donor"
                />
            </div>

            {/* Preview Lists */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Donated Preview */}
                <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-black/10 p-4">
                        <div className="font-semibold text-black">Latest Donated</div>
                        <span className="text-xs font-semibold text-gray-600">
                            {donatedCount} total
                        </span>
                    </div>

                    <div className="p-4 space-y-3">
                        {donatedPreview.length ? (
                            donatedPreview.map((r: any) => (
                                <div
                                    key={String(r?._id)}
                                    className="rounded-xl border border-black/10 bg-white p-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-semibold text-black">
                                            {safeHospitalName(r)}
                                        </div>
                                        <span className="rounded-full border border-black/10 px-2 py-0.5 text-xs font-semibold text-gray-700">
                                            {safeStatus(r)}
                                        </span>
                                    </div>

                                    <div className="mt-1 text-xs text-gray-600">
                                        Blood:{" "}
                                        <span className="font-semibold text-black">
                                            {safeBloodLabel(r)}
                                        </span>
                                        {r?.patientName ? (
                                            <>
                                                {" "}
                                                • Patient:{" "}
                                                <span className="font-semibold text-black">
                                                    {r.patientName}
                                                </span>
                                            </>
                                        ) : null}
                                    </div>

                                    {r?._id ? (
                                        <div className="mt-2">
                                            <Link
                                                className="text-xs font-semibold text-red-800 hover:underline"
                                                href={`/admin/requests/${r._id}`}
                                            >
                                                View Request
                                            </Link>
                                        </div>
                                    ) : null}
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500">No donated records.</div>
                        )}
                    </div>
                </div>

                {/* Received Preview */}
                <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-black/10 p-4">
                        <div className="font-semibold text-black">Latest Received</div>
                        <span className="text-xs font-semibold text-gray-600">
                            {receivedCount} total
                        </span>
                    </div>

                    <div className="p-4 space-y-3">
                        {receivedPreview.length ? (
                            receivedPreview.map((r: any) => (
                                <div
                                    key={String(r?._id)}
                                    className="rounded-xl border border-black/10 bg-white p-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-semibold text-black">
                                            {safeHospitalName(r)}
                                        </div>
                                        <span className="rounded-full border border-black/10 px-2 py-0.5 text-xs font-semibold text-gray-700">
                                            {safeStatus(r)}
                                        </span>
                                    </div>

                                    <div className="mt-1 text-xs text-gray-600">
                                        Blood:{" "}
                                        <span className="font-semibold text-black">
                                            {safeBloodLabel(r)}
                                        </span>
                                        {r?.donorId?.fullName ? (
                                            <>
                                                {" "}
                                                • Donor:{" "}
                                                <span className="font-semibold text-black">
                                                    {r.donorId.fullName}
                                                </span>
                                            </>
                                        ) : null}
                                    </div>

                                    {r?._id ? (
                                        <div className="mt-2">
                                            <Link
                                                className="text-xs font-semibold text-red-800 hover:underline"
                                                href={`/admin/requests/${r._id}`}
                                            >
                                                View Request
                                            </Link>
                                        </div>
                                    ) : null}
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500">No received records.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Raw totals line */}
            <div className="text-xs text-gray-500">
                User ID: <span className="font-mono">{userId}</span>
            </div>
        </div>
    );
}