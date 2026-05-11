import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// --- TYPES DEFINITION ---
export interface Order {
    id: number;
    order_id: string; // Razorpay order ID
    amount: number | string;
    payment_id?: string;
    status: 'pending' | 'success' | 'failed';
    delivery_status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
    
    // Address fields (Jo User ko dikhenge SQL JOIN se)
    fullName?: string;
    city?: string;
    pincode?: string;
    
    // User fields (Jo Admin ko dikhenge SQL JOIN se)
    userName?: string;
    userEmail?: string;
    products?: string;
}

export interface OrderResponse {
    orders: Order[];
    success: boolean;
}

// --- API SLICE ---
export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: import.meta.env.VITE_API_BASE_URL + '/api',
        prepareHeaders: (headers) => {
            return headers;
        },
        credentials: 'include', // 🔥 Ye zaroori hai taaki 'Token gayab hai' wala error na aaye
    }),
    tagTypes: ['Order'], // Auto-refresh ke liye

    endpoints: (builder) => ({
        
        // 1. FOR USER: Get my personal orders
        getMyOrders: builder.query<OrderResponse, void>({
            query: () => '/orders/my-orders',
            providesTags: ['Order'],
        }),

        // 2. FOR ADMIN: Get all users' orders
        getAllOrdersAdmin: builder.query<OrderResponse, void>({
            query: () => '/orders/all-orders',
            providesTags: ['Order'],
        }),

        // 3. FOR ADMIN: Update delivery status (Processing -> Shipped -> Delivered)
        updateOrderStatus: builder.mutation<any, { orderId: number, delivery_status: string }>({
            query: ({ orderId, delivery_status }) => ({
                url: `/orders/update-status/${orderId}`,
                method: 'PUT',
                body: { delivery_status },
            }),
            invalidatesTags: ['Order'], // Status change hote hi list refresh ho jayegi
        }),

    }),
});

// Hooks export kar lo taaki components mein use kar sako
export const { 
    useGetMyOrdersQuery, 
    useGetAllOrdersAdminQuery,
    useUpdateOrderStatusMutation
} = orderApi;