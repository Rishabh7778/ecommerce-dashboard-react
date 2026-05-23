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
  discounted_price?: number;
  oldPrice?: number;
  sku?: string;
  stockCount: number; // (Pichla fix, agar aapne strict kiya tha)
  weight?: string;
  mfgDate?: string;
  expiryDate?: string;
  rating?: number;
  reviewsCount?: number; // 🔥 YE NAYI LINE ADD KARNI HAI
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
    baseUrl: import.meta.env.VITE_API_BASE_URL + '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Order', 'Category'],

  endpoints: (builder) => ({
    getAllProducts: builder.query<any, { page?: number, limit?: string | number, category?: number | null } | void>({
      query: (arg) => {
        if (arg) {
          const { page = 1, limit = 12, category } = arg;
          let url = `/products/getAll?page=${page}&limit=${limit}`;

          // 🔥 Agar user ne category select ki hai, toh URL mein attach kar do
          if (category) {
            url += `&category=${category}`;
          }
          return url;
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
    createOrder: builder.mutation<any, { amount: number; address_id: string | number }>({
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

    addReview: builder.mutation<any, { product_id: string | number, rating: number, review_text: string }>({
      query: (data) => ({
        url: '/products/review',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),

    getProductReviews: builder.query<any, string>({
      query: (id) => `/products/review/${id}`,
      providesTags: ['Product'], // Taaki naya review aane pe auto-refresh ho
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
  useGetDashboardStatsQuery,
  useAddReviewMutation,
  useGetProductReviewsQuery,
} = productApi;