"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import RegisterForm from "../../_components/register-form";

export default function Page() {
  const router = useRouter();

  return (
    <>
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute left-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
      >
        <ArrowLeft className="h-5 w-5 text-red-700" />
      </button>

      <h1 className="text-3xl font-semibold text-black">Sign Up</h1>
      <p className="text-sm font-extralight mt-2 text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-red-800 underline">
          Login
        </Link>
      </p>

      <RegisterForm />
    </>
  );
}
