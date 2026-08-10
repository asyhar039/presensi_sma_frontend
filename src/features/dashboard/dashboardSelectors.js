import { createSelector } from '@reduxjs/toolkit';
import { dashboardAPI } from './services/dashboardAPI';

const selectDashboardStatsResult = dashboardAPI.endpoints.getDashboardStats.select();

export const selectDashboardStats = createSelector(
  [(state) => selectDashboardStatsResult(state)],
  (result) => result?.data?.data || null
);

export const selectDashboardStatsLoading = createSelector(
  [(state) => selectDashboardStatsResult(state)],
  (result) => result?.isLoading || result?.isFetching || false
);

export const selectDashboardStatsError = createSelector(
  [(state) => selectDashboardStatsResult(state)],
  (result) => result?.error || null
);

export const selectDashboardTotals = createSelector(
  [selectDashboardStats],
  (stats) => stats?.totals || {}
);

export const selectTodayAttendance = createSelector(
  [selectDashboardStats],
  (stats) => stats?.today_attendance || {}
);
