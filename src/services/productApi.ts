import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// --- NEW CATEGORY INTERFACE ---
export interface Category {
  id: number;
  name: string;
  discount_percentage?: number;
  discount_start_date?: string;
  discount_expiry_date?: string;
}

// --- UPDATED PRODUCT INTERFACE (Matching SQL Schema) ---
export interface Product {
  id?: number;
  title: string;
  description?: string | null;
  category_id: number;
  brand: string;
  price: number;
  discounted_price?: number; // 🔥 Naya field calculated price ke liye
  oldPrice?: number;
  sku?: string;
  stockCount?: number;
  weight?: string;
  mfgDate?: string;
  expiryDate?: string;
  rating?: number;
  badge?: string | null;
  badgeColor?: string | null;
  discount?: number;
  status?: 'draft' | 'published';
  img?: string;
  discount_percentage?: number;
  category_name?: string;
}

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    credentials: 'include', // Cookie headers ke liye zaroori hai
  }),
  tagTypes: ['Product', 'Order', 'Category'],

  endpoints: (builder) => ({
    // --- PRODUCT ENDPOINTS ---
    // --- PRODUCT ENDPOINTS ---
    getAllProducts: builder.query<any, { page?: number, limit?: string | number } | void>({
      // Agar arguments aaye hain toh query string banao, nahi toh normal /getAll
      query: (arg) => {
        if (arg) {
           const { page = 1, limit = 12 } = arg;
           return `/products/getAll?page=${page}&limit=${limit}`;
        }
        return '/products/getAll';
      },
      providesTags: ['Product'],
    }),

    addProduct: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/products/add',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Product'],
    }),

    // baaki endpoints ke sath isko add karein...
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/get/${id}`,
      providesTags: ['Product'],
    }),

    bulkAddProducts: builder.mutation<any, Product[]>({
      query: (products) => ({
        url: '/products/bulk-add',
        method: 'POST',
        body: products,
      }),
      invalidatesTags: ['Product'],
    }),

    // --- CATEGORY ENDPOINTS ---
    getCategories: builder.query<Category[], void>({
      query: () => '/products/categories/getAll',
      providesTags: ['Category'],
    }),


    // Endpoint add karein endpoints: (builder) => ({ ... }) ke andar
    getDashboardStats: builder.query<any, void>({
      query: () => '/products/dashboard-stats', // Apna backend route check kar lena
      providesTags: ['Product'], // Taaki product add/delete hone par ye auto-refresh ho
    }),

    // --- DISCOUNT ENDPOINT ---
    applyCategoryDiscount: builder.mutation<any, any>({
      query: (data) => ({
        url: '/products/categories/apply-discount',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product', 'Category'],
    }),

    // --- PAYMENT ENDPOINTS ---
    createOrder: builder.mutation<any, { amount: number; address_id: number }>({
      query: (data) => ({
        url: '/payments/create-order',
        method: 'POST',
        body: data,
      }),
    }),

    verifyPayment: builder.mutation<any, any>({
      query: (data) => ({
        url: '/payments/verify-payment',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),

    // --- OTHER CRUD ---
    updateProduct: builder.mutation<any, { id: number | string; data: FormData | any }>({
      query: ({ id, data }) => ({
        url: `/products/update/${id}`,
        method: 'PUT',
        body: data, // Yahan aayega apka FormData
      }),
      invalidatesTags: ['Product'],
    }),

    deleteProduct: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/products/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

// 🔥 Sabhi hooks export ho gaye sahi syntax ke saath
export const {
  useGetAllProductsQuery,
  useAddProductMutation,
  useBulkAddProductsMutation,
  useGetCategoriesQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useApplyCategoryDiscountMutation,
  useGetProductByIdQuery,
  useGetDashboardStatsQuery
} = productApi;