import { handleGetAllPendingRequests } from "@/lib/actions/request/request-action";
import RequestCard from "./_components/RequestCard";
import RequestSearch from "./_components/RequestSearch";

export default async function RequestsPage({
    searchParams,
}: {
    searchParams?: Promise<{
        page?: string;
        search?: string;
    }>;
}) {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams?.page || "1";
    const search = resolvedSearchParams?.search || "";

    const result = await handleGetAllPendingRequests({
        page,
        size: "6",
        search,
    });

    if (!result.success) {
        return (
            <div className="py-10 text-center text-red-600">
                Failed to load requests
            </div>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-6 py-10">
            <RequestSearch defaultValue={search} />

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {result.data.map((request: any) => (
                    <RequestCard key={request._id} request={request} />
                ))}
            </div>
        </section>
    );
}
