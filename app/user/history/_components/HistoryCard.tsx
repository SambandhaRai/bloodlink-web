"use client";

import Image from "next/image";
import { MapPin, User2, X } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleFinishRequest } from "@/lib/actions/request/request-action";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const conditionColorMap: Record<string, string> = {
    stable: "bg-green-500",
    urgent: "bg-yellow-500",
    critical: "bg-red-500",
};

const conditionHintMap: Record<string, string> = {
    stable: "Stable: not very urgent but timely help supports recovery.",
    urgent: "Urgent: immediate blood support is needed.",
    critical: "Critical: life-threatening case requiring blood immediately.",
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
    if (minutes < 60) return `${minutes} mins ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(dateString));
}

export default function HistoryCard({
    request,
    tab,
}: {
    request: any;
    tab: "ongoing" | "donated" | "received";
}) {
    const condition = (request?.recipientCondition || "").toLowerCase();
    const ribbon = conditionColorMap[condition] || "bg-gray-300";

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [showConfirm, setShowConfirm] = useState(false);

    const type = request?.__historyType; // "requested" | "donating"
    const isDonatingOngoing = tab === "ongoing" && type === "donating";

    const isReceived = tab === "received";
    const person = isReceived ? request?.donorId : request?.postedBy;

    const profileSrc = person?.profilePicture
        ? person.profilePicture.startsWith("http")
            ? person.profilePicture
            : `${apiBase}${person.profilePicture.startsWith("/") ? "" : "/uploads/"}${person.profilePicture
            }`
        : null;

    const displayName = person?.fullName || "Unknown User";
    const hospitalName = request?.hospitalId?.name || "Unknown Hospital";
    const timeText =
        tab === "ongoing" ? timeAgo(request?.createdAt) : timeAgo(request?.updatedAt);

    const onFinishClick = () => setShowConfirm(true);

    const confirmFinish = () => {
        startTransition(async () => {
            const res = await handleFinishRequest(request._id);

            if (res.success) {
                toast.success("Request finished successfully");
                setShowConfirm(false);
                router.refresh();
            } else {
                toast.error(res.message || "Failed to finish request");
            }
        });
    };

    const viewDetails = () => {
        setShowConfirm(false);
        router.push(`/user/history/${request?._id}?tab=${tab}${type ? `&type=${type}` : ""}`);
    };

    return (
        <>
            <div className="relative h-full rounded-2xl border bg-white p-6 pb-20 shadow-sm">
                {/* Ribbon */}
                <div className="group absolute right-4 top-4">
                    <span className={clsx("block h-4 w-4 rounded-sm", ribbon)} />
                    <div className="pointer-events-none absolute -top-2 right-0 z-20 hidden -translate-y-full whitespace-nowrap rounded-md border border-black/10 bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow-md group-hover:block">
                        {conditionHintMap[condition] || `Condition: ${request?.recipientCondition || "Unknown"}`}
                    </div>
                </div>

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border bg-gray-100">
                        {profileSrc ? (
                            <Image
                                src={profileSrc}
                                alt={displayName}
                                width={64}
                                height={64}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <User2 className="h-8 w-8 text-gray-400" />
                        )}
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-black">
                            {displayName}{" "}
                            {request?.recipientBloodId?.bloodGroup ? (
                                <span className="font-semibold">
                                    [{request.recipientBloodId.bloodGroup}]
                                </span>
                            ) : null}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            For: {String(request?.requestFor || "").toUpperCase()}
                            {tab === "ongoing" && type ? (
                                <span className="ml-2 rounded-full border px-2 py-0.5 text-[11px] font-medium text-gray-600">
                                    {type === "donating" ? "Donating" : "Requested"}
                                </span>
                            ) : null}
                        </p>

                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                            <MapPin size={14} className="text-red-600" />
                            <span className="font-medium">{hospitalName}</span>
                            {timeText ? <span className="text-gray-400">({timeText})</span> : null}
                        </div>
                    </div>
                </div>

                {/* Recipient Detail */}
                <div className="mt-5 text-sm">
                    <p className="font-semibold text-black">Recipient&apos;s Detail:</p>
                    <p className="mt-1 line-clamp-4 text-gray-700">{request?.recipientDetails}</p>
                </div>

                {/* Condition */}
                <div className="mt-4 text-sm">
                    <p className="font-semibold text-black">Condition:</p>
                    <p className="mt-1 capitalize text-gray-700">{request?.recipientCondition}</p>
                </div>

                {/* Absolute Actions */}
                <div className="absolute bottom-6 left-6 right-6 flex gap-2">
                    {isDonatingOngoing ? (
                        <button
                            disabled={isPending}
                            onClick={onFinishClick}
                            className={clsx(
                                "flex-1 rounded-lg py-2 text-sm font-semibold text-white",
                                isPending ? "cursor-not-allowed bg-red-400" : "bg-red-800 hover:bg-red-700"
                            )}
                        >
                            Finish
                        </button>
                    ) : null}

                    <Link
                        href={`/user/history/${request?._id}?tab=${tab}${type ? `&type=${type}` : ""}`}
                        className={clsx(
                            "rounded-lg border py-2 text-center text-sm font-semibold text-black hover:bg-gray-50 hover:underline",
                            isDonatingOngoing ? "flex-1" : "w-full"
                        )}
                    >
                        View Details
                    </Link>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onClick={() => setShowConfirm(false)} // click outside closes
                >
                    <div
                        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowConfirm(false)}
                            aria-label="Close"
                            className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-black"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-lg font-semibold text-black">Confirm Finish</h3>

                        <p className="mt-2 text-sm text-gray-600">
                            Are you sure you want to mark this request as <span className="font-semibold">finished</span>?
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                disabled={isPending}
                                onClick={confirmFinish}
                                className={clsx(
                                    "flex-1 rounded-xl py-2 text-sm font-semibold text-white",
                                    isPending ? "cursor-not-allowed bg-red-400" : "bg-red-800 hover:bg-red-700"
                                )}
                            >
                                {isPending ? "Finishing..." : "Yes, Finish"}
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
        </>
    );
}
