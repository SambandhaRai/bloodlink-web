"use client";

export type BloodGroupUI = {
    _id: string;
    bloodGroup: string;
};

const BRAND = "#A72636";

export default function BloodTypeSelector({
    groups,
    selectedId,
    onSelect,
    disabled,
}: {
    groups: BloodGroupUI[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    disabled?: boolean;
}) {
    return (
        <div className="flex flex-wrap gap-2.5">
            {groups.map((g) => {
                const id = (g._id ?? "").trim();
                const label = (g.bloodGroup ?? "").trim();
                const isSelected = selectedId === id;

                return (
                    <button
                        key={id || label}
                        type="button"
                        disabled={disabled || !id}
                        onClick={() => onSelect(id)}
                        className="rounded-[10px] border px-4 py-2.5 font-semibold transition disabled:opacity-60"
                        style={{
                            fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui",
                            borderColor: "rgba(0,0,0,0.35)",
                            background: isSelected ? BRAND : "#FFFFFF",
                            color: isSelected ? "#FFFFFF" : "#111827",
                        }}
                    >
                        {label || "Unknown"}
                    </button>
                );
            })}
        </div>
    );
}