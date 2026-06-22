import { apiSlice } from '../store/apiSlice'; 

// Response types define kar lete hain
export interface Category {
    id: number;
    name: string;
    discount_percentage: number;
    discount_start_date: string;
    discount_expiry_date: string;
}

// Specialist worker apne endpoints manager ko hand-over kar raha hai
export const discountApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
        applyCategoryDiscount: builder.mutation<any, any>({
            query: (data) => ({
                // Routing process: '/api' base hai, toh aage '/discounts/apply-discount' aayega
                url: '/discounts/apply-discount',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product', 'Category'], // Action role: cache refresh karna
        }),

        getCategories: builder.query<Category[], void>({
            // Routing process: '/discounts/getAll'
            query: () => '/discounts/getAll',
            providesTags: ['Category'],
        }),

        removeCategoryDiscount: builder.mutation<any, number | string>({
            query: (id) => ({
                // Routing process: Dynamic ID ke sath '/discounts/remove-discount/'
                url: `/discounts/remove-discount/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['Category', 'Product'], // Action role: UI ko instantly update karna
        }),
    }),
});

// Hooks export karein taaki frontend components in actions ko use kar sakein
export const {
    useGetCategoriesQuery,
    useApplyCategoryDiscountMutation,
    useRemoveCategoryDiscountMutation,
} = discountApi;