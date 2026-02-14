"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  X,
  User,
  Phone,
  Calendar,
  Users,
  Droplet,
  HeartPulse,
  Mail,
  Pencil,
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { updateUserSchema, UpdateUserType } from "../schema/update-user-schema";
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

function normalizeId(v: any): string {
  if (!v) return "";

  if (typeof v === "string") return v;

  if (typeof v === "object") {
    if (typeof v._id === "string") return v._id;
    if (v._id) return String(v._id);
    if (typeof v.$oid === "string") return v.$oid;
  }

  return "";
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const UPLOADS_PATH = "/uploads/";

function getProfilePictureSrc(profilePicture?: string) {
  if (!profilePicture) return null;

  if (
    profilePicture.startsWith("http://") ||
    profilePicture.startsWith("https://")
  ) {
    return profilePicture;
  }

  if (profilePicture.startsWith("/")) {
    return apiBase ? `${apiBase}${profilePicture}` : profilePicture;
  }

  if (!apiBase) return null;
  return `${apiBase}${UPLOADS_PATH}${profilePicture}`;
}

const labelCls = "text-sm font-medium text-gray-700";
const errorCls = "mt-2 text-sm text-red-600";
const fieldWrap =
  "mt-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 " +
  "focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100";
const inputCls =
  "w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400";
const selectCls =
  "w-full appearance-none bg-transparent text-sm text-gray-900 outline-none";

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

  const [imgVersion, setImgVersion] = useState<number>(0);
  useEffect(() => setImgVersion(Date.now()), []);

  const [imgError, setImgError] = useState(false);

  const userBloodId = normalizeId(user?.bloodId);

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
      bloodId: userBloodId,
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
        if (res.success) {
          setBloodGroups(res.data);

          const id = normalizeId(user?.bloodId);
          if (id) {
            setValue("bloodId", id, {
              shouldValidate: true,
              shouldDirty: false,
            });
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setBgLoading(false);
      }
    })();
  }, [setValue, user?.bloodId]);

  useEffect(() => {
    const id = normalizeId(user?.bloodId);

    reset({
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      dob: toDateInputValue(user?.dob),
      gender: user?.gender || "",
      bloodId: id,
      healthCondition: user?.healthCondition || "",
      email: user?.email || "",
      profilePicture: undefined,
    });

    if (id) {
      setValue("bloodId", id, { shouldValidate: true, shouldDirty: false });
    }

    setPreviewImage(null);
    setImgError(false);
    setImgVersion(Date.now());

    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [user, reset, setValue]);

  const handleImageChange = (
    file: File | undefined,
    onChange: (f?: File) => void
  ) => {
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

  const profileSrc = baseProfileSrc
    ? imgVersion
      ? `${baseProfileSrc}?v=${imgVersion}`
      : baseProfileSrc
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6 text-start">
      {/* Profile Picture */}
      <div className="pt-2">
        <div className="text-center">
          <label className="text-sm font-medium text-gray-700">
            Profile Picture
          </label>
        </div>

        <div className="mt-4 flex flex-col items-center">
          <Controller
            name="profilePicture"
            control={control}
            render={({ field: { onChange } }) => (
              <>
                {/* Avatar (clickable) */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  className="group relative h-28 w-28 sm:h-32 sm:w-32 outline-none cursor-pointer
  hover:opacity-95 focus-visible:ring-2 focus-visible:ring-red-200"
                  aria-label="Change profile picture"
                >
                  {/* OUTER RING (no overflow hidden, so icon can sit outside) */}
                  <div className="relative h-full w-full rounded-full border-4 border-white bg-transparent shadow-lg ring-1 ring-black/5">
                    {/* INNER IMAGE CLIP */}
                    <div className="relative h-full w-full overflow-hidden rounded-full bg-gray-100">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : profileSrc ? (
                        imgError ? (
                          <img
                            src={profileSrc}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Image
                            src={profileSrc}
                            alt="Profile"
                            fill
                            sizes="128px"
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

                      <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                    </div>

                    {/* Edit icon */}
                    <div className="absolute -bottom-2 -right-2 grid h-10 w-10 place-items-center rounded-full bg-red-800 text-white shadow-lg ring-4 ring-white transition group-hover:bg-red-700">
                      <Pencil size={16} />
                    </div>

                    {/* Remove selected preview */}
                    {previewImage && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissImage(onChange);
                        }}
                        className="absolute -top-3 -right-3 grid h-9 w-9 place-items-center rounded-full bg-red-800 text-white shadow-lg ring-4 ring-white hover:bg-red-700"
                        aria-label="Remove selected image"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Hidden input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) =>
                    handleImageChange(e.target.files?.[0], onChange)
                  }
                  className="hidden"
                />

                <p className="mt-3 text-center text-xs text-gray-500">
                  Tap the photo to change it
                </p>

                {errors.profilePicture && (
                  <p className="mt-2 text-sm text-red-600 text-center">
                    {errors.profilePicture.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className={labelCls}>Full Name</label>
        <div className={fieldWrap}>
          <User className="h-5 w-5 text-gray-400" />
          <input
            {...register("fullName")}
            placeholder="Enter your full name"
            className={inputCls}
          />
        </div>
        {errors.fullName && (
          <p className={errorCls}>{errors.fullName.message}</p>
        )}
      </div>

      {/* DOB */}
      <div>
        <label className={labelCls}>Date of Birth</label>
        <div className={fieldWrap}>
          <Calendar className="h-5 w-5 text-gray-400" />
          <input type="date" {...register("dob")} className={inputCls} />
        </div>
        {errors.dob && <p className={errorCls}>{errors.dob.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className={labelCls}>Phone Number</label>
        <div className={fieldWrap}>
          <Phone className="h-5 w-5 text-gray-400" />
          <input
            {...register("phoneNumber")}
            placeholder="98XXXXXXXX"
            className={inputCls}
          />
        </div>
        {errors.phoneNumber && (
          <p className={errorCls}>{errors.phoneNumber.message}</p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className={labelCls}>Gender</label>
        <div className={`${fieldWrap} relative pr-10`}>
          <Users className="h-5 w-5 text-gray-400" />
          <select {...register("gender")} className={selectCls}>
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
        {errors.gender && <p className={errorCls}>{errors.gender.message}</p>}
      </div>

      {/* Blood Group */}
      <div>
        <label className={labelCls}>Blood Group</label>
        <div className={`${fieldWrap} relative pr-10`}>
          <Droplet className="h-5 w-5 text-gray-400" />
          <Controller
            name="bloodId"
            control={control}
            render={({ field }) => (
              <select
                value={String(field.value ?? "")}
                onChange={(e) => field.onChange(e.target.value)}
                className={selectCls}
              >
                <option value="" disabled>
                  {bgLoading
                    ? "Loading blood groups..."
                    : "Select your blood group"}
                </option>

                {bloodGroups.map((bg) => (
                  <option key={String(bg._id)} value={String(bg._id)}>
                    {bg.bloodGroup}
                  </option>
                ))}
              </select>
            )}
          />
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
        {errors.bloodId && <p className={errorCls}>{errors.bloodId.message}</p>}
      </div>

      {/* Health Condition */}
      <div>
        <label className={labelCls}>Prevailing Health Conditions</label>
        <div className={`${fieldWrap} items-start`}>
          <HeartPulse className="mt-0.5 h-5 w-5 text-gray-400" />
          <textarea
            rows={4}
            {...register("healthCondition")}
            placeholder="Type here..."
            className="w-full resize-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className={labelCls}>Email</label>
        <div className={fieldWrap}>
          <Mail className="h-5 w-5 text-gray-400" />
          <input
            type="email"
            {...register("email")}
            placeholder="abc@email.com"
            className={inputCls}
          />
        </div>
        {errors.email && <p className={errorCls}>{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-red-800 py-3 text-sm font-semibold text-white shadow-md shadow-red-800/20 hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
