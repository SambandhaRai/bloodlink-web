"use client";

import Image from "next/image";
import { MapPin, User2, X } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleAcceptRequest } from "@/lib/actions/request/request-action";
import { toast } from "react-toastify";

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


export default function RequestCard({ request }: { request: any }) {
    const condition = request.recipientCondition;

    const profileSrc = request.postedBy?.profilePicture
        ? request.postedBy.profilePicture.startsWith("http")
            ? request.postedBy.profilePicture
            : `${apiBase}${request.postedBy.profilePicture.startsWith("/") ? "" : "/uploads/"
            }${request.postedBy.profilePicture}`
        : null;

    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    const acceptRequest = () => {
        startTransition(async () => {
            const res = await handleAcceptRequest(request._id);

            if (res.success) {
                setShowConfirm(false);
                toast.success(`${request.postedBy?.fullName}'s Request Accepted`);

                setTimeout(() => {
                    router.push("/user/requests");
                }, 500);
            } else {
                toast.error(res.message);
            }
        });
    };

    const viewDetails = () => {
        setShowConfirm(false);
        router.push(`/user/requests/${request._id}`);
    };

    return (
        <div className="relative h-full rounded-2xl border bg-white p-6 pb-20 shadow-sm">
            {/* Urgency Ribbon */}
            <span
                className={clsx(
                    "absolute right-4 top-4 h-4 w-4 rounded-sm",
                    conditionColorMap[condition]
                )}
            />

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
                <span className="absolute right-4 bottom-21 text-xs font-medium text-gray-500">
                    {timeAgo(request.createdAt)}
                </span>

                <div>
                    <h3 className="text-sm text-black font-semibold">
                        {request.postedBy?.fullName} [{request.recipientBloodId?.bloodGroup}]
                    </h3>
                    <p className="text-xs text-gray-500">
                        For: {request.requestFor.toUpperCase()}
                    </p>
                </div>
            </div>


            {/* Location */}
            <div className="mt-3 flex items-center gap-1 text-xs text-gray-600">
                <MapPin size={14} className="text-red-600" />
                <span className="font-medium">{request.hospitalId?.name}</span>
            </div>

            {/* Recipient Detail */}
            <div className="mt-4 text-sm">
                <p className="text-black font-semibold">Recipient&apos;s Detail:</p>
                <p className="mt-1 text-gray-700">
                    {request.recipientDetails}
                </p>
            </div>

            {/* Condition */}
            <div className="mt-4 text-sm">
                <p className="font-semibold text-black">Condition:</p>
                <p className="mt-1 capitalize text-gray-700">
                    {request.recipientCondition}
                </p>
            </div>

            {/* Actions */}
            <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                <button
                    onClick={() => setShowConfirm(true)}
                    className="flex-1 rounded-lg bg-red-800 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                    Accept
                </button>
                <Link href={`/user/requests/${request._id}`} className="flex-1 rounded-lg border py-2 text-center text-sm font-semibold text-black hover:bg-gray-50 hover:underline">
                    View Details
                </Link>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                        {/* Close button */}
                        <button
                            onClick={() => setShowConfirm(false)}
                            aria-label="Close"
                            className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-black"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-lg font-semibold text-black">
                            Confirm Acceptance
                        </h3>

                        <p className="mt-2 text-sm text-gray-600">
                            Are you sure you want to accept this blood request without viewing its details?
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                disabled={isPending}
                                onClick={acceptRequest}
                                className={clsx(
                                    "flex-1 rounded-xl py-2 text-sm font-semibold text-white",
                                    isPending
                                        ? "cursor-not-allowed bg-red-400"
                                        : "bg-red-800 hover:bg-red-700"
                                )}
                            >
                                {isPending ? "Accepting..." : "Accept"}
                            </button>

                            <button
                                onClick={viewDetails}
                                className="flex-1 rounded-xl border py-2 text-sm font-semibold text-black hover:bg-gray-100 hover:underline"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
