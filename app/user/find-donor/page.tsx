import { handleGetAllHospitals } from "@/lib/actions/hospital/hospital-actions";
import RequestBloodClient from "./_components/RequestBloodForm";
import { handleGetAllBloodGroups } from "@/lib/actions/admin/bloodGroup-action";

export default async function Page() {
    const bloodRes = await handleGetAllBloodGroups();
    const hospitalRes = await handleGetAllHospitals();

    return (
        <RequestBloodClient
            bloodGroups={bloodRes.success ? bloodRes.data : []}
            bloodError={!bloodRes.success ? bloodRes.message : null}
            hospitals={hospitalRes.success ? hospitalRes.data : []}
            hospitalError={!hospitalRes.success ? hospitalRes.message : null}
        />
    );
}