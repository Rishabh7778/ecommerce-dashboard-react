import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Category {
    id: number;
    name: string;
    discount_percentage: number;
    discount_start_date: string;
    discount_expiry_date: string;
}

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL + '/api/categories', // ✅ Sahi Base URL
        credentials: 'include',
    }),
    tagTypes: ['Category'],

    endpoints: (builder) => ({
        applyCategoryDiscount: builder.mutation<any, any>({
            query: (data) => ({
                url: '/apply-discount', // 🔥 YAHAN SE '/categories' HATA DIYA
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),

        getCategories: builder.query<Category[], void>({
            query: () => '/getAll', // 🔥 YAHAN SE BHI '/categories' HATA DIYA
            providesTags: ['Category'],
        }),
    }),
});

export const { useGetCategoriesQuery, useApplyCategoryDiscountMutation } = categoryApi;