import { apiSlice } from '../store/apiSlice'; // Main API import karo

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<any, void>({
      query: () => '/users/getAll', // '/api' base hai, aage '/users' lag gaya
      providesTags: ['User'],
    }),

    updateUserRole: builder.mutation<any, { id: number | string; role: string }>({
      query: ({ id, role }) => ({
        url: `/users/update-role/${id}`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['User'], 
    }),

    deleteUser: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/users/delete/${id}`,
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