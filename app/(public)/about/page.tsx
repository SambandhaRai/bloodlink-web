import Image from "next/image";
import Link from "next/link";

const BRAND = "#A11D2C";

const STATS = [
    { label: "Donors", value: "8,420+" },
    { label: "Hospitals", value: "120+" },
    { label: "Requests Managed", value: "15,000+" },
    { label: "Cities Covered", value: "30+" },
];

const TIMELINE = [
    {
        year: "2024",
        title: "The problem became personal",
        desc: "We noticed how often families struggle to find blood in time — even when donors exist nearby.",
    },
    {
        year: "2025",
        title: "Built the simplest flow possible",
        desc: "Request → accept → complete. Clear statuses, clear details, and fewer barriers to help.",
    },
    {
        year: "2026",
        title: "Scaling trust and reach",
        desc: "Improving verification, hospital coordination, and the user experience for faster responses.",
    },
];

const HOW_IT_WORKS = [
    {
        title: "Post a Request",
        desc: "Add blood group, urgency, and hospital. Share patient details if needed.",
        tag: "Requester",
    },
    {
        title: "Donors Discover & Accept",
        desc: "Donors browse active requests and accept when they’re ready to help.",
        tag: "Donor",
    },
    {
        title: "Coordinate with Hospital",
        desc: "Everyone sees the same key details so coordination is simple and fast.",
        tag: "Hospital",
    },
    {
        title: "Finish & Track",
        desc: "Requests move from pending → accepted → finished for accountability.",
        tag: "System",
    },
];

const VALUES = [
    {
        title: "Speed when it matters",
        desc: "Fewer steps, clearer actions, and faster coordination in emergencies.",
    },
    {
        title: "Trust-first design",
        desc: "Request statuses, visible details, and structured data to reduce confusion.",
    },
    {
        title: "Human-centered",
        desc: "Designed for families under stress — simple UI, no clutter, no guessing.",
    },
    {
        title: "Community impact",
        desc: "A platform that helps people help people — reliably and repeatedly.",
    },
];

