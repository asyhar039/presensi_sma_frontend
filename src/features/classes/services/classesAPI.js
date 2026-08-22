import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../../services/axios';
import { buildCrudEndpoints } from '../../../services/crudApi';

export const classesAPI = createApi({
  reducerPath: 'classesAPI',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['Classes'],
  endpoints: (builder) => ({
    ...buildCrudEndpoints(builder, { entity: 'class', entities: 'classes', basePath: '/classes', tag: 'Classes' }),
  }),
});

export const {
  useGetClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classesAPI;
