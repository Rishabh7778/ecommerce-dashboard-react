import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ✅ Interface ka naam correct kiya hai (Category se ContactMessage)
export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at?: string;
}

// Response structure jo backend se aa raha hai
interface GetAllMessagesResponse {
    data: ContactMessage[];
    pagination: {
        total_records: number;
        current_page: number;
        total_pages: number;
    };
}

export const contactApi = createApi({
    reducerPath: 'contactApi',
    baseQuery: fetchBaseQuery({
        baseUrl: (import.meta.env.VITE_API_BASE_URL || '') + '/api/contact',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['ContactMessage'],   
    endpoints: (builder) => ({
        // Mutation for posting message
        postMessage: builder.mutation<{ message: string }, Omit<ContactMessage, 'id'>>({
            query: (data) => ({
                url: '/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ContactMessage'],
        }),
        
        getAllMessages: builder.query<GetAllMessagesResponse, { page?: number; limit?: number }>({ 
            query: ({ page = 1, limit = 10 }) => `/admin/messages?page=${page}&limit=${limit}`, 
            providesTags: ['ContactMessage'],
        }),
    }),
});

export const {
    usePostMessageMutation,
    useGetAllMessagesQuery,
} = contactApi;