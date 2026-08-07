import { createSelector } from '@reduxjs/toolkit';

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
  (role) => role === 'admin'
);

export const selectIsTeacher = createSelector(
  [selectUserRole],
  (role) => role === 'guru'
);

export const selectIsStudent = createSelector(
  [selectUserRole],
  (role) => role === 'student'
);
