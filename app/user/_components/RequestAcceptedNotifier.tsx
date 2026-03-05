"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { handleGetMyRequestHistory } from "@/lib/actions/request/request-action";

const POLL_INTERVAL_MS = 30000;
const STORAGE_KEY = "bloodlink.accepted-request-notified";

function readNotifiedIds(): Set<string> {
    if (typeof window === "undefined") return new Set();

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return new Set();

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return new Set();

        return new Set(parsed.filter((v) => typeof v === "string"));
    } catch {
        return new Set();
    }
}

function writeNotifiedIds(ids: Set<string>) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
}

function getDonorName(donor: unknown) {
    if (!donor) return "Someone";
    if (typeof donor === "string") return "Someone";

    if (typeof donor === "object" && "fullName" in donor) {
        const fullName = (donor as { fullName?: unknown }).fullName;
        return typeof fullName === "string" && fullName.trim() ? fullName : "Someone";
    }

    return "Someone";
}

export default function RequestAcceptedNotifier() {
    useEffect(() => {
        let isMounted = true;

        const checkAcceptedRequests = async () => {
            const res = await handleGetMyRequestHistory();
            if (!res?.success || !isMounted) return;

            const notifiedIds = readNotifiedIds();
            const requestedOngoing = res.data?.ongoing?.requestedOngoing || [];

            for (const req of requestedOngoing) {
                const requestId = req?._id;
                const isAccepted = req?.requestStatus === "accepted";

                if (!requestId || !isAccepted || notifiedIds.has(requestId)) continue;

                const donorName = getDonorName(req?.donorId);
                toast.success(`${donorName} accepted your blood request`);
                notifiedIds.add(requestId);
            }

            writeNotifiedIds(notifiedIds);
        };

        checkAcceptedRequests();
        const timer = window.setInterval(checkAcceptedRequests, POLL_INTERVAL_MS);

        return () => {
            isMounted = false;
            window.clearInterval(timer);
        };
    }, []);

    return null;
}
