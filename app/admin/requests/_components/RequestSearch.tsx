"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export default function RequestSearch({
    defaultValue = "",
}: {
    defaultValue?: string;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(defaultValue);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams(searchParams.toString());

        if (value.trim()) {
            params.set("search", value.trim());
        } else {
            params.delete("search");
        }

        params.set("page", "1"); // reset pagination
        router.push(`?${params.toString()}`);
    };

    return (
        <form onSubmit={onSubmit} className="w-full">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search by blood group, hospital, patient..."
                    className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-black
                               focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none"
                />
            </div>
        </form>
    );
}