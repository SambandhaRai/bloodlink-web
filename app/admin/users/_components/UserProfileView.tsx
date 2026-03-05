import Image from "next/image";
import { UserType } from "../../schema/user-schema";

function getImageUrl(file?: string | null) {
    if (!file) return "/images/placeholder-user.png";
    if (file.startsWith("http")) return file;

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return "/images/placeholder-user.png";

    const cleaned = file.replace(/^\/+/, "");
    if (cleaned.startsWith("uploads/")) return `${base}/${cleaned}`;
    return `${base}/uploads/${cleaned}`;
}

function formatDate(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4">
            <div className="text-sm font-semibold text-gray-600">{label}</div>
            <div className="sm:col-span-2 text-sm text-black">
                {value ?? <span className="text-gray-500">—</span>}
            </div>
        </div>
    );
}

function getBloodLabel(bloodId: UserType["bloodId"]) {
    if (!bloodId) return "Unknown";
    if (typeof bloodId === "string") return "Unknown";
    return bloodId.bloodGroup || "Unknown";
}

export default function UserProfileView({ user }: { user: UserType }) {
    const avatar = getImageUrl(user.profilePicture);
    const bloodLabel = getBloodLabel(user.bloodId);

    return (
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-black/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-black/10 bg-gray-50">
                        <Image
                            src={avatar}
                            alt={user.fullName || "User"}
                            fill
                            className="object-cover"
                            sizes="64px"
                        />
                    </div>

                    <div>
                        <div className="text-lg font-semibold text-black">
                            {user.fullName || "Unnamed User"}
                        </div>
                        <div className="text-sm text-gray-600">
                            ID: <span className="font-mono">{user._id}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                        Blood: {bloodLabel}
                    </span>

                    <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                        Created: {formatDate(user.createdAt)}
                    </span>
                </div>
            </div>

            <div className="p-5 space-y-4">
                <Row label="Full Name" value={user.fullName} />
                <Row label="Email" value={user.email} />
                <Row label="Phone" value={user.phoneNumber} />
                <Row label="Gender" value={user.gender} />
                <Row label="Date of Birth" value={user.dob ? formatDate(user.dob) : "—"} />
                <Row label="Blood Group" value={bloodLabel} />
                <Row label="Health Conditions" value={user.healthConditions || "—"} />
                <Row label="Updated At" value={formatDate(user.updatedAt)} />
            </div>
        </div>
    );
}