import { createSelector } from '@reduxjs/toolkit';
import { schedulesAPI } from './services/schedulesAPI';

const selectSchedulesResult = schedulesAPI.endpoints.getSchedules.select();

export const selectSchedules = createSelector(
  [(state) => selectSchedulesResult(state)],
  (result) => result?.data?.data || []
);

export const selectSchedulesLoading = createSelector(
  [(state) => selectSchedulesResult(state)],
  (result) => result?.isLoading || false
);

export const selectSchedulesError = createSelector(
  [(state) => selectSchedulesResult(state)],
  (result) => result?.error || null
);
