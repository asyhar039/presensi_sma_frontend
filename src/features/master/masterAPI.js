import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../shared/services/baseQuery';
import { buildCrudEndpoints } from '../../shared/services/crudApi';

export const masterAPI = createApi({
  reducerPath: 'masterAPI',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['Classes', 'Subjects'],
  endpoints: (builder) => ({
    ...buildCrudEndpoints(builder, { entity: 'class', entities: 'classes', basePath: '/kelas/index.php', tag: 'Classes' }),
    ...buildCrudEndpoints(builder, { entity: 'subject', entities: 'subjects', basePath: '/mapel/index.php', tag: 'Subjects' }),
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
