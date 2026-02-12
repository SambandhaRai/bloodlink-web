import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-red-800 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT: Form Area */}
          <div className="relative p-8 text-center">
            <div className="mx-auto max-w-md pt-8">
              {children}
            </div>
          </div>

          {/* RIGHT: Illustration */}
          <div className="hidden md:flex items-center justify-center p-5">
            <div className="relative w-full max-w-md">
              <Image
                src="/images/Login.png"
                alt="Auth illustration"
                width={520}
                height={420}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
