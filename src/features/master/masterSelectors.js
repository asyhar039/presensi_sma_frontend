import { createSelector } from '@reduxjs/toolkit';
import { masterAPI } from './masterAPI';

const selectClassesResult = masterAPI.endpoints.getClasses.select();
const selectSubjectsResult = masterAPI.endpoints.getSubjects.select();

export const selectClasses = createSelector(
  [(state) => selectClassesResult(state)],
  (result) => result?.data?.data || []
);

export const selectClassesLoading = createSelector(
  [(state) => selectClassesResult(state)],
  (result) => result?.isLoading || false
);

export const selectSubjects = createSelector(
  [(state) => selectSubjectsResult(state)],
  (result) => result?.data?.data || []
);

export const selectSubjectsLoading = createSelector(
  [(state) => selectSubjectsResult(state)],
  (result) => result?.isLoading || false
);
