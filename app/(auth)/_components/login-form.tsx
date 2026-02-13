"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginType } from "../schema/login-schema";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/lib/actions/auth-action";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const [pending, setTransition] = useTransition();
  const { checkAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (data: LoginType) => {
    try {
      const res = await handleLogin(data);
      if (!res.success) {
        throw new Error(res.message || "Login Failed");
      }
      await checkAuth();
      if (res.success) {
        if (res.data?.role == "admin") {
          toast.success("Login Successful! Redirecting to Admin Home Page...");
          return router.replace("/admin");
        }
        if (res.data?.role === "user") {
          toast.success("Login Successful! Redirecting to Home Page...");
          return router.replace("/user/home");
        }
        return router.replace("/");
      }
    } catch (err: Error | any) {
      toast.error(err.message || "Failed to Login");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="mt-5 space-y-5 text-start">
      {/* Email */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Email</label>

        <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none
          focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100">
          <Mail className="h-5 w-5 text-gray-400" />

          <input
            type="email"
            {...register("email")}
            placeholder="abc@email.com"
            className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
          />
        </div>

        {errors.email && <p className="mt-1 text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Password</label>

        <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none
          focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100">
          <Lock className="h-5 w-5 text-gray-400" />

          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="••••••••"
            className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 active:scale-95"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Remember me / Forgot pw */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input
            type="checkbox"
            className="h-3 w-3 rounded border-gray-300 text-red-700 focus:ring-red-800"
          />
          Remember Me
        </label>

        <Link href="/forgot-password" className="text-sm font-semibold text-red-800 underline">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full rounded-lg bg-red-800 py-3 text-lg font-semibold text-white"
      >
        {isSubmitting || pending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}