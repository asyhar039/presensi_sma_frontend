import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../shared/services/baseQuery';
import { buildCrudEndpoints } from '../../shared/services/crudApi';

export const teacherAPI = createApi({
  reducerPath: 'teacherAPI',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['Teachers'],
  endpoints: (builder) => ({
    ...buildCrudEndpoints(builder, { entity: 'teacher', entities: 'teachers', basePath: '/guru/index.php', tag: 'Teachers' }),
  }),
});

export const {
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherAPI;
