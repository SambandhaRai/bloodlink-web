"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  UserCog,
  Settings,
  HelpCircle,
  Shield,
} from "lucide-react";
import ProfileRow from "./ProfileRow";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function ProfileForm({
  user,
  onLogout,
}: {
  user: any;
  onLogout?: () => void; // optional if you want a logout handler
}) {
  const profileSrc = user?.profilePicture
    ? user.profilePicture.startsWith("http")
      ? user.profilePicture
      : `${apiBase}${user.profilePicture.startsWith("/") ? "" : "/uploads/"}${user.profilePicture}`
    : null;

  const email = user?.email?.trim?.() || "";
  const phone = user?.phoneNumber?.trim?.() || "";

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mx-auto w-full max-w-xl">
        {/* Top profile info (your style) */}
        <div className="flex flex-col items-center text-center">
          <div className="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full bg-gray-100 ring-1 ring-black/10">
            {profileSrc ? (
              <Image
                src={profileSrc}
                alt="Profile picture"
                width={128}
                height={128}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">
                No Image
              </div>
            )}
          </div>

          <h2 className="mt-4 text-2xl sm:text-3xl font-semibold text-black">
            {user?.fullName || "Unnamed User"}
          </h2>

          <p className="mt-1 flex flex-wrap items-center justify-center gap-x-2 text-black/60 text-xs sm:text-xs">
            {email && (
              <span className="flex items-center gap-1 break-all">
                <Mail className="h-3.5 w-3.5 text-black/40" />
                {email}
              </span>
            )}

            {email && phone && (
              <span className="text-black/30 select-none" aria-hidden="true">
                |
              </span>
            )}

            {phone && (
              <span className="flex items-center gap-1 tabular-nums">
                <Phone className="h-3.5 w-3.5 text-black/40" />
                {phone}
              </span>
            )}
          </p>
        </div>

        {/* Menu list */}
        <div className="mt-8 space-y-2">
          <ProfileRow href="/user/profile/update-profile" icon={<UserCog className="h-5 w-5 text-black/50" />}>
            Update Profile
          </ProfileRow>

          <ProfileRow href="/settings" icon={<Settings className="h-5 w-5 text-black/50" />}>
            Settings
          </ProfileRow>

          <ProfileRow href="/faq" icon={<HelpCircle className="h-5 w-5 text-black/50" />}>
            FAQ / Help
          </ProfileRow>

          <ProfileRow href="/privacy" icon={<Shield className="h-5 w-5 text-black/50" />}>
            Privacy Policy
          </ProfileRow>

        </div>
      </div>
    </section>
  );
}