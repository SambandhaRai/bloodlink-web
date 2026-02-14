"use client";

import { ChevronDown, Eye, EyeOff, User, Phone, Calendar, Users, Droplet, HeartPulse, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterType } from "../schema/register-schema";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleRegister } from "@/lib/actions/auth-action";
import { handleGetAllBloodGroups } from "@/lib/actions/admin/bloodGroup-action";
import { toast } from "react-toastify";

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
      if (!res.success) {
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

  // ✅ same input style as UpdateUserForm
  const fieldWrap =
    "mt-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 " +
    "focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100";
  const inputCls =
    "w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400";
  const selectCls =
    "w-full appearance-none bg-transparent text-sm text-gray-700 outline-none";

  return (
    <form onSubmit={handleSubmit(submit)} className="mt-5 space-y-5 text-start">
      {/* Full Name */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Full Name</label>
        <div className={fieldWrap}>
          <User className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Enter you full name"
            {...register("fullName")}
            className={inputCls}
          />
        </div>
        {errors.fullName && <p className="mt-1 text-red-500">{errors.fullName.message}</p>}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Date of Birth</label>
        <div className={fieldWrap}>
          <Calendar className="h-5 w-5 text-gray-400" />
          <input type="date" {...register("dob")} className={inputCls} />
        </div>
        {errors.dob && <p className="mt-1 text-red-500">{errors.dob.message}</p>}
      </div>

      {/* Phone Number */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Phone Number</label>
        <div className={fieldWrap}>
          <Phone className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="98XXXXXXXX"
            {...register("phoneNumber")}
            className={inputCls}
          />
        </div>
        {errors.phoneNumber && <p className="mt-1 text-red-500">{errors.phoneNumber.message}</p>}
      </div>

      {/* Gender */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">Gender</label>
        <div className={`${fieldWrap} relative pr-10`}>
          <Users className="h-5 w-5 text-gray-400" />
          <select {...register("gender")} defaultValue="" className={selectCls}>
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
        <div className={`${fieldWrap} relative pr-10`}>
          <Droplet className="h-5 w-5 text-gray-400" />
          <select {...register("bloodId")} defaultValue="" className={selectCls}>
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
        <label className="text-sm font-medium text-gray-400 mx-0.5">
          Prevailing Health Conditions
        </label>
        <div className={`${fieldWrap} items-start`}>
          <HeartPulse className="mt-0.5 h-5 w-5 text-gray-400" />
          <textarea
            {...register("healthConditions")}
            rows={4}
            placeholder="Type here..."
            className="w-full resize-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>
        {errors.healthConditions && (
          <p className="mt-1 text-red-500">{errors.healthConditions.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Email</label>
        <div className={fieldWrap}>
          <Mail className="h-5 w-5 text-gray-400" />
          <input
            type="email"
            placeholder="abc@email.com"
            {...register("email")}
            className={inputCls}
          />
        </div>
        {errors.email && <p className="mt-1 text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Password</label>
        <div className={`${fieldWrap} relative pr-12`}>
          <Lock className="h-5 w-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className={inputCls}
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
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Confirm Password</label>
        <div className={`${fieldWrap} relative pr-12`}>
          <Lock className="h-5 w-5 text-gray-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("confirmPassword")}
            className={inputCls}
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