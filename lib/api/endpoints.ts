export const API = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login"
    },
    USER: {
        GET_PROFILE: "/api/user/profile",
        UPDATE_PROFILE: "/api/user/update-profile",
        REQUEST_PASSWORD_RESET: '/api/user/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/user/reset-password/${token}`,
    },
    BLOODGROUP: {
        GETALL: "/api/bloodGroup",
        GETBYID: (id: string) => `/api/bloodGroup/${id}`,
    },
    HOSPITAL: {
        GET_ALL: "/api/hospital",
        GET_BY_ID: (id: string) => `/api/hospital/${id}`
    },
    REQUEST: {
        CREATE: "/api/request",
        GET_ALL_PENDING: "/api/request",
        GET_BY_ID: (id: string) => `/api/request/${id}`,
        ACCEPT: (id: string) => `/api/request/${id}/accept`,
        FINISH: (id: string) => `/api/request/${id}/finish`,
        GET_USER_HISTORY: "/api/request/user/history",

        GET_MATCHED: (
            params: {
                lng: number;
                lat: number;
                km?: number;
                page?: number;
                size?: number;
                search?: string;
            }
        ) => {
            const q = new URLSearchParams();

            q.set("lng", String(params.lng));
            q.set("lat", String(params.lat));

            if (params.km !== undefined) q.set("km", String(params.km));
            if (params.page !== undefined) q.set("page", String(params.page));
            if (params.size !== undefined) q.set("size", String(params.size));
            if (params.search) q.set("search", params.search);

            return `/api/request/matched?${q.toString()}`;
        },
    },
    ADMIN: {
        USER: {
            GET_ALL: "/api/admin/users",
            GET_BY_ID: (id: string) => `/api/admin/users/${id}`,
            UPDATE: (id: string) => `/api/admin/users/${id}`,
            DELETE: (id: string) => `/api/admin/users/${id}`,
        },
        HOSPITAL: {
            ADD: "/api/admin/hospital",
            UPDATE: (id: string) => `/api/admin/hospital/${id}`,
        }
    }
}