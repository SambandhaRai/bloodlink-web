"use client";

import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleResetPassword } from "@/lib/actions/user/user-action";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  resetPasswordSchema,
  ResetPasswordType,
} from "../schema/reset-password-schema";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";

export default function ResetPasswordForm({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: ResetPasswordType) => {
    try {
      const response = await handleResetPassword(token, data.password);

      if (response.success) {
        toast.success("Password reset successfully");
        router.replace("/login");
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
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
            Set new password
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Choose a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>

            <div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100">
              <Lock className="h-5 w-5 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirm New Password
            </label>

            <div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100">
              <Lock className="h-5 w-5 text-gray-400" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-red-800 py-3 text-sm font-semibold text-white shadow-md shadow-red-800/20 hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Resetting..." : "Reset password"}
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
  );
}
