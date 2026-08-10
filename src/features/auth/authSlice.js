import { createSlice } from '@reduxjs/toolkit';
import { authAPI } from './services/authAPI';
import { studentsAPI } from '../students/services/studentsAPI';
import { ROLE_PERMISSIONS } from '../../constants/roles';

const initialState = {
  user: null,
  loading: false,
  authType: null,
  error: null,
};

function normalizeUser(raw) {
  return {
    id: raw.id,
    username: raw.username,
    nama_lengkap: raw.nama_lengkap,
    role: raw.role,
    permissions: raw.permissions || ROLE_PERMISSIONS[raw.role] || [],
  };
}

function normalizeStudent(raw) {
  return {
    id: raw.id,
    nama_lengkap: raw.nama_lengkap,
    nisn: raw.nisn,
    kelas_id: raw.kelas_id,
    role: 'student',
    permissions: ROLE_PERMISSIONS.student || [],
  };
}

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
          state.user = normalizeUser(payload.data.user);
          state.authType = 'user';
          state.error = null;
        }
      })
      .addMatcher(authAPI.endpoints.loginStudent.matchFulfilled, (state, { payload }) => {
        if (payload?.status === 'success' && payload?.data?.student) {
          state.user = normalizeStudent(payload.data.student);
          state.authType = 'student';
          state.error = null;
        }
      })
      .addMatcher(authAPI.endpoints.getCurrentUser.matchFulfilled, (state, { payload }) => {
        if (payload?.status === 'success' && payload?.data?.user) {
          state.user = normalizeUser(payload.data.user);
          state.authType = 'user';
          state.error = null;
        }
      })
      .addMatcher(studentsAPI.endpoints.getStudentProfile.matchFulfilled, (state, { payload }) => {
        if (payload?.status === 'success' && payload?.data?.student) {
          state.user = normalizeStudent(payload.data.student);
          state.authType = 'student';
          state.error = null;
        }
      });
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
