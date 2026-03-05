import Link from "next/link";
import RequestCard from "../../requests/_components/RequestCard";

export default function HomeRequestsPreview({
    data,
    total,
}: {
    data: any[];
    total: number;
}) {
    return (
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-base font-semibold text-black">Pending Requests</div>
                    <div className="text-sm text-gray-500">Latest requests you can accept</div>
                </div>

                <Link href="/user/requests" className="text-sm font-semibold text-red-800 hover:underline">
                    View all ({total || 0})
                </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
                {data?.length ? (
                    data.map((r) => <RequestCard key={r._id} request={r} />)
                ) : (
                    <div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
                        No pending requests right now.
                    </div>
                )}
            </div>
        </div>
    );
}