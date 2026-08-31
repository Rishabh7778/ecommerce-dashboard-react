import { apiSlice } from '../store/apiSlice'; // Main API import karo

export interface Category {
  id: number;
  name: string;
  discount_percentage?: number;
  discount_start_date?: string;
  discount_expiry_date?: string;
}

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
  stockCount: number; 
  weight?: string;
  mfgDate?: string;
  expiryDate?: string;
  rating?: number;
  reviewsCount?: number; 
  badge?: string | null;
  badgeColor?: string | null;
  discount?: number;
  status?: 'draft' | 'published';
  img?: string;
  discount_percentage?: number;
  category_name?: string;
}

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<any, { page?: number, limit?: string | number, category?: number | null } | void>({
      query: (arg) => {
        if (arg) {
          const { page = 1, limit = 12, category } = arg;
          let url = `/products/getAll?page=${page}&limit=${limit}`;
          if (category) url += `&category=${category}`;
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

    getCategories: builder.query<Category[], void>({
      query: () => '/products/categories/getAll',
      providesTags: ['Category'],
    }),

    getDashboardStats: builder.query<any, void>({
      query: () => '/products/dashboard-stats', 
      providesTags: ['Product'], 
    }),

    applyCategoryDiscount: builder.mutation<any, any>({
      query: (data) => ({
        url: '/products/categories/apply-discount',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product', 'Category'],
    }),

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

    updateProduct: builder.mutation<any, { id: number | string; data: FormData | any }>({
      query: ({ id, data }) => ({
        url: `/products/update/${id}`,
        method: 'PUT',
        body: data, 
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

    removeDailyDeal: builder.mutation<any, number | string>({
      query: (id) => ({ url: `/products/daily-deal/remove/${id}`, method: 'PUT' }),
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
      providesTags: ['Product'], 
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useAddProductMutation,
  useBulkAddProductsMutation,
  useGetCategoriesQuery,
  useUpdateProductMutation,
    useDeleteProductMutation,
    useRemoveDailyDealMutation,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useApplyCategoryDiscountMutation,
  useGetProductByIdQuery,
  useGetDashboardStatsQuery,
  useAddReviewMutation,
  useGetProductReviewsQuery,
} = productApi;
