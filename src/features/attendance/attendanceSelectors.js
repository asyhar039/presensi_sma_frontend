import { createSelector } from '@reduxjs/toolkit';

export const selectAttendance = (state) => state.attendance;

export const selectAttendanceFilters = createSelector(
  [selectAttendance],
  (attendance) => attendance.filters
);
