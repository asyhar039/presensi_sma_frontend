import { createSlice } from '@reduxjs/toolkit';
import { authAPI } from './authAPI';
import { studentAPI } from '../student/studentAPI';
import { ROLE_PERMISSIONS } from '../../shared/constants/permissions';

const initialState = {
  user: null,
  loading: false,
  authType: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.authType = action.payload?.role === 'student' ? 'student' : 'user';
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.authType = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authAPI.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.authType = null;
        state.error = null;
      })
      .addMatcher(authAPI.endpoints.loginUser.matchFulfilled, (state, { payload }) => {
        if (payload?.status === 'success' && payload?.data?.user) {
          const raw = payload.data.user;
          state.user = {
            id: raw.id,
            username: raw.username,
            nama_lengkap: raw.nama_lengkap,
            role: raw.role,
            permissions: raw.permissions || ROLE_PERMISSIONS[raw.role] || [],
          };
          state.authType = 'user';
          state.error = null;
        }
      })
      .addMatcher(authAPI.endpoints.loginStudent.matchFulfilled, (state, { payload }) => {
        if (payload?.status === 'success' && payload?.data?.student) {
          const raw = payload.data.student;
          state.user = {
            id: raw.id,
            nama_lengkap: raw.nama_lengkap,
            nisn: raw.nisn,
            kelas_id: raw.kelas_id,
            role: 'student',
            permissions: ROLE_PERMISSIONS.student || [],
          };
          state.authType = 'student';
          state.error = null;
        }
      })
      .addMatcher(authAPI.endpoints.getCurrentUser.matchFulfilled, (state, { payload }) => {
        if (payload?.status === 'success' && payload?.data?.user) {
          const raw = payload.data.user;
          state.user = {
            id: raw.id,
            username: raw.username,
            nama_lengkap: raw.nama_lengkap,
            role: raw.role,
            permissions: raw.permissions || ROLE_PERMISSIONS[raw.role] || [],
          };
          state.authType = 'user';
          state.error = null;
        }
      })
      .addMatcher(studentAPI.endpoints.getStudentProfile.matchFulfilled, (state, { payload }) => {
        if (payload?.status === 'success' && payload?.data?.student) {
          const raw = payload.data.student;
          state.user = {
            id: raw.id,
            nama_lengkap: raw.nama_lengkap,
            nisn: raw.nisn,
            kelas_id: raw.kelas_id,
            role: 'student',
            permissions: ROLE_PERMISSIONS.student || [],
          };
          state.authType = 'student';
          state.error = null;
        }
      });
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
