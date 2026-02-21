"use client";

import Image from "next/image";
import clsx from "clsx";
import { MapPin, User2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { handleAcceptRequest } from "@/lib/actions/request/request-action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const conditionColorMap: Record<string, string> = {
    stable: "bg-green-500",
    urgent: "bg-yellow-500",
    critical: "bg-red-500",
};

function timeAgo(dateString?: string) {
    if (!dateString) return "";

    const now = Date.now();
    const past = new Date(dateString).getTime();
    const diffMs = now - past;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(dateString));
}

export default function RequestDetailsCard({ request }: { request: any }) {
    const condition = request?.recipientCondition || "stable";

    const profileSrc = request?.postedBy?.profilePicture
        ? request.postedBy.profilePicture.startsWith("http")
            ? request.postedBy.profilePicture
            : `${apiBase}${request.postedBy.profilePicture.startsWith("/") ? "" : "/uploads/"
            }${request.postedBy.profilePicture}`
        : null;

    const name = request?.postedBy?.fullName || "Unknown";
    const blood = request?.recipientBloodId?.bloodGroup || "";
    const hospitalName = request?.hospitalId?.name || "Unknown Hospital";

    const showSelfInfo = request?.requestFor === "self";
    const showOthersInfo = request?.requestFor === "others";

    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    const acceptRequest = () => {
        startTransition(async () => {
            const res = await handleAcceptRequest(request._id);

            if (res.success) {
                setShowConfirm(false);
                toast.success(`${name}'s Request Accepted`);

                setTimeout(() => {
                    router.push("/user/requests");
                }, 500);
            } else {
                toast.error(res.message);
            }
        });
    };

    return (
        <div className="relative w-full">
            <div className="relative w-full rounded-2xl bg-white p-6 shadow-xl">
                {/* ribbon */}
                <span
                    className={clsx(
                        "absolute right-16 top-6 h-4 w-4 rounded-sm",
                        conditionColorMap[condition] || "bg-gray-400"
                    )}
                />

                {/* close (optional) */}
                <button
                    onClick={() => router.back()}
                    className="absolute right-5 top-5 rounded-md p-2 hover:bg-gray-100"
                    aria-label="Close"
                >
                    <X className="h-5 w-5 text-black" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border bg-gray-100">
                        {profileSrc ? (
                            <Image
                                src={profileSrc}
                                alt="User"
                                width={64}
                                height={64}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <User2 className="h-8 w-8 text-gray-400" />
                        )}
                    </div>

                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-black">
                            {name}{" "}
                            {blood && <span className="text-black">[{blood}]</span>}
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Request For:{" "}
                            <span className="font-semibold">
                                {String(request?.requestFor || "").toUpperCase()}
                            </span>
                        </p>

                        <div className="mt-2 flex items-center gap-1 text-sm text-gray-700">
                            <MapPin className="h-4 w-4 text-red-600" />
                            <span className="font-medium">{hospitalName}</span>
                            <span className="ml-auto text-xs text-gray-500">
                                {timeAgo(request?.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="mt-6 space-y-5">
                    <div className="text-sm">
                        <p className="font-semibold text-black">Recipient&apos;s Detail:</p>
                        <p className="mt-1 text-gray-700">{request?.recipientDetails || "-"}</p>
                    </div>

                    <div className="text-sm">
                        <p className="font-semibold text-black">Condition:</p>
                        <p className="mt-1 capitalize text-gray-700">
                            {request?.recipientCondition || "-"}
                        </p>
                    </div>

                    {showSelfInfo && (
                        <div className="rounded-xl border bg-gray-50 p-4 text-sm">
                            <p className="font-semibold text-black">Patient Info:</p>
                            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-gray-500">Patient Name</p>
                                    <p className="font-medium text-gray-800">
                                        {request?.postedBy?.fullName || "-"}
                                    </p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-xs text-gray-500">Patient Phone</p>
                                    <p className="font-medium text-gray-800">
                                        {request?.postedBy?.phoneNumber || "-"}
                                    </p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-xs text-gray-500">Patient Email</p>
                                    <p className="font-medium text-gray-800">
                                        {request?.postedBy?.email || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {showOthersInfo && (
                        <div className="rounded-xl border bg-gray-50 p-4 text-sm">
                            <p className="font-semibold text-black">Patient Info:</p>
                            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-gray-500">Relation</p>
                                    <p className="font-medium text-gray-800">
                                        {request?.relationToPatient || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Patient Name</p>
                                    <p className="font-medium text-gray-800">
                                        {request?.patientName || "-"}
                                    </p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-xs text-gray-500">Patient Phone</p>
                                    <p className="font-medium text-gray-800">
                                        {request?.patientPhone || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-7 flex gap-3">
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="flex-1 rounded-xl bg-red-800 py-3 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Accept
                    </button>

                    <button className="flex-1 rounded-xl border py-3 text-sm font-semibold text-black hover:bg-gray-100 hover:underline">
                        Decline
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                        <button
                            onClick={() => setShowConfirm(false)}
                            aria-label="Close"
                            className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-black"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-lg font-semibold text-black">Confirm Acceptance</h3>

                        <p className="mt-2 text-sm text-gray-600">
                            Are you sure you want to accept this blood request?
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                disabled={isPending}
                                onClick={acceptRequest}
                                className={clsx(
                                    "flex-1 rounded-xl py-2 text-sm font-semibold text-white",
                                    isPending ? "cursor-not-allowed bg-red-400" : "bg-red-800 hover:bg-red-700"
                                )}
                            >
                                {isPending ? "Accepting..." : "Accept"}
                            </button>

                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 rounded-xl border py-2 text-sm font-semibold text-black hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}