import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../../services/axios';
import { buildCrudEndpoints } from '../../../services/crudApi';

export const studentsAPI = createApi({
  reducerPath: 'studentsAPI',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['Students', 'StudentProfile'],
  endpoints: (builder) => ({
    ...buildCrudEndpoints(builder, { entity: 'student', entities: 'students', basePath: '/students', tag: 'Students' }),
    getStudentById: builder.query({
      query: (id) => `/students?id=${id}`,
      transformResponse: (response) => response,
      providesTags: (result, error, id) => [{ type: 'Students', id }],
    }),
    getStudentProfile: builder.query({
      query: () => '/me',
      transformResponse: (response) => ({
        ...response,
        data: {
          ...(response?.data || {}),
          student: response?.data?.student || response?.data?.user,
        },
      }),
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
} = studentsAPI;
