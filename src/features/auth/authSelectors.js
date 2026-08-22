import { createSelector } from '@reduxjs/toolkit';
import { ROLES } from '../../constants/roles';

export const selectAuth = (state) => state.auth;

export const selectUser = createSelector(
  [selectAuth],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectUser],
  (user) => user !== null
);

export const selectUserRole = createSelector(
  [selectUser],
  (user) => user?.role || null
);

export const selectUserPermissions = createSelector(
  [selectUser],
  (user) => user?.permissions || []
);

export const selectAuthType = createSelector(
  [selectAuth],
  (auth) => auth.authType
);

export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === ROLES.ADMIN
);

export const selectIsTeacher = createSelector(
  [selectUserRole],
  (role) => role === ROLES.TEACHER
);

export const selectIsStudent = createSelector(
  [selectUserRole],
  (role) => role === ROLES.STUDENT
);

export const selectUserHomeroom = createSelector(
  [selectUser],
  (user) => user?.homeroom ?? null
);

export const selectIsHomeroomTeacher = createSelector(
  [selectUserHomeroom],
  (homeroom) => homeroom?.is_homeroom_teacher === true
);
