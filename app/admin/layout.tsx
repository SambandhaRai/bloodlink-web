import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-dvh w-full overflow-hidden">
            {/* Sidebar */}
            <div className="hidden xl:block shrink-0">
                <Sidebar />
            </div>

            {/* Right side */}
            <div className="flex min-w-0 flex-1 flex-col bg-white">
                {/* Header (fixed height) */}
                <div className="shrink-0">
                    <Header />
                </div>

                {/* Scrollable content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}