"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { MapPin } from "lucide-react";

import { hospitalSchema, type HospitalType } from "../../schema/hospital-schema";
import { handleAddHospital } from "@/lib/actions/admin/hospital-action";

const BRAND = "#A72636";

const fieldWrap =
    "mt-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 " +
    "focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100";

const inputCls =
    "w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400";

export default function AddHospitalForm() {
    const [pending, startTransition] = useTransition();
    const [geoLoading, setGeoLoading] = useState(false);

    const DEFAULT_VALUES: HospitalType = {
        name: "",
        lng: 85.3239,
        lat: 27.7172,
    };

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<HospitalType>({
        resolver: zodResolver(hospitalSchema),
        mode: "onSubmit",
        defaultValues: DEFAULT_VALUES,
    });

    useEffect(() => {
        clearErrors();
    }, [clearErrors]);

    const useMyLocation = async () => {
        if (!("geolocation" in navigator)) {
            toast.error("Geolocation is not supported in this browser.");
            return;
        }

        setGeoLoading(true);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                setValue("lat", lat, { shouldValidate: true });
                setValue("lng", lng, { shouldValidate: true });

                toast.success("Location updated");
                setGeoLoading(false);
            },
            (err) => {
                setGeoLoading(false);

                if (err.code === err.PERMISSION_DENIED) toast.error("Location permission denied.");
                else if (err.code === err.POSITION_UNAVAILABLE) toast.error("Location unavailable. Try again.");
                else if (err.code === err.TIMEOUT) toast.error("Location request timed out.");
                else toast.error("Failed to get location.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
        );
    };

    const submit = async (data: HospitalType) => {
        const payload = {
            name: data.name.trim(),
            location: {
                type: "Point" as const,
                coordinates: [data.lng, data.lat] as [number, number],
            },
        };

        startTransition(async () => {
            const res = await handleAddHospital(payload);

            if (!res?.success) {
                toast.error(res?.message || "Failed to add hospital");
                return;
            }

            toast.success("Hospital added successfully");
            reset(DEFAULT_VALUES);
            clearErrors();
        });
    };

    return (
        <div className="min-h-screen mt-5 bg-white">
            <main className="relative">
                <div className="relative mx-auto max-w-3xl px-3 pb-10 pt-3">
                    <div className="rounded-[15px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                        <div className="p-5">
                            <h2 className="text-[22px] font-semibold text-black">Add Hospital</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Enter hospital name and location (lng/lat).
                            </p>

                            <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-6">
                                {/* Hospital name */}
                                <div>
                                    <label className="text-[20px] text-black leading-[1.2] font-semibold">
                                        Hospital Name:
                                    </label>
                                    <div className={fieldWrap}>
                                        <input
                                            {...register("name")}
                                            placeholder="e.g. HAMS Hospital"
                                            className={inputCls}
                                            disabled={pending || isSubmitting}
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1 text-red-500">{errors.name.message}</p>}
                                </div>

                                {/* Location header */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-[20px] text-black leading-[1.2] font-semibold">
                                            Location (Longitude/Latitude):
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={useMyLocation}
                                            disabled={pending || isSubmitting || geoLoading}
                                            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-60"
                                        >
                                            <MapPin size={16} />
                                            {geoLoading ? "Getting..." : "Use my location"}
                                        </button>
                                    </div>

                                    {/* lng/lat */}
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <div className={fieldWrap}>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    {...register("lng", { valueAsNumber: true })}
                                                    placeholder="Longitude (e.g. 85.3456)"
                                                    className={inputCls}
                                                    disabled={pending || isSubmitting}
                                                />
                                            </div>
                                            {errors.lng && <p className="mt-1 text-red-500">{errors.lng.message}</p>}
                                        </div>

                                        <div>
                                            <div className={fieldWrap}>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    {...register("lat", { valueAsNumber: true })}
                                                    placeholder="Latitude (e.g. 27.7333)"
                                                    className={inputCls}
                                                    disabled={pending || isSubmitting}
                                                />
                                            </div>
                                            {errors.lat && <p className="mt-1 text-red-500">{errors.lat.message}</p>}
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500">
                                        Note: Coordinates must be in the format <b>[lng, lat]</b> for your backend.
                                    </p>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={pending || isSubmitting}
                                    className="w-full rounded-lg py-3 text-lg font-semibold text-white disabled:opacity-60"
                                    style={{ backgroundColor: BRAND }}
                                >
                                    {pending || isSubmitting ? "Saving..." : "Add Hospital"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}