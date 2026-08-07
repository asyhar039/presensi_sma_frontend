import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../shared/services/baseQuery';

export const masterAPI = createApi({
  reducerPath: 'masterAPI',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['Classes', 'Subjects'],
  endpoints: (builder) => ({
    getClasses: builder.query({
      query: () => '/kelas/index.php',
      transformResponse: (response) => response,
      providesTags: ['Classes'],
      keepUnusedDataFor: 300,
    }),
    getSubjects: builder.query({
      query: () => '/mapel/index.php',
      transformResponse: (response) => response,
      providesTags: ['Subjects'],
      keepUnusedDataFor: 300,
    }),
    createClass: builder.mutation({
      query: (data) => ({
        url: '/kelas/index.php',
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Classes'],
    }),
    updateClass: builder.mutation({
      query: (data) => ({
        url: '/kelas/index.php',
        method: 'POST',
        body: { ...data, _method: 'PUT' },
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Classes'],
    }),
    deleteClass: builder.mutation({
      query: (id) => ({
        url: '/kelas/index.php',
        method: 'POST',
        body: { id, _method: 'DELETE' },
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Classes'],
    }),
    createSubject: builder.mutation({
      query: (data) => ({
        url: '/mapel/index.php',
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Subjects'],
    }),
    updateSubject: builder.mutation({
      query: (data) => ({
        url: '/mapel/index.php',
        method: 'POST',
        body: { ...data, _method: 'PUT' },
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Subjects'],
    }),
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: '/mapel/index.php',
        method: 'POST',
        body: { id, _method: 'DELETE' },
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Subjects'],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetSubjectsQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = masterAPI;
