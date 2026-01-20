"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginType } from "../schema/login-schema";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/lib/actions/auth-action";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

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

  const submit = async (data: LoginType) => {
    try{
      const res = await handleLogin(data);
      if(!res.success) {
        throw new Error(res.message || "Login Failed");
      }
      await checkAuth();
      toast.success("Login Successful! Redirecting to Home Page...")
      setTransition(() => {
        router.push("/home");
      });
    } catch (err: Error | any) {
      toast.error(err.message || "Failed to Login");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="mt-5 space-y-5 text-start">
      {/* Email */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Email</label>
        <input
          type="email"
          {...register("email")}
          className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
          focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black"
        />
        {errors.email && <p className="mt-1 text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Password</label>
        <input
          type="password"
          {...register("password")}
          className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
          focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black"
        />
        {errors.password && <p className="mt-1 text-red-500">{errors.password.message}</p>}
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

        <Link href="/forgotpassword" className="text-sm font-semibold text-red-800 underline">
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