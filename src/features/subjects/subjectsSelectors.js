import { createSelector } from '@reduxjs/toolkit';
import { subjectsAPI } from './services/subjectsAPI';

const selectSubjectsResult = subjectsAPI.endpoints.getSubjects.select();

export const selectSubjects = createSelector(
  [(state) => selectSubjectsResult(state)],
  (result) => result?.data?.data || []
);

export const selectSubjectsLoading = createSelector(
  [(state) => selectSubjectsResult(state)],
  (result) => result?.isLoading || false
);
