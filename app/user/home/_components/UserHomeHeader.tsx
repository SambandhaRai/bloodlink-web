import Image from "next/image";

function getImageUrl(file?: string | null) {
    if (!file) return "/images/placeholder-user.png";
    if (file.startsWith("http")) return file;

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return "/images/placeholder-user.png";

    const cleaned = file.replace(/^\/+/, "");
    if (cleaned.startsWith("uploads/")) return `${base}/${cleaned}`;
    return `${base}/uploads/${cleaned}`;
}

function getBloodLabel(bloodId: any) {
    if (!bloodId) return "Unknown";
    if (typeof bloodId === "string") return "Unknown";
    return bloodId.bloodGroup || "Unknown";
}

export default function UserHomeHeader({ user }: { user: any | null }) {
    if (!user) {
        return (
            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="text-sm text-gray-600">Couldn’t load your profile.</div>
            </div>
        );
    }

    const avatar = getImageUrl(user.profilePicture);
    const blood = getBloodLabel(user.bloodId);

    return (
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-black/10 bg-gray-50">
                        <Image src={avatar} alt={user.fullName || "User"} fill className="object-cover" sizes="56px" />
                    </div>

                    <div>
                        <div className="text-lg font-semibold text-black">{user.fullName}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                        Blood: {blood}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                        Phone: {user.phoneNumber || "—"}
                    </span>
                </div>
            </div>
        </div>
    );
}