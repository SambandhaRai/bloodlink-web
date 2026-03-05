import RequestsList from "./_components/RequestsList";
import { handleGetAllPendingRequests } from "@/lib/actions/request/request-action";

export default async function RequestsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; size?: string; search?: string }>;
}) {
    const params = await searchParams;
    const page = params.page || "1";
    const size = params.size || "9";
    const search = params.search || "";

    const res = await handleGetAllPendingRequests({
        page,
        size,
        search,
    });

    return (
        <div className="mt-5 space-y-4">
            <div>
                <h1 className="text-xl font-semibold text-black">Requests</h1>
            </div>

            <RequestsList
                defaultSearch={search}
                data={res.success ? res.data : []}
                pagination={res.success ? res.pagination : null}
            />
        </div>
    );
}
