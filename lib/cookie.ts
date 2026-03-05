"use server";

import { cookies } from "next/headers";

export const setAuthToken = async (token: string) => {
    const cookieStore = await cookies();
    cookieStore.set({ name: "auth_token", value: token });
}

export const getAuthToken = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    return token || null;
}

export const setUserData = async (userData: any) => {
    const cookieStore = await cookies();
    cookieStore.set({ name: "user_data", value: JSON.stringify(userData) });
}

export const getUserData = async () => {
    const cookieStore = await cookies();
    const userData = cookieStore.get("user_data")?.value;
    if (userData) {
        return JSON.parse(userData);
    }
    return null;
}

export type UserLocationCookie = {
    lat: number;
    lng: number;
    ts: number; // timestamp (ms)
};

export const setUserLocation = async (lat: number, lng: number) => {
    const cookieStore = await cookies();

    const payload: UserLocationCookie = {
        lat,
        lng,
        ts: Date.now(),
    };

    cookieStore.set({
        name: "user_location",
        value: JSON.stringify(payload),
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
    });
};

export const getUserLocation = async (): Promise<UserLocationCookie | null> => {
    const cookieStore = await cookies();
    const raw = cookieStore.get("user_location")?.value;

    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as UserLocationCookie;

        if (
            typeof parsed.lat !== "number" ||
            typeof parsed.lng !== "number"
        ) {
            return null;
        }

        return parsed;
    } catch {
        return null;
    }
};

export const clearUserLocation = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("user_location");
};

export const clearAuthCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user_data");
    cookieStore.delete("user_location");
};