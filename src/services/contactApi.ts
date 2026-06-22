import { apiSlice } from '../store/apiSlice'; // Apna main apiSlice import karo

// ✅ Interface wahi same rahenge
export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at?: string;
}

interface GetAllMessagesResponse {
    data: ContactMessage[];
    pagination: {
        total_records: number;
        current_page: number;
        total_pages: number;
    };
}

export const contactApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Mutation for posting message
        postMessage: builder.mutation<{ message: string }, Omit<ContactMessage, 'id'>>({
            query: (data) => ({
                url: '/contact', // '/api' base hai, toh aage '/contact'
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ContactMessage'],
        }),
        
        getAllMessages: builder.query<GetAllMessagesResponse, { page?: number; limit?: number }>({ 
            query: ({ page = 1, limit = 10 }) => `/contact/admin/messages?page=${page}&limit=${limit}`, 
            providesTags: ['ContactMessage'],
        }),
    }),
});

export const {
    usePostMessageMutation,
    useGetAllMessagesQuery,
} = contactApi;