"use client";

import { handleGetProfile } from "@/lib/actions/user/user-action";
import UpdateUserForm from "../../_components/UpdateUserForm";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const response = await handleGetProfile();
      if (!response.success) {
        throw new Error("Failed to fetch user data");
      }
      setUser(response.data);
    })();
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-red-800 flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full
          border border-gray-200 bg-white hover:bg-gray-50 transition"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-red-700" />
        </button>

        <div className="p-8 sm:p-12">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900">
              Update Profile
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Keep your details up to date for better matching and requests.
            </p>
          </div>

          <UpdateUserForm user={user} />
        </div>
      </div>
    </div>
  );
}
