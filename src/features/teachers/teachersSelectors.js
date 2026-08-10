import { createSelector } from '@reduxjs/toolkit';
import { teachersAPI } from './services/teachersAPI';

const selectTeachersResult = teachersAPI.endpoints.getTeachers.select();

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
