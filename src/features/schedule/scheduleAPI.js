import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../shared/services/baseQuery';
import { buildCrudEndpoints } from '../../shared/services/crudApi';

export const scheduleAPI = createApi({
  reducerPath: 'scheduleAPI',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['Schedules'],
  endpoints: (builder) => ({
    ...buildCrudEndpoints(builder, { entity: 'schedule', entities: 'schedules', basePath: '/jadwal/index.php', tag: 'Schedules' }),
    getSchedulesByClass: builder.query({
      query: (kelasId) => `/jadwal/index.php?kelas_id=${kelasId}`,
      transformResponse: (response) => response,
      providesTags: (result, error, kelasId) => [{ type: 'Schedules', id: kelasId }],
    }),
  }),
});

export const {
  useGetSchedulesQuery,
  useGetSchedulesByClassQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} = scheduleAPI;
