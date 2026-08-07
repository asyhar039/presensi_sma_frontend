import { createSelector } from '@reduxjs/toolkit';
import { studentAPI } from './studentAPI';

const selectStudentsResult = studentAPI.endpoints.getStudents.select();
const selectStudentProfileResult = studentAPI.endpoints.getStudentProfile.select();

export const selectStudents = createSelector(
  [(state) => selectStudentsResult(state)],
  (result) => result?.data?.data || []
);

export const selectStudentsLoading = createSelector(
  [(state) => selectStudentsResult(state)],
  (result) => result?.isLoading || false
);

export const selectStudentsError = createSelector(
  [(state) => selectStudentsResult(state)],
  (result) => result?.error || null
);

export const selectStudentProfile = createSelector(
  [(state) => selectStudentProfileResult(state)],
  (result) => result?.data?.data || null
);

export const selectStudentProfileLoading = createSelector(
  [(state) => selectStudentProfileResult(state)],
  (result) => result?.isLoading || false
);

export const selectStudentHistory = createSelector(
  [selectStudentProfile],
  (profile) => profile?.history || []
);

export const selectStudentStats = createSelector(
  [selectStudentProfile],
  (profile) => profile?.stats || {}
);
