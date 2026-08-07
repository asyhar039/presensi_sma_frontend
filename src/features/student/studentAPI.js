import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../shared/services/baseQuery';
import { buildCrudEndpoints } from '../../shared/services/crudApi';

export const studentAPI = createApi({
  reducerPath: 'studentAPI',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['Students', 'StudentProfile'],
  endpoints: (builder) => ({
    ...buildCrudEndpoints(builder, { entity: 'student', entities: 'students', basePath: '/siswa/index.php', tag: 'Students' }),
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
