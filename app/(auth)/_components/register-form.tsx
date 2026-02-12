"use client";

import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterType } from "../schema/register-schema";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleRegister } from "@/lib/actions/auth-action";
import { handleGetAllBloodGroups } from "@/lib/actions/admin/bloodGroup-action";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [pending, setTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  type BloodGroup = { _id: string; bloodGroup: string };

  const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([]);
  const [bgLoading, setBgLoading] = useState(false);
  
  useEffect(() => {
    (async () => {
      try {
        setBgLoading(true);
        const res = await handleGetAllBloodGroups();
        if (res.success) {
          setBloodGroups(res.data);
        } else {
          console.error("Failed to fetch blood groups:", res.message);
        }
      } catch (err) {
        console.error("Blood group fetch crashed:", err);
      } finally {
        setBgLoading(false);
      }
    })();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const submit = async (data: RegisterType) => {
    try {
      const res = await handleRegister(data);
      if(!res.success){
        throw new Error(res.message || "Registration Failed");
      }
      toast.success("Registration successful! Redirecting to Login Page....");
      setTransition(() => {
        router.push("/login");
      });
    } catch (err: Error | any) {
      toast.error(err.message || "Registration Failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="mt-5 space-y-5 text-start">
      {/* Full Name */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Full Name</label>
        <input
          type="text"
          placeholder="Enter you full name"
          {...register("fullName")}
          className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
            focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black placeholder:text-sm place-holder:font-light placeholder:text-gray-400"
        />
        {errors.fullName && <p className="mt-1 text-red-500">{errors.fullName.message}</p>}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Date of Birth</label>
        <input
          type="date"
          placeholder="DD/MM/YYYY"
          {...register("dob")}
          className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
            focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black placeholder:text-sm place-holder:font-light placeholder:text-gray-400"
        />
        {errors.dob && <p className="mt-1 text-red-500">{errors.dob.message}</p>}
      </div>

      {/* Phone Number */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Phone Number</label>
        <input
          type="text"
          placeholder="98XXXXXXXX"
          {...register("phoneNumber")}
          className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
            focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black placeholder:text-sm placeholder:text-gray-400"
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-red-500">{errors.phoneNumber.message}</p>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">Gender</label>
        <div className="relative">
          <select
            {...register("gender")}
            defaultValue=""
            className="
              w-full
              appearance-none
              rounded-lg
              border border-gray-200
              px-4 py-2.5 pr-10
              text-sm text-gray-700
              focus:border-red-600
              focus:ring-2 focus:ring-red-100
            "
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
        {errors.gender && <p className="mt-1 text-red-500">{errors.gender.message}</p>}
      </div>

      {/* Blood Group */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">Blood Group</label>

        <div className="relative">
          <select
            {...register("bloodId")}
            defaultValue=""
            className="
              w-full
              appearance-none
              rounded-lg
              border border-gray-200
              px-4 py-2.5 pr-10
              text-sm text-gray-700
              focus:border-red-600
              focus:ring-2 focus:ring-red-100
            "
          >
            <option value="" disabled>
              {bgLoading ? "Loading blood groups..." : "Select your blood group"}
            </option>

            {bloodGroups.map((bg) => (
              <option key={bg._id} value={bg._id}>
                {bg.bloodGroup}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
        {errors.bloodId && <p className="mt-1 text-red-500">{errors.bloodId.message}</p>}
      </div>

      {/* Health Condition */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Prevailing Health Conditions</label>
        <textarea
          {...register("healthConditions")}
          rows={4}
          placeholder="Type here..."
          className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-black resize-none
            outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 placeholder:text-gray-400"
        />
        {errors.healthConditions && <p className="mt-1 text-red-500">{errors.healthConditions.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Email</label>
        <input
          type="email"
          placeholder="abc@email.com"
          {...register("email")}
          className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
            focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black placeholder:text-sm place-holder:font-light placeholder:text-gray-400"
        />
        {errors.email && <p className="mt-1 text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Password</label>
        <div className="relative mt-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-12 text-sm outline-none
              focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500
              hover:bg-gray-100 hover:text-gray-700 active:scale-95"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Confirm Password</label>
        <div className="relative mt-2">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("confirmPassword")}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-12 text-sm outline-none
              focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500
              hover:bg-gray-100 hover:text-gray-700 active:scale-95"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full rounded-lg bg-red-800 py-3 text-lg font-semibold text-white"
      >
        {isSubmitting || pending ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}
