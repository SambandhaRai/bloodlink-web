import HistoryRequestDetailsCard from "../_components/HistoryRequestDetailsCard";
import { handleGetRequestById } from "@/lib/actions/request/request-action";

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{
        tab?: "ongoing" | "donated" | "received";
        type?: "requested" | "donating";
    }>;
}) {
    const { id } = await params;
    const sp = await searchParams;

    const tab = sp?.tab ?? "ongoing";
    const type = sp?.type;

    const res = await handleGetRequestById(id);

    if (!res?.success) {
        return (
            <div className="mx-auto max-w-2xl px-6 py-10 text-center text-red-600">
                {res?.message || "Failed to load request"}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <section className="mx-auto max-w-3xl px-6 py-12">
                <HistoryRequestDetailsCard request={res.data} tab={tab} type={type} />
            </section>
        </div>
    );
}