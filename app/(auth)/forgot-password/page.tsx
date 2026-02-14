"use client";

import NextLink from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  requestPasswordResetSchema,
  RequestPasswordResetType,
} from "../schema/request-password-reset-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "@/lib/api/user/user";
import { toast } from "react-toastify";
import { ArrowLeft, Mail } from "lucide-react";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordResetType>({
    resolver: zodResolver(requestPasswordResetSchema),
  });

  const onSubmit = async (data: RequestPasswordResetType) => {
    try {
      const response = await requestPasswordReset(data.email);

      if (response.success) {
        toast.success("Password reset link sent to your email.");
      } else {
        toast.error(response.message || "Failed to request password reset.");
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to request password reset.");
    }
  };

  return (
    <div className="min-h-screen bg-red-800 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="grid lg:grid-cols-2">
               {/* LEFT: Visual panel */}
                <div className="relative hidden lg:block min-h-120">
                    {/* Background */}
                    <div className="absolute inset-0 bg-linear-to-br from-red-900 to-red-700" />
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_45%)]" />

                    {/* Illustration */}
                    <div className="relative h-full flex items-center justify-center overflow-visible p-10">
                        <Image
                            src="/images/forgot-pw.png"
                            alt="Forgot password illustration"
                            width={760}
                            height={760}
                            priority
                            className="scale-125 max-h-full max-w-full w-auto object-contain"
                        />
                    </div>
                </div>


                {/* RIGHT: Form */}
                <div className="relative p-8 sm:p-12">
                    {/* Back button */}
                    <NextLink
                        href="/"
                        className="absolute left-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50"
                    >
                        <ArrowLeft className="h-5 w-5 text-red-700" />
                    </NextLink>

                    <div className="mx-auto max-w-md pt-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-semibold text-gray-900">
                                Reset password
                            </h1>
                            <p className="mt-2 text-sm text-gray-500">
                                Enter the email linked to your account.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Email address
                                </label>

                                <div className="mt-2 w-full flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <input
                                    type="email"
                                    {...register("email")}
                                    placeholder="abc@email.com"
                                    className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                                    />
                                </div>

                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">
                                    {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-xl bg-red-800 py-3 text-sm font-semibold text-white shadow-md shadow-red-800/20 hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? "Sending..." : "Send reset link"}
                            </button>

                            <div className="text-center text-sm text-gray-500">
                                Remembered your password?{" "}
                                <NextLink
                                    href="/login"
                                    className="font-medium text-red-800 hover:underline"
                                >
                                    Back to login
                                </NextLink>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
