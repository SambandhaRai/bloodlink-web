"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RequestCard from "./RequestCard";
import RequestSearch from "./RequestSearch";

type TabKey = "matched" | "all";

export default function RequestsTabsForm({
    initialTab,
    defaultSearch,
    data,
    pagination,
    initialKm,
}: {
    initialTab: TabKey;
    defaultSearch: string;
    data: any[];
    pagination?: any;
    initialKm: string;
}) {
    const router = useRouter();
    const sp = useSearchParams();
    const [pending, startTransition] = useTransition();

    const [tab, setTab] = useState<TabKey>(initialTab);
    const [km] = useState(initialKm || "10");

    const search = sp.get("search") ?? defaultSearch;
    const page = sp.get("page") ?? "1";

    function pushQuery(next: Partial<Record<string, string>>) {
        const q = new URLSearchParams(sp.toString());

        Object.entries(next).forEach(([k, v]) => {
            if (!v) q.delete(k);
            else q.set(k, v);
        });

        startTransition(() => {
            router.push(`/user/requests?${q.toString()}`);
        });
    }

    const onTabChange = (nextTab: TabKey) => {
        setTab(nextTab);

        if (nextTab === "matched") {
            pushQuery({
                tab: "matched",
                page: "1",
                km,
            });
        } else {
            pushQuery({
                tab: "all",
                page: "1",
            });
        }
    };

    return (
        <>
            {/* Tabs */}
            <div className="grid grid-cols-2 overflow-hidden rounded-2xl border bg-white">
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => onTabChange("matched")}
                    className={`py-3 text-sm font-semibold transition ${tab === "matched"
                        ? "bg-red-800 text-white"
                        : "text-black hover:bg-gray-50"
                        }`}
                >
                    Matched
                </button>

                <button
                    type="button"
                    disabled={pending}
                    onClick={() => onTabChange("all")}
                    className={`py-3 text-sm font-semibold transition border-l ${tab === "all"
                        ? "bg-red-800 text-white"
                        : "text-black hover:bg-gray-50"
                        }`}
                >
                    All Requests
                </button>
            </div>

            {/* Search */}
            <div className="mt-6">
                <RequestSearch defaultValue={search} />
            </div>

            {/* List */}
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.length === 0 ? (
                    <div className="col-span-full rounded-2xl border bg-white p-6 text-center text-sm text-gray-600">
                        {tab === "matched"
                            ? "No matched requests found near you."
                            : "No requests found."}
                    </div>
                ) : (
                    data.map((request: any) => (
                        <RequestCard key={request._id} request={request} />
                    ))
                )}
            </div>

            {/* Pagination can be wired here later */}
        </>
    );
}