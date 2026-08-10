import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';
import { authAPI } from '../features/auth/services/authAPI';
import { studentsAPI } from '../features/students/services/studentsAPI';
import { teachersAPI } from '../features/teachers/services/teachersAPI';
import { classesAPI } from '../features/classes/services/classesAPI';
import { subjectsAPI } from '../features/subjects/services/subjectsAPI';
import { schedulesAPI } from '../features/schedules/services/schedulesAPI';
import { reportsAPI } from '../features/reports/services/reportsAPI';
import { dashboardAPI } from '../features/dashboard/services/dashboardAPI';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [studentsAPI.reducerPath]: studentsAPI.reducer,
    [teachersAPI.reducerPath]: teachersAPI.reducer,
    [classesAPI.reducerPath]: classesAPI.reducer,
    [subjectsAPI.reducerPath]: subjectsAPI.reducer,
    [schedulesAPI.reducerPath]: schedulesAPI.reducer,
    [reportsAPI.reducerPath]: reportsAPI.reducer,
    [dashboardAPI.reducerPath]: dashboardAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
      },
    }).concat(
      authAPI.middleware,
      studentsAPI.middleware,
      teachersAPI.middleware,
      classesAPI.middleware,
      subjectsAPI.middleware,
      schedulesAPI.middleware,
      reportsAPI.middleware,
      dashboardAPI.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
