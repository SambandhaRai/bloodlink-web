"use client";

import { handleDeleteHospital } from "@/lib/actions/admin/hospital-action";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { Plus, X } from "lucide-react";

export default function HospitalsTable(
    { hospitals, pagination, search }:
        { hospitals: any[]; pagination: any; search: string }
) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(search);
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/admin/hospitals?search=${searchTerm}`);
        router.refresh();
    }

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

    const [isPending, startTransition] = useTransition();

    const openConfirm = (hospitalId: string) => {
        setSelectedHospitalId(hospitalId);
        setShowConfirm(true);
    };

    const cancel = () => {
        setShowConfirm(false);
        setSelectedHospitalId(null);
    };

    const onConfirmDelete = () => {
        if (!selectedHospitalId) return;

        startTransition(async () => {
            try {
                const res = await handleDeleteHospital(selectedHospitalId);

                if (res.success) {
                    toast.success(res.message || "Deleted hospital successfully");
                    setShowConfirm(false);
                    setSelectedHospitalId(null);

                    // refresh the table data
                    router.refresh();
                } else {
                    toast.error(res.message || "Failed to delete hospital");
                }
            } catch (err: any) {
                toast.error(err?.message || "Failed to delete hospital");
            }
        });
    };

    return (
        <div className="space-y-5">
            {/* Header row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="shrink-0">
                    <h1 className="text-xl font-semibold text-black">Hospitals</h1>
                    <p className="text-sm text-gray-500">
                        Search hospitals and manage their information.
                    </p>
                </div>

                {/* Right side */}
                <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:justify-end">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex w-full flex-1 gap-2">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by hospital name..."
                            className="w-full flex-1 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-black outline-none
                   focus:border-red-800 focus:ring-2 focus:ring-red-100"
                        />
                        <button
                            type="submit"
                            className="shrink-0 rounded-lg bg-red-800 px-4 py-2.5 text-sm font-semibold text-white
                   hover:bg-red-900 transition"
                        >
                            Search
                        </button>
                    </form>

                    {/* Add Hospital */}
                    <Link
                        href="/admin/hospitals/add-hospital"
                        className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-white outline px-5 py-2.5
                            text-sm font-semibold text-black shadow-sm hover:underline hover:bg-gray-100 transition"
                    >
                        <Plus className="h-4 w-4" />
                        Add Hospital
                    </Link>
                </div>
            </div>

            {/* Table Card */}
            <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-black/5">
                            {hospitals?.length ? (
                                hospitals.map((hospital, idx) => (
                                    <tr
                                        key={hospital._id}
                                        className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                                            } hover:bg-red-50/40 transition`}
                                    >
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-xs text-gray-600">
                                                {String(hospital._id).slice(0, 10)}...
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="font-medium text-black">{hospital.name}</div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/hospitals/${hospital._id}`}
                                                    className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-black
                                     hover:bg-gray-50 transition"
                                                >
                                                    View
                                                </Link>

                                                <button
                                                    onClick={() => openConfirm(hospital._id)}
                                                    className="rounded-md bg-red-800 px-3 py-1.5 text-xs font-semibold text-white
                                     hover:bg-red-900 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                                        No hospitals found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Confirmation Modal */}
                {showConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                        <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                            <button
                                onClick={cancel}
                                aria-label="Close"
                                className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-black"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <h3 className="text-lg font-semibold text-black">
                                Confirm Delete
                            </h3>

                            <p className="mt-2 text-sm text-gray-600">
                                Are you sure you want to delete this hospital?
                            </p>

                            <div className="mt-6 flex gap-3">
                                <button
                                    disabled={isPending}
                                    onClick={onConfirmDelete}
                                    className={clsx(
                                        "flex-1 rounded-xl py-2 text-sm font-semibold text-white",
                                        isPending
                                            ? "cursor-not-allowed bg-red-400"
                                            : "bg-red-800 hover:bg-red-700"
                                    )}
                                >
                                    {isPending ? "Deleting..." : "Delete"}
                                </button>

                                <button
                                    onClick={cancel}
                                    className="flex-1 rounded-xl border py-2 text-sm font-semibold text-black hover:bg-gray-100 hover:underline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {pagination && (
                    <div className="flex flex-col gap-3 border-t border-black/10 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-gray-600">
                            Page <span className="font-semibold">{pagination.page}</span> of{" "}
                            <span className="font-semibold">{pagination.totalPages}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {pagination.page > 1 ? (
                                <Link
                                    className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-gray-50 transition"
                                    href={`/admin/hospitals?page=${pagination.page - 1}&size=${pagination.size}&search=${encodeURIComponent(
                                        search || ""
                                    )}`}
                                >
                                    Previous
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="cursor-not-allowed rounded-lg border border-black/10 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-400"
                                >
                                    Previous
                                </button>
                            )}

                            {pagination.page < pagination.totalPages ? (
                                <Link
                                    className="rounded-lg bg-red-800 px-3 py-2 text-sm font-semibold text-white hover:bg-red-900 transition"
                                    href={`/admin/hospitals?page=${pagination.page + 1}&size=${pagination.size}&search=${encodeURIComponent(
                                        search || ""
                                    )}`}
                                >
                                    Next
                                </Link>
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
            </div>
        </div>
    )
}