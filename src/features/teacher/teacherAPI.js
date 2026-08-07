import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../shared/services/baseQuery';

export const teacherAPI = createApi({
  reducerPath: 'teacherAPI',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['Teachers'],
  endpoints: (builder) => ({
    getTeachers: builder.query({
      query: () => '/guru/index.php',
      transformResponse: (response) => response,
      providesTags: ['Teachers'],
      keepUnusedDataFor: 300,
    }),
    createTeacher: builder.mutation({
      query: (teacher) => ({
        url: '/guru/index.php',
        method: 'POST',
        body: teacher,
        headers: { 'Content-Type': 'application/json' },
      }),
      transformResponse: (response) => response,
      invalidatesTags: ['Teachers'],
    }),
    updateTeacher: builder.mutation({
      query: (teacher) => ({
        url: '/guru/index.php',
        method: 'POST',
        body: { ...teacher, _method: 'PUT' },
        headers: { 'Content-Type': 'application/json' },
      }),
      transformResponse: (response) => response,
      invalidatesTags: ['Teachers'],
    }),
    deleteTeacher: builder.mutation({
      query: (id) => ({
        url: '/guru/index.php',
        method: 'POST',
        body: { id, _method: 'DELETE' },
        headers: { 'Content-Type': 'application/json' },
      }),
      transformResponse: (response) => response,
      invalidatesTags: ['Teachers'],
    }),
  }),
});

export const {
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherAPI;
