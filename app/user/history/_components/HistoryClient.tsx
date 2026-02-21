"use client";

import { useMemo, useState } from "react";
import HistoryCard from "./HistoryCard";

type HistoryData = {
    donated: any[];
    ongoing: {
        requestedOngoing: any[];
        donationOngoing: any[];
    };
    received: any[];
};

type TabKey = "ongoing" | "donated" | "received";

function formatDayLabel(dateString?: string) {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(dateString));
}

function groupByDay(items: any[], dateKey: "createdAt" | "updatedAt" = "createdAt") {
    const map = new Map<string, any[]>();

    for (const it of items) {
        const label = formatDayLabel(it?.[dateKey]);
        if (!label) continue;
        map.set(label, [...(map.get(label) || []), it]);
    }

    // sorting groups by actual date
    const entries = Array.from(map.entries()).sort((a, b) => {
        const aDate = new Date(a[1]?.[0]?.[dateKey] || 0).getTime();
        const bDate = new Date(b[1]?.[0]?.[dateKey] || 0).getTime();
        return bDate - aDate;
    });

    return entries;
}

export default function HistoryClient({ history }: { history: HistoryData }) {
    const [tab, setTab] = useState<TabKey>("ongoing");

    const ongoingList = useMemo(() => {
        const requested = (history.ongoing?.requestedOngoing || []).map((r) => ({
            ...r,
            __historyType: "requested",
        }));
        const donating = (history.ongoing?.donationOngoing || []).map((r) => ({
            ...r,
            __historyType: "donating",
        }));
        return [...requested, ...donating].sort((a, b) => {
            const aT = new Date(a.createdAt || 0).getTime();
            const bT = new Date(b.createdAt || 0).getTime();
            return bT - aT;
        });
    }, [history]);

    const list = useMemo(() => {
        if (tab === "ongoing") return ongoingList;
        if (tab === "donated") return history.donated || [];
        return history.received || [];
    }, [tab, history, ongoingList]);

    const grouped = useMemo(() => {
        const key = tab === "ongoing" ? "createdAt" : "updatedAt";
        return groupByDay(list, key);
    }, [list, tab]);

    return (
        <section>
            {/* Tabs container */}
            <div className="mx-auto w-full max-w-7xl">
                <div className="grid grid-cols-3 overflow-hidden rounded-2xl border bg-white">
                    <button
                        onClick={() => setTab("ongoing")}
                        className={`py-3 text-sm font-semibold transition ${tab === "ongoing" ? "bg-red-800 text-white" : "text-black hover:bg-gray-50"
                            }`}
                    >
                        Ongoing
                    </button>
                    <button
                        onClick={() => setTab("donated")}
                        className={`py-3 text-sm font-semibold transition border-x ${tab === "donated" ? "bg-red-800 text-white" : "text-black hover:bg-gray-50"
                            }`}
                    >
                        Donated
                    </button>
                    <button
                        onClick={() => setTab("received")}
                        className={`py-3 text-sm font-semibold transition ${tab === "received" ? "bg-red-800 text-white" : "text-black hover:bg-gray-50"
                            }`}
                    >
                        Received
                    </button>
                </div>

                {/* Content */}
                <div className="mt-6">
                    {grouped.length === 0 ? (
                        <div className="rounded-2xl border bg-white p-10 text-center text-sm text-gray-600">
                            No history found for this section.
                        </div>
                    ) : (
                        grouped.map(([dayLabel, items]) => (
                            <div key={dayLabel} className="mb-8">
                                <p className="mb-4 text-sm font-semibold text-gray-500">{dayLabel}</p>

                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {items.map((req) => (
                                        <HistoryCard key={req._id} request={req} tab={tab} />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}