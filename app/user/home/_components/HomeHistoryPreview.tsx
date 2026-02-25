import Link from "next/link";

function pickRecent(history: any) {
    const donated = history?.donated ?? [];
    const received = history?.received ?? [];
    const requestedOngoing = history?.ongoing?.requestedOngoing ?? [];
    const donationOngoing = history?.ongoing?.donationOngoing ?? [];

    const combined = [
        ...donated.map((x: any) => ({ ...x, __kind: "donated" })),
        ...received.map((x: any) => ({ ...x, __kind: "received" })),
        ...requestedOngoing.map((x: any) => ({ ...x, __kind: "requested" })),
        ...donationOngoing.map((x: any) => ({ ...x, __kind: "donation" })),
    ];

    combined.sort((a: any, b: any) => {
        const ad = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const bd = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return bd - ad;
    });

    return combined.slice(0, 5);
}

export default function HomeHistoryPreview({ history }: { history: any | null }) {
    const recent = history ? pickRecent(history) : [];

    return (
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-base font-semibold text-black">Your Recent Activity</div>
                    <div className="text-sm text-gray-500">Latest donated/received/ongoing</div>
                </div>

                <Link href="/user/history" className="text-sm font-semibold text-red-800 hover:underline">
                    View history
                </Link>
            </div>

            <div className="mt-4 space-y-3">
                {recent.length ? (
                    recent.map((r: any) => (
                        <div key={r._id} className="rounded-xl border border-black/10 bg-white p-3">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-black">
                                    {r.__kind.toUpperCase()} • {r.recipientBloodId?.bloodGroup || "—"}
                                </div>
                                <div className="text-xs text-gray-500">{r.requestStatus}</div>
                            </div>

                            <div className="mt-1 text-xs text-gray-600">
                                {r.hospitalId?.name || "—"} • {r.patientName || r.recipientDetails || "—"}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
                        No activity yet.
                    </div>
                )}
            </div>
        </div>
    );
}