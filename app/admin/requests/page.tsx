import RequestsList from "./_components/RequestsList";
import { handleGetAllPendingRequests } from "@/lib/actions/request/request-action";

export default async function RequestsPage({
    searchParams,
}: {
    searchParams: { page?: string; size?: string; search?: string };
}) {
    const page = searchParams.page || "1";
    const size = searchParams.size || "9";
    const search = searchParams.search || "";

    const res = await handleGetAllPendingRequests({
        page,
        size,
        search,
    });

    return (
        <div className="mt-5 space-y-4">
            <div>
                <h1 className="text-xl font-semibold text-black">Requests</h1>
                <p className="text-sm text-gray-500">Find and accept blood requests.</p>
            </div>

            <RequestsList
                defaultSearch={search}
                data={res.success ? res.data : []}
                pagination={res.success ? res.pagination : null}
            />
        </div>
    );
}