"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-red-800 text-white mt-20">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 py-14">
        <div className="grid gap-2 md:grid-cols-[1fr_1fr_1.4fr]">
          {/* LEFT */}
          <div>
            <h4 className="text-lg font-bold">About</h4>

            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li>
                <Link href="#" className="hover:text-white">
                  Our Aim
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Why Donate Blood?
                </Link>
              </li>
            </ul>

            <p className="mt-8 font-semibold">Stay Connected</p>
            <div className="mt-3 flex gap-3">
              <span className="h-9 w-9 rounded-full bg-white/20" />
              <span className="h-9 w-9 rounded-full bg-white/20" />
              <span className="h-9 w-9 rounded-full bg-white/20" />
              <span className="h-9 w-9 rounded-full bg-white/20" />
            </div>
          </div>

          {/* CENTER */}
          <div>
            <h4 className="text-lg font-bold">Quick Links</h4>

            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* RIGHT */}
            <div className="relative pr-0 md:pr-56">
                <h4 className="text-lg font-bold">Contact Us</h4>

                <div className="mt-4 space-y-2 text-sm text-white/85">
                    <p>
                    Email:{" "}
                    <a
                        href="mailto:support@bloodlink.com"
                        className="underline underline-offset-4 hover:text-white"
                    >
                        support@bloodlink.com
                    </a>
                    </p>
                    <p>Phone: +977 9860565188</p>
                </div>

                {/* Illustration */}
                <Image
                    src="/images/blood_link_logo_White.png"
                    alt="Footer illustration"
                    width={200}
                    height={200}
                    className="mt-10 md:absolute md:right-0 md:bottom-0"
                />
            </div>
        </div>


        {/* BOTTOM */}
        <div className="mt-12 border-t border-white/20 pt-6 text-xs text-white/70 text-center">
          © {new Date().getFullYear()} BloodLink. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
