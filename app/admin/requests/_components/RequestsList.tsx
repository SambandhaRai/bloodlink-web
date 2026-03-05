"use client";

import RequestCard from "./RequestCard";
import RequestSearch from "./RequestSearch";

export default function RequestsList({
    defaultSearch,
    data,
    pagination,
}: {
    defaultSearch: string;
    data: any[];
    pagination?: {
        page: number;
        size: number;
        totalPages: number;
    } | null;
}) {
    return (
        <>
            {/* Search */}
            <div className="mt-6">
                <RequestSearch defaultValue={defaultSearch} />
            </div>

            {/* List */}
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.length === 0 ? (
                    <div className="col-span-full rounded-2xl border bg-white p-6 text-center text-sm text-gray-600">
                        No requests found.
                    </div>
                ) : (
                    data.map((request: any) => (
                        <RequestCard key={request._id} request={request} />
                    ))
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="mt-10 flex flex-col gap-3 rounded-2xl border bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-gray-600">
                        Page <span className="font-semibold">{pagination.page}</span> of{" "}
                        <span className="font-semibold">{pagination.totalPages}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {pagination.page > 1 ? (
                            <a
                                className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-gray-50 transition"
                                href={`/user/requests?page=${pagination.page - 1}&size=${pagination.size
                                    }&search=${encodeURIComponent(defaultSearch || "")}`}
                            >
                                Previous
                            </a>
                        ) : (
                            <button
                                disabled
                                className="cursor-not-allowed rounded-lg border border-black/10 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-400"
                            >
                                Previous
                            </button>
                        )}

                        {pagination.page < pagination.totalPages ? (
                            <a
                                className="rounded-lg bg-red-800 px-3 py-2 text-sm font-semibold text-white hover:bg-red-900 transition"
                                href={`/user/requests?page=${pagination.page + 1}&size=${pagination.size
                                    }&search=${encodeURIComponent(defaultSearch || "")}`}
                            >
                                Next
                            </a>
                        ) : (
                            <button
                                disabled
                                className="cursor-not-allowed rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-300"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}