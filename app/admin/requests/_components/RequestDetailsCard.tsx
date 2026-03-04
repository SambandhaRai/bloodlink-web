"use client";

import Image from "next/image";
import clsx from "clsx";
import { MapPin, User2, X } from "lucide-react";
import { useRouter } from "next/navigation";

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
    const donor = request?.donorId && typeof request.donorId === "object" ? request.donorId : null;

    const donorProfileSrc = donor?.profilePicture
        ? donor.profilePicture.startsWith("http")
            ? donor.profilePicture
            : `${apiBase}${donor.profilePicture.startsWith("/") ? "" : "/uploads/"}${donor.profilePicture}`
        : null;

    const router = useRouter();

    return (
        <div className="relative w-full">
            <div className="relative w-full rounded-2xl bg-white p-6 shadow-xl">
                {/* ribbon */}
                <div className="group absolute right-15 top-7 z-30">
                    <span
                        className={clsx(
                            "block h-4 w-4 rounded-sm",
                            conditionColorMap[condition] || "bg-gray-400"
                        )}
                    />
                    <div className="pointer-events-none absolute -top-2 right-0 z-20 hidden -translate-y-full whitespace-nowrap rounded-md border border-black/10 bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow-md group-hover:block">
                        {conditionHintMap[condition] || `Condition: ${request?.recipientCondition || "Unknown"}`}
                    </div>
                </div>

                {/* close */}
                <button
                    onClick={() => router.back()}
                    className="absolute right-5 top-5 z-20 rounded-md p-2 hover:bg-gray-100"
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

                    {donor ? (
                        <div className="rounded-xl border bg-gray-50 p-4 text-sm">
                            <p className="font-semibold text-black">Donor Info:</p>

                            <div className="mt-3 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border bg-white">
                                    {donorProfileSrc ? (
                                        <Image
                                            src={donorProfileSrc}
                                            alt={donor?.fullName || "Donor"}
                                            width={48}
                                            height={48}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User2 className="h-6 w-6 text-gray-400" />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-gray-900">
                                        {donor?.fullName || "-"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {donor?.bloodId?.bloodGroup ? `Blood: ${donor.bloodId.bloodGroup}` : "Blood: -"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="font-medium text-gray-800">{donor?.phoneNumber || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="font-medium text-gray-800">{donor?.email || "-"}</p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
