import Link from "next/link";
import AddHospitalForm from "../_components/AddHospitalForm";

export default function AddHospitalPage() {
    return (
        <section className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Add Hospital</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Create a new hospital with a GeoJSON location.
                        </p>
                    </div>

                    <Link
                        href="/admin/hospital"
                        className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    >
                        Back
                    </Link>
                </div>

                {/* Form keeps its own design */}
                <AddHospitalForm />
            </div>
        </section>
    );
}