export default function AboutPage() {
    return (
        <main className="bg-white">
            {/* HERO */}
            <section className="relative border-b border-black/10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                        {/* Left content */}
                        <div>
                            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-black">
                                Built to make
                                <span className="block" style={{ color: BRAND }}>
                                    blood access faster
                                </span>
                                and coordination simpler.
                            </h1>

                            <p className="mt-5 text-lg text-black/70 max-w-2xl leading-relaxed">
                                BloodLink connects donors, hospitals, and requesters through a clear,
                                trackable flow — so people can act quickly without confusion.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href="/register"
                                    className="rounded-xl px-5 py-3 text-white font-semibold shadow-sm hover:opacity-95 transition"
                                    style={{ background: BRAND }}
                                >
                                    Join as Donor
                                </Link>

                                <Link
                                    href="/register"
                                    className="rounded-xl border border-black/20 bg-white px-5 py-3 font-semibold text-black/80 hover:bg-black/5 transition"
                                >
                                    Create a Request
                                </Link>

                                <Link
                                    href="/"
                                    className="rounded-xl px-5 py-3 font-semibold text-black/70 hover:bg-black/5 transition"
                                >
                                    Back to Home →
                                </Link>
                            </div>

                            {/* Mini quote card */}
                            <div className="mt-10 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                                <div className="text-sm font-semibold text-black">Our promise</div>
                                <p className="mt-2 text-sm text-black/70 leading-relaxed">
                                    Keep the process simple, make urgency visible, and help people coordinate
                                    faster — without noise.
                                </p>
                            </div>
                        </div>

                        {/* Right visual + stats */}
                        <div className="grid gap-4">
                            <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                                <div className="absolute inset-0 opacity-10" style={{ background: BRAND }} />
                                <div className="relative p-6 sm:p-7">
                                    <div className="text-sm font-semibold text-black">
                                        A small action can change everything.
                                    </div>
                                    <p className="mt-2 text-sm text-black/70">
                                        Donate blood, accept a request, or share availability — every bit helps.
                                    </p>

                                    <div className="mt-6 grid grid-cols-2 gap-3">
                                        {STATS.map((s) => (
                                            <div
                                                key={s.label}
                                                className="rounded-2xl border border-black/10 bg-white p-4"
                                            >
                                                <div className="text-xs font-semibold text-black/60">{s.label}</div>
                                                <div className="mt-1 text-xl font-extrabold text-black">{s.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                                <Image
                                    src="/images/donors-illustration.png"
                                    alt="Community donors illustration"
                                    width={900}
                                    height={600}
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STORY / TIMELINE */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.25em] text-black/50">OUR STORY</p>
                        <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-black leading-tight">
                            Why we started BloodLink
                        </h2>
                        <p className="mt-4 text-black/70 text-lg leading-relaxed">
                            In emergencies, the problem is rarely “no donors exist”.
                            It’s coordination, visibility, and timing. We built BloodLink to fix that.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
                        <div className="space-y-6">
                            {TIMELINE.map((t, idx) => (
                                <div key={t.year} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="h-10 w-10 rounded-2xl flex items-center justify-center text-white font-extrabold"
                                            style={{ background: BRAND }}
                                        >
                                            {idx + 1}
                                        </div>
                                        <div className="mt-2 h-full w-0.5 bg-black/10" />
                                    </div>

                                    <div className="pb-6">
                                        <div className="text-xs font-semibold text-black/50">{t.year}</div>
                                        <div className="mt-1 text-lg font-extrabold text-black">{t.title}</div>
                                        <div className="mt-2 text-sm text-black/70 leading-relaxed">{t.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-black/2 border-y border-black/10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.25em] text-black/50">
                                HOW IT WORKS
                            </p>
                            <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-black">
                                A clear flow, end-to-end
                            </h3>
                        </div>

                        <div className="text-sm text-black/60">
                            Track requests from <span className="font-semibold">pending</span> →{" "}
                            <span className="font-semibold">accepted</span> →{" "}
                            <span className="font-semibold">finished</span>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {HOW_IT_WORKS.map((s, i) => (
                            <div
                                key={s.title}
                                className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-semibold text-black/50">
                                        STEP {String(i + 1).padStart(2, "0")}
                                    </div>
                                    <span
                                        className="rounded-full px-3 py-1 text-xs font-semibold"
                                        style={{ background: `${BRAND}1A`, color: BRAND }}
                                    >
                                        {s.tag}
                                    </span>
                                </div>

                                <div className="mt-3 text-lg font-extrabold text-black">{s.title}</div>
                                <div className="mt-2 text-sm text-black/70 leading-relaxed">{s.desc}</div>

                                <div className="mt-5 h-1 w-16 rounded-full" style={{ background: BRAND }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* VALUES */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                    <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
                        <p className="text-xs font-semibold tracking-[0.25em] text-black/50">
                            OUR VALUES
                        </p>
                        <h3 className="mt-3 text-3xl font-extrabold text-black leading-tight">
                            What guides every decision
                        </h3>
                        <p className="mt-4 text-black/70 text-lg leading-relaxed">
                            We keep BloodLink focused on real-life urgency — with a design that
                            reduces confusion and increases action.
                        </p>

                        <div className="mt-6 flex gap-3">
                            <Link
                                href="/register"
                                className="rounded-xl px-5 py-3 text-white font-semibold hover:opacity-95 transition"
                                style={{ background: BRAND }}
                            >
                                Get Started
                            </Link>
                            <Link
                                href="/contact"
                                className="rounded-xl border border-black/20 bg-white px-5 py-3 font-semibold text-black/80 hover:bg-black/5 transition"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {VALUES.map((v) => (
                            <div
                                key={v.title}
                                className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className="h-10 w-10 rounded-2xl flex items-center justify-center text-white font-extrabold"
                                        style={{ background: BRAND }}
                                    >
                                        ✓
                                    </div>
                                    <div>
                                        <div className="text-lg font-extrabold text-black">{v.title}</div>
                                        <div className="mt-2 text-sm text-black/70 leading-relaxed">{v.desc}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA BAND */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
                <div
                    className="rounded-3xl p-10 sm:p-12 text-white shadow-sm"
                    style={{ background: BRAND }}
                >
                    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                        <div>
                            <h4 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                                Ready to be someone’s reason?
                            </h4>
                            <p className="mt-4 text-white/85 text-lg leading-relaxed max-w-2xl">
                                Whether you donate today or accept a request tomorrow, your action
                                makes a real difference.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 lg:justify-end">
                            <Link
                                href="/register"
                                className="rounded-xl bg-white px-6 py-3 font-semibold"
                                style={{ color: BRAND }}
                            >
                                Become a Donor
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-xl border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
                            >
                                Request Blood
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}