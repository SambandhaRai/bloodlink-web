import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoginForm from "../_components/login-form";

export default function Page() {
  return (
    <div className="min-h-screen bg-red-800 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="grid grid-cols-2">
          {/* LEFT: Form shell */}
          <div className="relative p-8 text-center">
            {/* Back button */}
            <button
              type="button"
              className="absolute left-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="Go back"
            >
              {/* If you want it to actually go back, wrap in Link or use router.back() */}
              <ArrowLeft className="h-5 w-5 text-red-700" />
            </button>

            <div className="mx-auto max-w-md pt-8">
              <h1 className="text-3xl font-semibold text-black">Login</h1>
              <p className="text-sm font-extralight mt-2 text-gray-400">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-sm font-semibold text-red-800 underline">
                  Sign Up
                </Link>
              </p>

              <LoginForm />
            </div>
          </div>

          {/* RIGHT: Illustration */}
          <div className="hidden md:flex items-center justify-center p-5">
            <div className="relative w-full max-w-md">
              <Image
                src="/images/Login.png"
                alt="Login illustration"
                width={520}
                height={420}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
