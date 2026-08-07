import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';
import { authAPI } from '../features/auth/authAPI';
import { studentAPI } from '../features/student/studentAPI';
import { teacherAPI } from '../features/teacher/teacherAPI';
import { masterAPI } from '../features/master/masterAPI';
import { scheduleAPI } from '../features/schedule/scheduleAPI';
import { attendanceAPI } from '../features/attendance/attendanceAPI';
import { dashboardAPI } from '../features/dashboard/dashboardAPI';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [studentAPI.reducerPath]: studentAPI.reducer,
    [teacherAPI.reducerPath]: teacherAPI.reducer,
    [masterAPI.reducerPath]: masterAPI.reducer,
    [scheduleAPI.reducerPath]: scheduleAPI.reducer,
    [attendanceAPI.reducerPath]: attendanceAPI.reducer,
    [dashboardAPI.reducerPath]: dashboardAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
      },
    }).concat(
      authAPI.middleware,
      studentAPI.middleware,
      teacherAPI.middleware,
      masterAPI.middleware,
      scheduleAPI.middleware,
      attendanceAPI.middleware,
      dashboardAPI.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
