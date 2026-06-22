import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// 1. Base API setup (Base URL aur Cookies ke liye)
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL + '/api',
    credentials: 'include', // Har request mein chupke se cookies bhejne ke liye
});

// 2. Custom Wrapper (Auto-Refresh Token Logic)
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    // A. Pehle normal request bhejo (jaise getAllComplaints ya kuch aur)
    let result = await baseQuery(args, api, extraOptions);

    // B. Agar backend ne 401 (Unauthorized) diya, matlab Access Token expire ho gaya
    if (result.error && result.error.status === 401) {

        console.log('Token expired! Background mein refresh API call ho rahi hai...');

        // C. Refresh token wali API ko call karo naya token laane ke liye
        const refreshResult = await baseQuery({
            url: '/auth/refresh-token',
            method: 'POST' 
        }, api, extraOptions);

        if (refreshResult.data) {
            console.log('Token refreshed! Purani request wapas bhej rahe hain...');
            localStorage.setItem('token', (refreshResult.data as any).token);

            result = await baseQuery(args, api, extraOptions);
        } else {
            // E. Agar Refresh Token bhi expire ho chuka hai (7 din baad), toh user ko login page pe bhej do
            console.log('Refresh token bhi expire ho gaya. Logging out...');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }

    return result; // Data ya Error wapas bhej do
};

// 3. Main API Slice
export const apiSlice = createApi({
    reducerPath: 'api', // Redux store mein is naam se save hoga
    baseQuery: baseQueryWithReauth, // Apna magic wrapper yahan laga diya

    // Yahan wo saare tags daal do jo poore project mein use hone wale hain (Cache/Invalidation ke liye)
    // src/services/apiSlice.ts mein
    tagTypes: ['Complaint', 'ContactMessage', 'User', 'Product', 'Category', 'Order', 'Deal', 'Address', 'Wishlist', 'Cart', 'Discount'],

    endpoints: () => ({}), // Isko completely khali rakhna hai
});