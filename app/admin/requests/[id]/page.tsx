import { handleGetRequestById } from "@/lib/actions/request/request-action";
import RequestDetailsCard from "../_components/RequestDetailsCard";

export default async function RequestDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await handleGetRequestById(id);

    if (!result.success) {
        return (
            <div className="min-h-screen bg-white">
                <div className="mx-auto max-w-3xl px-6 py-12">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {result.message || "Failed to fetch request"}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <section className="mx-auto max-w-3xl px-6 py-12">
                <RequestDetailsCard request={result.data} />
            </section>
        </div>
    );
}