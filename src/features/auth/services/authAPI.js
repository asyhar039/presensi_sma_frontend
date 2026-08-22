import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../../services/axios';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: createApiBaseQuery(),
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => '/me',
      transformResponse: (response) => response,
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
        headers: { 'Content-Type': 'application/json' },
      }),
      transformResponse: (response) => response,
    }),
    loginStudent: builder.mutation({
      query: (credentials) => ({
        url: '/student',
        method: 'POST',
        body: credentials,
        headers: { 'Content-Type': 'application/json' },
      }),
      transformResponse: (response) => response,
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
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
