import { createSelector } from '@reduxjs/toolkit';
import { teacherAPI } from './teacherAPI';

const selectTeachersResult = teacherAPI.endpoints.getTeachers.select();

export const selectTeachers = createSelector(
  [(state) => selectTeachersResult(state)],
  (result) => result?.data?.data || []
);

export const selectTeachersLoading = createSelector(
  [(state) => selectTeachersResult(state)],
  (result) => result?.isLoading || false
);

export const selectTeachersError = createSelector(
  [(state) => selectTeachersResult(state)],
  (result) => result?.error || null
);
