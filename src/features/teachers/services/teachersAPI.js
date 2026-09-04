import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../../services/axios';
import { buildCrudEndpoints } from '../../../services/crudApi';

export const teachersAPI = createApi({
  reducerPath: 'teachersAPI',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['Teachers'],
  endpoints: (builder) => ({
    ...buildCrudEndpoints(builder, { entity: 'teacher', entities: 'teachers', basePath: '/teachers', tag: 'Teachers' }),
  }),
});

export const {
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teachersAPI;
