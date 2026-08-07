import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../shared/services/baseQuery';

export const studentAPI = createApi({
  reducerPath: 'studentAPI',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['Students', 'StudentProfile'],
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => '/siswa/index.php',
      transformResponse: (response) => response,
      providesTags: ['Students'],
      keepUnusedDataFor: 300,
    }),
    getStudentById: builder.query({
      query: (id) => `/siswa/index.php?id=${id}`,
      transformResponse: (response) => response,
      providesTags: (result, error, id) => [{ type: 'Students', id }],
    }),
    getStudentProfile: builder.query({
      query: () => '/student/profile.php',
      transformResponse: (response) => response,
      providesTags: ['StudentProfile'],
      keepUnusedDataFor: 60,
      refetchOnMountOrArgChange: true,
    }),
    createStudent: builder.mutation({
      query: (student) => ({
        url: '/siswa/index.php',
        method: 'POST',
        body: student,
        headers: { 'Content-Type': 'application/json' },
      }),
      transformResponse: (response) => response,
      invalidatesTags: ['Students'],
    }),
    updateStudent: builder.mutation({
      query: (student) => ({
        url: '/siswa/index.php',
        method: 'POST',
        body: { ...student, _method: 'PUT' },
        headers: { 'Content-Type': 'application/json' },
      }),
      transformResponse: (response) => response,
      invalidatesTags: (result, error, { id }) => ['Students', { type: 'Students', id }],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: '/siswa/index.php',
        method: 'POST',
        body: { id, _method: 'DELETE' },
        headers: { 'Content-Type': 'application/json' },
      }),
      transformResponse: (response) => response,
      invalidatesTags: ['Students'],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useGetStudentProfileQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentAPI;
