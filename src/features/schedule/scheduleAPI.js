import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../shared/services/baseQuery';

export const scheduleAPI = createApi({
  reducerPath: 'scheduleAPI',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['Schedules'],
  endpoints: (builder) => ({
    getSchedules: builder.query({
      query: () => '/jadwal/index.php',
      transformResponse: (response) => response,
      providesTags: ['Schedules'],
      keepUnusedDataFor: 300,
    }),
    getSchedulesByClass: builder.query({
      query: (kelasId) => `/jadwal/index.php?kelas_id=${kelasId}`,
      transformResponse: (response) => response,
      providesTags: (result, error, kelasId) => [{ type: 'Schedules', id: kelasId }],
    }),
    createSchedule: builder.mutation({
      query: (data) => ({
        url: '/jadwal/index.php',
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Schedules'],
    }),
    updateSchedule: builder.mutation({
      query: (data) => ({
        url: '/jadwal/index.php',
        method: 'POST',
        body: { ...data, _method: 'PUT' },
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Schedules'],
    }),
    deleteSchedule: builder.mutation({
      query: (id) => ({
        url: '/jadwal/index.php',
        method: 'POST',
        body: { id, _method: 'DELETE' },
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Schedules'],
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
