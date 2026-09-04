import { createSelector } from '@reduxjs/toolkit';
import { classesAPI } from './services/classesAPI';

const selectClassesResult = classesAPI.endpoints.getClasses.select();

export const selectClasses = createSelector(
  [(state) => selectClassesResult(state)],
  (result) => result?.data?.data || []
);

export const selectClassesLoading = createSelector(
  [(state) => selectClassesResult(state)],
  (result) => result?.isLoading || false
);
