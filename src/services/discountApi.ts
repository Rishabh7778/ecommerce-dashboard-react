import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Response types define kar lete hain
export interface Category {
    id: number;
    name: string;
    discount_percentage: number;
    discount_start_date: string;
    discount_expiry_date: string;
}

// 🔥 Iska naam 'discountApi' kar diya hai taaki aapke store.ts se match kare
export const discountApi = createApi({
    reducerPath: 'discountApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/discounts',
        credentials: 'include',
    }),
    tagTypes: ['Category', 'Product'], // Product bhi add kiya taaki price update ho

    endpoints: (builder) => ({

        applyCategoryDiscount: builder.mutation<any, any>({
            query: (data) => ({
                // ✅ FIX 1: Yahan se '/categories' hata diya. Sirf '/apply-discount' aayega.
                url: '/apply-discount',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product', 'Category'],
        }),

        // 🔥 Naye hook ka naam useGetCategoriesQuery rakha hai
        getCategories: builder.query<Category[], void>({
            // ✅ FIX 2: Yahan se bhi '/categories' hata diya. Sirf '/getAll' aayega.
            query: () => '/getAll',
            providesTags: ['Category'],
        }),

        removeCategoryDiscount: builder.mutation<any, number | string>({
            query: (id) => ({
                url: `/remove-discount/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['Category', 'Product'], // Hatate hi frontend automatically refresh hoga
        }),
    }),
});

// 🔥 Hooks ko sahi se export karein
export const {
    useGetCategoriesQuery, // Hook ka naam match kar diya
    useApplyCategoryDiscountMutation,
    useRemoveCategoryDiscountMutation,
} = discountApi;