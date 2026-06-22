import { apiSlice } from '../store/apiSlice'; // Apne main manager ko bulaiye

// --- TYPES DEFINITION ---
export interface User {
    id?: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
    success: boolean;
}

// 3. Main API aur Endpoints setup (Ab ye worker ban gaya hai)
export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // REGISTER MUTATION
        register: builder.mutation<AuthResponse, any>({
            query: (userData) => ({
                // Routing: Base '/api' hai, toh aage '/auth/register'
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),

        // LOGIN MUTATION
        login: builder.mutation<AuthResponse, any>({
            query: (credentials) => ({
                // Routing: Base '/api' hai, toh aage '/auth/login'
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

// Hooks export karein
export const {
    useRegisterMutation,
    useLoginMutation,
} = authApi;