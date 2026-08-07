import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiBaseQuery } from '../../shared/services/baseQuery';

export const dashboardAPI = createApi({
  reducerPath: 'dashboardAPI',
  baseQuery: createApiBaseQuery(),
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/dashboard/stats.php',
      transformResponse: (response) => response,
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardAPI;
