import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const complaintApi = createApi({
    reducerPath: 'complaintApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: import.meta.env.VITE_API_BASE_URL + '/api/complaints',
        credentials: 'include',
    }),
    tagTypes: ['Complaint'],

    endpoints: (builder) => ({
        getAllComplaints: builder.query<any, void>({
            query: () => '/all', 
            providesTags: ['Complaint'],
        }),

        addComplaint: builder.mutation<any, { subject: string, message: string }>({
            query: (data) => ({
                url: '/add', // Ye sahi hai: /api/complaints/add
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Complaint'],
        }),

        resolveComplaint: builder.mutation<any, number>({
            query: (id) => ({
                url: `/resolve/${id}`, 
                method: 'PUT',
            }),
            invalidatesTags: ['Complaint'],
        }),
    }),
});

export const { useGetAllComplaintsQuery, useResolveComplaintMutation,useAddComplaintMutation } = complaintApi;