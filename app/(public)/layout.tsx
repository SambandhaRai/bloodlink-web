"use client";

import Image from "next/image";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { usePathname } from "next/navigation";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const isHome = pathName === "/";
  return (
    <section className="relative min-h-screen bg-white">
      {/* Decorative background */}
      {isHome ?
        <Image
          src="/images/Decore.png"
          alt=""
          width={1200}
          height={1200}
          priority
          className="
            pointer-events-none
            absolute right-0 top-0
            z-0
            w-80 sm:w-150 lg:w-180
            h-auto
          "
        />
        : null
      }

      {/* Foreground */}
      <div className="relative z-10">
        <Header />
        <main className="w-full">{children}</main>
        <Footer />
      </div>
    </section>
  );
}