"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { handleUpdateUserLocation } from "@/lib/actions/user/user-action";

type Props = {
    initialLocation?: {
        lat: number;
        lng: number;
    } | null;
};

export default function HomeLocationPermission({ initialLocation = null }: Props) {
    const [loading, setLoading] = useState(false);
    const [savedLocation, setSavedLocation] = useState(initialLocation);

    const askAndSaveLocation = async () => {
        if (!("geolocation" in navigator)) {
            toast.error("Geolocation is not supported in this browser.");
            return;
        }

        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                try {
                    const res = await handleUpdateUserLocation({ lat, lng });

                    if (!res?.success) {
                        toast.error(res?.message || "Failed to save location");
                        setLoading(false);
                        return;
                    }

                    setSavedLocation({ lat, lng });
                    toast.success(res?.message || "Location saved successfully");
                } catch {
                    toast.error("Failed to save location");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setLoading(false);
                if (err.code === err.PERMISSION_DENIED) {
                    toast.error("Location permission denied.");
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    toast.error("Location unavailable. Try again.");
                } else if (err.code === err.TIMEOUT) {
                    toast.error("Location request timed out.");
                } else {
                    toast.error("Failed to get location.");
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
        );
    };

    return (
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-black">Location for Matched Requests</h2>
                    <p className="text-sm text-gray-600">
                        Enable your location so we can show nearby matched blood requests.
                    </p>
                    {savedLocation && (
                        <p className="mt-1 text-xs text-gray-500">
                            Saved: {savedLocation.lat.toFixed(5)}, {savedLocation.lng.toFixed(5)}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={askAndSaveLocation}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-900 disabled:opacity-60"
                >
                    <MapPin size={16} />
                    {loading ? "Saving..." : savedLocation ? "Update Location" : "Enable Location"}
                </button>
            </div>
        </div>
    );
}
