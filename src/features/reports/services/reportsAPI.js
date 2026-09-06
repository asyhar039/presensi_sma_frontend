import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../../services/axios';

export const reportsAPI = createApi({
  reducerPath: 'reportsAPI',
  baseQuery: createApiBaseQuery(),
  tagTypes: ['AttendanceReport'],
  endpoints: (builder) => ({
    getAttendanceReport: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.kelas_id) searchParams.set('kelas_id', params.kelas_id);
        if (params?.bulan) searchParams.set('bulan', params.bulan);
        if (params?.tahun) searchParams.set('tahun', params.tahun);
        const query = searchParams.toString();
        return `/absensi/${query ? `?${query}` : ''}`;
      },
      transformResponse: (response) => response,
      providesTags: ['AttendanceReport'],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),
  }),
});

export const { useGetAttendanceReportQuery } = reportsAPI;