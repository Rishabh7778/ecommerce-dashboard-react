import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const offerApi = createApi({
    reducerPath: 'offerApi',
    baseQuery: fetchBaseQuery({ 
            baseUrl: import.meta.env.VITE_API_BASE_URL + '/api/deals',
            prepareHeaders: (headers) => {
                const token = localStorage.getItem('token');
                if (token) {
                    headers.set('authorization', `Bearer ${token}`);
                }
                return headers;
            },
        }),
    tagTypes: ['Deal'],
    endpoints: (builder) => ({
        getDeals: builder.query<any, void>({
            query: () => '/',
            providesTags: ['Deal'],
        }),
        getEligibleProducts: builder.query<any, void>({
            query: () => '/eligible-products', // Database se products lene ke liye
        }),
        addDealFromProduct: builder.mutation<any, { productId: number, targetDate: string }>({
            query: (data) => ({
                url: '/add-from-product',
                method: 'POST',
                body: data, // Seedha JSON bhejna hai
            }),
            invalidatesTags: ['Deal'],
        }),
        deleteDeal: builder.mutation<any, number>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Deal'],
        }),
    }),
});

export const {
    useGetDealsQuery,
    useGetEligibleProductsQuery,
    useAddDealFromProductMutation,
    useDeleteDealMutation,
} = offerApi;