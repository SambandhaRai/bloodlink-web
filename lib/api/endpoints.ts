export const API = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login"
    },
    BLOODGROUP: {
        GETALL: "/api/bloodGroup",
        GETBYID: (id: string) => `/api/bloodGroup/${id}`,
    }
}