import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:5000/api',
        // 🔥 Ye line har request ke saath cookies bhejegi
        prepareHeaders: (headers) => {
            // Ab localStorage se token nikalne ki zaroorat nahi hai!
            return headers;
        },
        fetchFn: (url, options) => {
            return fetch(url, { ...options, credentials: 'include' }); // 👈 Secret Sauce
        }
    }),

    endpoints: (builder) => ({
        // 1. REGISTER MUTATION
        register: builder.mutation<AuthResponse, any>({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),

        // 2. LOGIN MUTATION
        login: builder.mutation<AuthResponse, any>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

// Sahi hooks export karein
export const {
    useRegisterMutation,
    useLoginMutation,
} = authApi;