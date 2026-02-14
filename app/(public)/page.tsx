import Image from "next/image";
import Link from "next/link";

const WHY_DONATE_ICONS = [
            { title: "Save Lives", icon: "/images/icons/SaveLife.png" },
            { title: "Make a Difference", icon: "/images/icons/SupportHospital.png" },
            { title: "Emergency Ready", icon: "/images/icons/EmergencyReady.png" },
            { title: "Stay Healthy", icon: "/images/icons/StayHealthy.png" },
          ];

export default function Home() {
  return (
    <main className="">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid gap-18 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            {/* LEFT */}
            <div className="mt-15">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#A11D2C] leading-tight">
                Donate Blood.
                <br />
                Save Lives.
              </h1>

              <p className="mt-5 text-xl text-black/70 max-w-lg">
                Your contribution can be the reason someone gets a
                second chance.
              </p>

              <div className="mt-25 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="rounded-full bg-[#A11D2C] px-6 py-3 text-white font-semibold hover:opacity-95 transition"
                >
                  Become a Donor
                </Link>

                <Link
                  href="/register"
                  className="rounded-full border border-black/30 px-6 py-3 font-semibold text-black/80 hover:bg-black/5 transition"
                >
                  Request Blood
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-4xl translate-x-6 translate-y-4" />
              <Image
                src="/images/hero-illustration.png"
                alt="Blood donation illustration"
                width={700}
                height={500}
                className="rounded-4xl w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* OUR AIM */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-30">
          <div>
            <p className="text-sm tracking-[0.25em] font-semibold text-black/50">
              OUR AIM
            </p>
          </div>

        <div className="grid gap-25 lg:grid-cols-2">
          <h2 className="mt-4 text-4xl sm:text-[2.5rem] font-extrabold text-[#A11D2C] leading-tight">
            Making blood donation
            <br />
            effortless, accessible,
            <br />
            and part of everyday life.
          </h2>

          <p className="text-black/70 text-lg font-medium text-justify leading-relaxed max-w-lg mt-4">
            Across the country, hospitals face constant shortages, yet many
            willing donors don’t know when or where they are most needed. We
            close that gap by connecting people to the right place at the right
            time — making every contribution count.
          </p>
        </div>

        <div className="mt-20 flex justify-center">
          <Image
            src="/images/donors-illustration.png"
            alt="Donors illustration"
            width={500}
            height={400}
            className="w-full max-w-2xl h-auto"
          />
        </div>

        <p className="mt-6 text-black text-center text-3xl font-extrabold">8,420+ Donors</p>
      </section>

      {/* WHY DONATE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-15">
        <div className="text-center">
          <h3 className="text-black text-2xl sm:text-3xl font-extrabold">
            Why Donate Blood?
          </h3>
          <div className="mx-auto mt-3 h-1 w-36 rounded-full bg-[#A11D2C]" />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {
          WHY_DONATE_ICONS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-center">
                <Image src={item.icon} alt={item.title} width={52} height={52} />
              </div>

              <p className="mt-4 text-center font-semibold text-black/80">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}