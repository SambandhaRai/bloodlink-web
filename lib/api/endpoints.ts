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
    ADMIN: {
        USER: {
            GET_ALL: "/api/admin/users",
            GET_BY_ID: (id: string) => `/api/admin/users/${id}`,
            UPDATE: (id: string) => `/api/admin/users/${id}`,
            DELETE: (id: string) => `/api/admin/users/${id}`,
        }
    }
}