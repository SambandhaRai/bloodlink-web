"use client";

import { useEffect, useState } from "react";

export default function Page() {
    const [status, setStatus] = useState<"idle" | "getting" | "saved" | "denied" | "error">("idle");

    useEffect(() => {
        if (!("geolocation" in navigator)) return;

        setStatus("getting");

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;

                    await fetch("/api/location", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ lat, lng }),
                    });

                    setStatus("saved");
                } catch {
                    setStatus("error");
                }
            },
            (err) => {
                if (err.code === err.PERMISSION_DENIED) setStatus("denied");
                else setStatus("error");
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 30000,
            }
        );
    }, []);

    return (
        <div className="w-full px-10 py-3 flex justify-between items-center">
            <label>Home</label>

            {/* Optional tiny status UI (remove if you want) */}
            <span className="text-xs text-gray-500">
                {status === "getting" && "Getting location..."}
                {status === "saved" && "Location saved"}
                {status === "denied" && "Location denied"}
                {status === "error" && "Location unavailable"}
            </span>
        </div>
    );
}