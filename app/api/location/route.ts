import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setUserLocation } from "@/lib/cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

export async function POST(req: Request) {
    const { lat, lng } = await req.json();

    if (
        typeof lat !== "number" ||
        typeof lng !== "number" ||
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
    ) {
        return NextResponse.json(
            { success: false, message: "Invalid coordinates" },
            { status: 400 }
        );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const backendRes = await fetch(`${API_BASE}/api/user/location`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ lat, lng }),
            cache: "no-store",
        });

        const payload = await backendRes.json().catch(() => ({}));

        if (!backendRes.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: payload?.message || "Failed to update location",
                },
                { status: backendRes.status }
            );
        }

        await setUserLocation(lat, lng);

        return NextResponse.json({
            success: true,
            data: payload?.data,
            message: "Location updated successfully",
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to update location" },
            { status: 500 }
        );
    }
}
