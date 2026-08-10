import { createSelector } from '@reduxjs/toolkit';
import { reportsAPI } from './services/reportsAPI';

const selectAttendanceReportResult = reportsAPI.endpoints.getAttendanceReport.select();

export const selectAttendanceReport = createSelector(
  [(state) => selectAttendanceReportResult(state)],
  (result) => result?.data?.data || null
);

export const selectAttendanceReportLoading = createSelector(
  [(state) => selectAttendanceReportResult(state)],
  (result) => result?.isLoading || result?.isFetching || false
);

export const selectAttendanceReportError = createSelector(
  [(state) => selectAttendanceReportResult(state)],
  (result) => result?.error || null
);
