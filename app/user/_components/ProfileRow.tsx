"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import React from "react";

export default function ProfileRow({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block w-full rounded-2xl border border-black/10 bg-white px-4 py-4 shadow-sm transition
      hover:shadow-md hover:bg-black/2 active:scale-[0.99]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-sm font-semibold text-black/80">
            {children}
          </span>
        </div>

        <ChevronRight className="h-5 w-5 text-black/30" />
      </div>
    </Link>
  );
}
