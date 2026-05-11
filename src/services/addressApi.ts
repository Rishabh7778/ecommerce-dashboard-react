import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types define kar lete hain
export interface Address {
    id?: number;
    fullName: string;
    phone: string;
    streetAddress: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
}

export const addressApi = createApi({
    reducerPath: 'addressApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:5000/api',
        // 🔥 fetchFn likhne ki jagah seedha ye likho, ye standard hai:
        prepareHeaders: (headers) => {
            return headers;
        },
        credentials: 'include',
    }),
    tagTypes: ['Address'], // Isse auto-refresh hoga naya address add hone par

    endpoints: (builder) => ({
        // 1. Fetch Addresses
        getMyAddresses: builder.query<{ addresses: Address[], success: boolean }, void>({
            query: () => '/address/my-addresses',
            providesTags: ['Address'],
        }),
        
        // 2. Add Address
        addAddress: builder.mutation<any, Address>({
            query: (addressData) => ({
                url: '/address/add',
                method: 'POST',
                body: addressData,
            }),
            invalidatesTags: ['Address'], // Form submit hote hi purana data refresh karega
        }),

        // 3. Update Address (Future ke liye)
        updateAddress: builder.mutation<any, { id: number, data: Address }>({
            query: ({ id, data }) => ({
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