"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import BloodTypeSelector, { BloodGroupUI } from "./BloodTypeSelector";
import { requestSchema, type RequestType } from "../../schema/request-schema";
import { handleCreateRequest } from "@/lib/actions/request/request-action";
import { ChevronDown } from "lucide-react";

export type HospitalUI = {
    _id: string;
    name: string;
    isActive: boolean;
};

type RequestForType = "self" | "others";
type ConditionType = "critical" | "urgent" | "stable";

const BRAND = "#A72636";

function conditionLabel(c: ConditionType) {
    switch (c) {
        case "critical":
            return "Critical (Life-threatening)";
        case "urgent":
            return "Urgent (Needs blood soon)";
        case "stable":
            return "Stable (Under observation)";
    }
}

const fieldWrap =
    "mt-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 " +
    "focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100";

const inputCls =
    "w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400";

const selectCls =
    "w-full appearance-none bg-transparent text-sm text-gray-700 outline-none";

// Hospital Autocomplete
type HospitalAutocompleteProps = {
    hospitals: HospitalUI[];
    valueId: string;
    onChangeId: (id: string) => void;
    error?: string;
    disabled?: boolean;
};

function HospitalAutocomplete({
    hospitals,
    valueId,
    onChangeId,
    error,
    disabled,
}: HospitalAutocompleteProps) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    const selected = useMemo(
        () => hospitals.find((h) => h._id === valueId) ?? null,
        [hospitals, valueId]
    );

    useEffect(() => {
        setQuery(selected?.name ?? "");
    }, [selected?._id]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return hospitals.slice(0, 10);

        return hospitals
            .filter((h) => h.name.toLowerCase().includes(q))
            .slice(0, 10);
    }, [hospitals, query]);

    return (
        <div className="relative">
            <div className={`${fieldWrap} relative pr-10`}>
                <input
                    value={query}
                    onChange={(e) => {
                        const v = e.target.value;
                        setQuery(v);
                        setOpen(true);

                        if (valueId) onChangeId("");
                    }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => {
                        setTimeout(() => setOpen(false), 120);
                    }}
                    placeholder="Search hospital..."
                    className={inputCls}
                    disabled={disabled}
                />

                <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
            </div>

            {open && !disabled && filtered.length > 0 && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl text-black border border-gray-200 bg-white shadow-lg">
                    <ul className="max-h-56 overflow-auto py-1">
                        {filtered.map((h) => (
                            <li key={h._id}>
                                <button
                                    type="button"
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        onChangeId(h._id);
                                        setQuery(h.name);
                                        setOpen(false);
                                    }}
                                >
                                    {h.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <p className="mt-1 text-red-500">{error}</p>}
        </div>
    );
}

export default function RequestBloodForm({
    bloodGroups,
    bloodError,
    hospitals,
    hospitalError,
}: {
    bloodGroups: BloodGroupUI[];
    bloodError: string | null;
    hospitals: HospitalUI[];
    hospitalError: string | null;
}) {
    const [pending, startTransition] = useTransition();

    const activeHospitals = useMemo(
        () => hospitals.filter((h) => h.isActive),
        [hospitals]
    );

    const DEFAULT_VALUES: RequestType = {
        requestFor: "self",
        recipientBloodId: "",
        recipientDetails: "",
        recipientCondition: "urgent",
        hospitalId: "",
        relationToPatient: undefined,
        patientName: undefined,
        patientPhone: undefined,
    };

    const {
        setValue,
        watch,
        register,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<RequestType>({
        resolver: zodResolver(requestSchema),
        mode: "onSubmit",
        shouldUnregister: true,
        defaultValues: DEFAULT_VALUES,
    });

    const requestFor = watch("requestFor") ?? "self";
    const isOthers = requestFor === "others";

    useEffect(() => {
        setValue("requestFor", "self", {
            shouldValidate: false,
            shouldDirty: false,
        });
        clearErrors();
    }, [setValue, clearErrors]);

    const onTabChange = (v: RequestForType) => {
        setValue("requestFor", v);
        clearErrors();

        if (v === "self") {
            setValue("relationToPatient", "");
            setValue("patientName", "");
            setValue("patientPhone", "");
        }
    };

    const submit = async (data: RequestType) => {
        const cleaned: RequestType =
            data.requestFor === "self"
                ? {
                    ...data,
                    relationToPatient: undefined,
                    patientName: undefined,
                    patientPhone: undefined,
                }
                : data;

        startTransition(async () => {
            const res = await handleCreateRequest(cleaned);
            if (!res.success) {
                toast.error(res.message || "Create request failed");
                return;
            }
            toast.success("Posted Request Successfully");
            reset(DEFAULT_VALUES);
            clearErrors();
        });
    };

    return (
        <div className="min-h-screen mt-5 bg-gray-100">
            <main className="relative">
                <div className="relative mx-auto max-w-3xl px-3 pb-10 pt-3">
                    <div className="rounded-[15px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                        <div className="p-5">
                            <form onSubmit={handleSubmit(submit)} className="space-y-6">
                                {/* Tabs */}
                                <div className="rounded-2xl bg-gray-100 p-1">
                                    <div className="grid grid-cols-2 gap-1">
                                        <button
                                            type="button"
                                            disabled={pending || isSubmitting}
                                            onClick={() => onTabChange("self")}
                                            className="h-10 rounded-xl text-sm font-semibold transition disabled:opacity-60"
                                            style={{
                                                background:
                                                    requestFor === "self" ? BRAND : "transparent",
                                                color: requestFor === "self" ? "white" : "#374151",
                                            }}
                                        >
                                            For Myself
                                        </button>
                                        <button
                                            type="button"
                                            disabled={pending || isSubmitting}
                                            onClick={() => onTabChange("others")}
                                            className="h-10 rounded-xl text-sm font-semibold transition disabled:opacity-60"
                                            style={{
                                                background:
                                                    requestFor === "others" ? BRAND : "transparent",
                                                color: requestFor === "others" ? "white" : "#374151",
                                            }}
                                        >
                                            For Others
                                        </button>
                                    </div>
                                </div>

                                {/* Blood Group */}
                                <div className="space-y-2">
                                    <h3 className="text-[20px] text-black leading-[1.2] font-semibold">
                                        Recipient Blood Type:
                                    </h3>

                                    {bloodError ? (
                                        <p className="text-sm text-red-600">{bloodError}</p>
                                    ) : bloodGroups.length === 0 ? (
                                        <p className="text-sm text-gray-500">
                                            No blood groups available
                                        </p>
                                    ) : (
                                        <>
                                            <BloodTypeSelector
                                                groups={bloodGroups}
                                                selectedId={watch("recipientBloodId") || null}
                                                onSelect={(id) =>
                                                    setValue("recipientBloodId", id, {
                                                        shouldValidate: true,
                                                    })
                                                }
                                                disabled={pending || isSubmitting}
                                            />
                                            {errors.recipientBloodId && (
                                                <p className="mt-1 text-red-500">
                                                    {errors.recipientBloodId.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Recipient Details */}
                                <div>
                                    <label className="text-[20px] text-black leading-[1.2] font-semibold">
                                        Recipient&apos;s Details:
                                    </label>
                                    <div className={`${fieldWrap} items-start`}>
                                        <textarea
                                            rows={4}
                                            placeholder="Type Here..."
                                            {...register("recipientDetails")}
                                            className="w-full resize-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                                            disabled={pending || isSubmitting}
                                        />
                                    </div>
                                    {errors.recipientDetails && (
                                        <p className="mt-1 text-red-500">
                                            {errors.recipientDetails.message}
                                        </p>
                                    )}
                                </div>

                                {/* Condition */}
                                <div className="space-y-1">
                                    <label className="text-[20px] text-black leading-[1.2] font-semibold">
                                        Recipient&apos;s Condition:
                                    </label>
                                    <div className={`${fieldWrap} relative pr-10`}>
                                        <select
                                            {...register("recipientCondition")}
                                            className={`${selectCls} cursor-pointer`}
                                            disabled={pending || isSubmitting}
                                        >
                                            <option value="critical">
                                                {conditionLabel("critical")}
                                            </option>
                                            <option value="urgent">{conditionLabel("urgent")}</option>
                                            <option value="stable">{conditionLabel("stable")}</option>
                                        </select>

                                        <ChevronDown
                                            size={18}
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                    </div>
                                    {errors.recipientCondition && (
                                        <p className="mt-1 text-red-500">
                                            {errors.recipientCondition.message}
                                        </p>
                                    )}
                                </div>

                                {/* Hospital (Autocomplete) */}
                                <div className="space-y-1">
                                    <label className="text-[20px] text-black leading-[1.2] font-semibold">
                                        Hospital Name:
                                    </label>

                                    {hospitalError ? (
                                        <p className="text-sm text-red-600">{hospitalError}</p>
                                    ) : activeHospitals.length === 0 ? (
                                        <p className="text-sm text-gray-500">
                                            No hospitals available
                                        </p>
                                    ) : (
                                        <HospitalAutocomplete
                                            hospitals={activeHospitals}
                                            valueId={watch("hospitalId") || ""}
                                            onChangeId={(id) =>
                                                setValue("hospitalId", id, { shouldValidate: true })
                                            }
                                            error={errors.hospitalId?.message}
                                            disabled={pending || isSubmitting}
                                        />
                                    )}
                                </div>

                                {/* Others */}
                                {isOthers && (
                                    <div className="space-y-4">
                                        <h3 className="text-[20px] text-black leading-[1.2] font-semibold">
                                            Patient&apos;s Information:
                                        </h3>

                                        <div>
                                            <div className={fieldWrap}>
                                                <input
                                                    {...register("relationToPatient")}
                                                    placeholder="Relation to patient (e.g. Brother)"
                                                    className={inputCls}
                                                    disabled={pending || isSubmitting}
                                                />
                                            </div>
                                            {errors.relationToPatient && (
                                                <p className="mt-1 text-red-500">
                                                    {errors.relationToPatient.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <div className={fieldWrap}>
                                                <input
                                                    {...register("patientName")}
                                                    placeholder="Patient name"
                                                    className={inputCls}
                                                    disabled={pending || isSubmitting}
                                                />
                                            </div>
                                            {errors.patientName && (
                                                <p className="mt-1 text-red-500">
                                                    {errors.patientName.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <div className={fieldWrap}>
                                                <input
                                                    {...register("patientPhone")}
                                                    placeholder="Patient phone number"
                                                    className={inputCls}
                                                    disabled={pending || isSubmitting}
                                                />
                                            </div>
                                            {errors.patientPhone && (
                                                <p className="mt-1 text-red-500">
                                                    {errors.patientPhone.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={pending || isSubmitting}
                                    className="w-full rounded-lg py-3 text-lg font-semibold text-white bg-red-800 hover:bg-red-700 disabled:opacity-60"
                                >
                                    {pending || isSubmitting ? "Posting..." : "Post Request"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}