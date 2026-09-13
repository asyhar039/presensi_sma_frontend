import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../../services/axios';
import { buildCrudEndpoints } from '../../../services/crudApi';

export const subjectsAPI = createApi({
  reducerPath: 'subjectsAPI',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['Subjects'],
  endpoints: (builder) => ({
    ...buildCrudEndpoints(builder, { entity: 'subject', entities: 'subjects', basePath: '/mapels', tag: 'Subjects' }),
  }),
});

export const {
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectsAPI;
