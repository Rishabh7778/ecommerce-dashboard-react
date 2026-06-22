import { apiSlice } from '../store/apiSlice'; // Apna main apiSlice import karo

export const complaintApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllComplaints: builder.query<any, void>({
            // Base URL '/api' hai, toh aage '/complaints/all' lagana padega
            query: () => '/complaints/all', 
            providesTags: ['Complaint'],
        }),

        addComplaint: builder.mutation<any, { subject: string, message: string }>({
            query: (data) => ({
                url: '/complaints/add', 
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Complaint'],
        }),

        resolveComplaint: builder.mutation<any, number>({
            query: (id) => ({
                url: `/complaints/resolve/${id}`, 
                method: 'PUT',
            }),
            invalidatesTags: ['Complaint'],
        }),
    }),
});

export const { 
    useGetAllComplaintsQuery, 
    useResolveComplaintMutation,
    useAddComplaintMutation 
} = complaintApi;