import Link from "next/link";

export default function RecentHospitalsCard({ hospitals }: { hospitals: any[] }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-black/10 p-4">
                <div>
                    <div className="text-base font-semibold text-black">Recent Hospitals</div>
                    <div className="text-sm text-gray-500">
                        Latest hospitals from hospital list
                    </div>
                </div>

                <Link
                    href="/admin/hospitals"
                    className="text-sm font-semibold text-red-800 hover:underline"
                >
                    View all
                </Link>
            </div>

            <div className="divide-y divide-black/5">
                {hospitals?.length ? (
                    hospitals.map((h) => (
                        <div key={h._id} className="flex items-center justify-between p-4">
                            <div>
                                <div className="text-sm font-semibold text-black">
                                    {h.name || "Unnamed Hospital"}
                                </div>
                                <div className="text-xs text-gray-600">
                                    Status:{" "}
                                    <span className="font-semibold">
                                        {typeof h.isActive === "boolean"
                                            ? h.isActive
                                                ? "Active"
                                                : "Inactive"
                                            : "—"}
                                    </span>
                                </div>
                            </div>

                            <Link
                                href={`/admin/hospitals/${h._id}`}
                                className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-gray-50 transition"
                            >
                                View
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="p-6 text-sm text-gray-500">No hospitals found.</div>
                )}
            </div>
        </div>
    );
}