import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoginForm from "../_components/login-form";

export default function Page() {
  return (
    <>
      {/* Back button */}
      <Link
        href="/"
        className="absolute left-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
      >
        <ArrowLeft className="h-5 w-5 text-red-700" />
      </Link>

      <h1 className="text-3xl font-semibold text-black">Login</h1>
      <p className="text-sm font-extralight mt-2 text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-red-800 underline">
          Sign Up
        </Link>
      </p>

      <LoginForm />
    </>
  );
}
