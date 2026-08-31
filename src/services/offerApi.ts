import { apiSlice } from '../store/apiSlice'; // Main API import karo

export const offerApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDeals: builder.query<any, void>({
            query: () => '/deals', // Base URL '/api' hai, toh aage '/deals' aayega
            providesTags: ['Deal'],
        }),
        getEligibleProducts: builder.query<any, void>({
            query: () => '/deals/eligible-products', 
        }),
        addDealFromProduct: builder.mutation<any, { productId: number, targetDate: string, discountPercentage: number }>({
            query: (data) => ({
                url: '/deals/add-from-product',
                method: 'POST',
                body: data, 
            }),
            invalidatesTags: ['Deal'],
        }),
        deleteDeal: builder.mutation<any, number>({
            query: (id) => ({
                url: `/deals/${id}`,
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
