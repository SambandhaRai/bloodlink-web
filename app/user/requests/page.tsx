import {
    handleGetAllPendingRequests,
    handleGetMatchedRequests,
} from "@/lib/actions/request/request-action";
import { handleGetProfile } from "@/lib/actions/user/user-action";
import RequestsTabsForm from "./_components/RequestTabsForm";
import { cookies } from "next/headers";

type LocationCookie = { lat: number; lng: number; ts: number };

async function readLocationCookie(): Promise<LocationCookie | null> {
    const cookieStore = await cookies();
    const raw = cookieStore.get("user_location")?.value;
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as LocationCookie;
        if (!Number.isFinite(parsed.lat) || !Number.isFinite(parsed.lng)) return null;
        return parsed;
    } catch {
        return null;
    }
}

function readProfileLocation(profile: any): { lat: number; lng: number } | null {
    const coordinates = profile?.location?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length !== 2) return null;

    const lng = Number(coordinates[0]);
    const lat = Number(coordinates[1]);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return { lat, lng };
}

export default async function RequestsPage({
    searchParams,
}: {
    searchParams?: Promise<{
        page?: string;
        search?: string;
        tab?: "matched" | "all";
        km?: string;
    }>;
}) {
    const sp = (await searchParams) || {};

    const page = sp.page || "1";
    const search = sp.search || "";
    const tab: "matched" | "all" = sp.tab === "matched" ? "matched" : "all";
    const km = sp.km || "5";

    const [profileRes, cookieLoc] = await Promise.all([
        handleGetProfile(),
        readLocationCookie(),
    ]);

    const profileLoc = profileRes.success ? readProfileLocation(profileRes.data) : null;
    const effectiveLoc = profileLoc ?? cookieLoc;

    let result:
        | { success: true; data: any[]; pagination?: any }
        | { success: false; message?: string };

    if (tab === "matched") {
        if (!effectiveLoc) {
            result = { success: true, data: [], pagination: undefined };
        } else {
            result = await handleGetMatchedRequests({
                lng: effectiveLoc.lng,
                lat: effectiveLoc.lat,
                km,
                page,
                size: "6",
                search,
            });
        }
    } else {
        result = await handleGetAllPendingRequests({
            page,
            size: "6",
            search,
        });
    }

    if (!result.success) {
        return (
            <div className="py-10 text-center text-red-600">
                {result.message || "Failed to load requests"}
            </div>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-6 py-10">
            <RequestsTabsForm
                initialTab={tab}
                defaultSearch={search}
                data={result.data}
                pagination={result.pagination}
                initialKm={km}
            />
        </section>
    );
}
