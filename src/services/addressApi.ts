import { apiSlice } from '../store/apiSlice'; 

export const addressApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Get Addresses
        getMyAddresses: builder.query<any, void>({
            // Routing Process: /api pehle se hai, ab aage exactly '/address/my-addresses' jayega
            query: () => '/address/my-addresses', 
            providesTags: ['Address'],
        }),

        // 2. Add Address
        addAddress: builder.mutation<any, any>({
            query: (data) => ({
                // Routing Process: Backend ke hisaab se singular '/address/add'
                url: '/address/add', 
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Address'], // Action Role: Address add hote hi list auto-refresh hogi
        }),

        // 3. Update Address (Backend mein /update/:id hai, isliye isko bhi ready rakha hai)
        updateAddress: builder.mutation<any, { id: string | number; data: any }>({
            query: ({ id, data }) => ({
                // Routing Process: Dynamic ID ke sath update route
                url: `/address/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Address'],
        }),
    }),
});

export const { 
    useGetMyAddressesQuery, 
    useAddAddressMutation,
    useUpdateAddressMutation
} = addressApi;