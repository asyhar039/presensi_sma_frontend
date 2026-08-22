import { createSelector } from '@reduxjs/toolkit';

export const selectHomeroomState = (state) => state.auth?.user?.homeroom ?? null;

export const selectIsHomeroomTeacher = createSelector(
  [selectHomeroomState],
  (homeroom) => homeroom?.is_homeroom_teacher === true
);
