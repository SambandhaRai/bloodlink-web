"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateUserSchema, type UpdateUserType } from "../schema/update-user-schema";
import { handleGetAllBloodGroups } from "@/lib/actions/admin/bloodGroup-action";
import { handleUpdateUserProfile } from "@/lib/actions/user/user-action";

type BloodGroup = { _id: string; bloodGroup: string };

function toDateInputValue(d: string | Date | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const UPLOADS_PATH = "/uploads/";

function getProfilePictureSrc(profilePicture?: string) {
  if (!profilePicture) return null;

  if (profilePicture.startsWith("http://") || profilePicture.startsWith("https://")) {
    return profilePicture;
  }

  if (profilePicture.startsWith("/")) {
    return apiBase ? `${apiBase}${profilePicture}` : profilePicture;
  }

  if (!apiBase) return null;
  return `${apiBase}${UPLOADS_PATH}${profilePicture}`;
}

export default function UpdateUserForm({
  user,
  showRole = false,
}: {
  user: any;
  showRole?: boolean;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([]);
  const [bgLoading, setBgLoading] = useState(false);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // used to bust cache after successful upload/update
  const [imgVersion, setImgVersion] = useState<number>(Date.now());

  // fallback if next/image fails to load
  const [imgError, setImgError] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserType>({
    resolver: zodResolver(updateUserSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      dob: toDateInputValue(user?.dob),
      gender: user?.gender || "",
      bloodId: user?.bloodId || "",
      healthCondition: user?.healthCondition || "",
      email: user?.email || "",
      profilePicture: undefined,
    },
  });

  useEffect(() => {
    (async () => {
      try {
        setBgLoading(true);
        const res = await handleGetAllBloodGroups();
        if (res.success) setBloodGroups(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setBgLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    reset({
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      dob: toDateInputValue(user?.dob),
      gender: user?.gender || "",
      bloodId: user?.bloodId || "",
      healthCondition: user?.healthCondition || "",
      email: user?.email || "",
      profilePicture: undefined,
    });

    setPreviewImage(null);
    setImgError(false);
    setImgVersion(Date.now());

    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [user, reset]);

  const handleImageChange = (file: File | undefined, onChange: (f?: File) => void) => {
    if (!file) {
      setPreviewImage(null);
      onChange(undefined);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);

    onChange(file);
  };

  const dismissImage = (onChange?: (f?: File) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    setValue("profilePicture", undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const appendIf = (fd: FormData, key: string, value: any) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string" && value.trim() === "") return;
    fd.append(key, value);
  };

  const onSubmit = async (data: UpdateUserType) => {
    try {
      const formData = new FormData();

      appendIf(formData, "fullName", data.fullName);
      appendIf(formData, "phoneNumber", data.phoneNumber);
      appendIf(formData, "dob", data.dob);
      appendIf(formData, "gender", data.gender);
      appendIf(formData, "bloodId", data.bloodId);
      appendIf(formData, "healthCondition", data.healthCondition);
      appendIf(formData, "email", data.email);

      if (data.profilePicture) {
        formData.append("profilePicture", data.profilePicture);
      }

      const res = await handleUpdateUserProfile(formData);
      if (!res.success) throw new Error(res.message || "Update failed");

      toast.success("Profile updated successfully!");

      // clear preview + file input
      dismissImage();

      // bust image cache (same filename sometimes)
      setImgError(false);
      setImgVersion(Date.now());

      // re-fetch server component data
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Profile update failed.");
    }
  };

  const baseProfileSrc = getProfilePictureSrc(user?.profilePicture);

  const profileSrc = baseProfileSrc ? `${baseProfileSrc}?v=${imgVersion}` : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5 text-start">
      {/* Profile Picture */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Profile Picture</label>

        <div className="mt-3 flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
            {previewImage ? (
              <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
            ) : profileSrc ? (
              imgError ? (
                // fallback if next/image fails
                <img src={profileSrc} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <Image
                  src={profileSrc}
                  alt="Profile"
                  fill
                  sizes="64px"
                  className="object-cover"
                  onError={() => setImgError(true)}
                  unoptimized
                />
              )
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                No Image
              </div>
            )}

            {previewImage && (
              <Controller
                name="profilePicture"
                control={control}
                render={({ field: { onChange } }) => (
                  <button
                    type="button"
                    onClick={() => dismissImage(onChange)}
                    className="absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-red-800 text-white shadow hover:bg-red-700"
                    aria-label="Remove selected image"
                  >
                    <X size={14} />
                  </button>
                )}
              />
            )}
          </div>

          <Controller
            name="profilePicture"
            control={control}
            render={({ field: { onChange } }) => (
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
              />
            )}
          />
        </div>

        {errors.profilePicture && (
          <p className="mt-1 text-sm text-red-500">{errors.profilePicture.message}</p>
        )}
      </div>

      {/* Full Name */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Full Name</label>
        <input
          {...register("fullName")}
          className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
          focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black placeholder:text-gray-400"
        />
        {errors.fullName && <p className="mt-1 text-red-500">{errors.fullName.message}</p>}
      </div>

      {/* DOB */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Date of Birth</label>
        <input
          type="date"
          {...register("dob")}
          className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
          focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black"
        />
        {errors.dob && <p className="mt-1 text-red-500">{errors.dob.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Phone Number</label>
        <input
          {...register("phoneNumber")}
          placeholder="98XXXXXXXX"
          className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
          focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black placeholder:text-gray-400"
        />
        {errors.phoneNumber && <p className="mt-1 text-red-500">{errors.phoneNumber.message}</p>}
      </div>

      {/* Gender */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-400">Gender</label>
        <div className="relative">
          <select
            {...register("gender")}
            className="w-full appearance-none rounded-lg border border-gray-200 px-4 py-2.5 pr-10
            text-sm text-gray-700 focus:border-red-600 focus:ring-2 focus:ring-red-100"
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
            className="w-full appearance-none rounded-lg border border-gray-200 px-4 py-2.5 pr-10
            text-sm text-gray-700 focus:border-red-600 focus:ring-2 focus:ring-red-100"
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
        <label className="text-sm font-medium text-gray-400 mx-0.5">
          Prevailing Health Conditions
        </label>
        <textarea
          rows={4}
          {...register("healthCondition")}
          className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-black resize-none
          outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 placeholder:text-gray-400"
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium text-gray-400 mx-0.5">Email</label>
        <input
          type="email"
          {...register("email")}
          className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none
          focus:border-red-600 focus:ring-2 focus:ring-red-100 text-black placeholder:text-gray-400"
        />
        {errors.email && <p className="mt-1 text-red-500">{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-red-800 py-3 text-lg font-semibold text-white hover:bg-red-700 disabled:opacity-50"
      >
        {isSubmitting ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
