import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../../services/axios';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: createApiBaseQuery(),
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => '/auth/me.php',
      transformResponse: (response) => response,
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login.php',
        method: 'POST',
        body: credentials,
        headers: { 'Content-Type': 'application/json' },
      }),
      transformResponse: (response) => response,
    }),
    loginStudent: builder.mutation({
      query: (credentials) => ({
        url: '/auth/student_login.php',
        method: 'POST',
        body: credentials,
        headers: { 'Content-Type': 'application/json' },
      }),
      transformResponse: (response) => response,
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout.php',
        method: 'GET',
      }),
      transformResponse: (response) => response,
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLoginUserMutation,
  useLoginStudentMutation,
  useLogoutMutation,
} = authAPI;
