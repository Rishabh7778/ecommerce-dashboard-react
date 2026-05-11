import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL + '/api/users', // 🔥 Aapka naya user route
    credentials: 'include',
  }),
  tagTypes: ['User'],

  endpoints: (builder) => ({
    // 1. Saare users fetch karna
    getAllUsers: builder.query<any, void>({
      query: () => '/getAll',
      providesTags: ['User'],
    }),

    // 2. User ka role change karna (Admin/User)
    updateUserRole: builder.mutation<any, { id: number | string; role: string }>({
      query: ({ id, role }) => ({
        url: `/update-role/${id}`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['User'], // Update hote hi list refresh hogi
    }),

    // 3. User ko delete karna
    deleteUser: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = userApi;