import { NextResponse } from "next/server";
import { setUserLocation } from "@/lib/cookie";

export async function POST(req: Request) {
    const { lat, lng } = await req.json();

    if (
        typeof lat !== "number" ||
        typeof lng !== "number"
    ) {
        return NextResponse.json(
            { success: false },
            { status: 400 }
        );
    }

    await setUserLocation(lat, lng);

    return NextResponse.json({ success: true });
}