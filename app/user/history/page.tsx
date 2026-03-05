import { handleGetMyRequestHistory } from "@/lib/actions/request/request-action";
import HistoryClient from "./_components/HistoryClient";

export default async function Page() {
    const res = await handleGetMyRequestHistory();

    const history = res.success
        ? res.data
        : { donated: [], ongoing: { requestedOngoing: [], donationOngoing: [] }, received: [] };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <HistoryClient history={history} />
        </div>
    );
}