import { apiSlice } from '../store/apiSlice';

export interface Order {
    id: number;
    order_id: string; 
    amount: number | string;
    payment_id?: string;
    status: 'pending' | 'success' | 'failed';
    delivery_status: 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
    created_at: string;
    fullName?: string;
    city?: string;
    pincode?: string;
    userName?: string;
    userEmail?: string;
    products?: string;
    product_id?: number;
    product_image?: string;
}

export interface OrderResponse {
    orders: Order[];
    success: boolean;
}

export const orderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyOrders: builder.query<OrderResponse, void>({
            query: () => '/orders/my-orders',
            providesTags: ['Order'],
        }),
        getAllOrdersAdmin: builder.query<OrderResponse, void>({
            query: () => '/orders/all-orders',
            providesTags: ['Order'],
        }),
        updateOrderStatus: builder.mutation<any, { orderId: number, delivery_status: string }>({
            query: ({ orderId, delivery_status }) => ({
                url: `/orders/update-status/${orderId}`,
                method: 'PUT',
                body: { delivery_status },
            }),
            invalidatesTags: ['Order'], 
        }),
    }),
});

export const { 
    useGetMyOrdersQuery, 
    useGetAllOrdersAdminQuery,
    useUpdateOrderStatusMutation
} = orderApi;
