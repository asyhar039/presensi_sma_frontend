import { createSlice } from '@reduxjs/toolkit';
import { authAPI } from './services/authAPI';
import { studentsAPI } from '../students/services/studentsAPI';
import { ROLES, ROLE_PERMISSIONS } from '../../constants/roles';

const hasToken = Boolean(localStorage.getItem('token'));
const storedUser = localStorage.getItem('user');

// Fail-closed initialization: require both token and user
const isValidPersistedSession = hasToken && storedUser;

const initialState = {
  user: isValidPersistedSession ? JSON.parse(storedUser) : null,
  loading: false,
  authType: isValidPersistedSession ? (JSON.parse(storedUser)?.role === 'student' ? 'student' : 'user') : null,
  error: null,
};

function normalizeUser(raw) {
  let primaryRole = Array.isArray(raw.roles) ? raw.roles[0] : (raw.role || ROLES.ADMIN);
  if (primaryRole === 'Super Admin') primaryRole = ROLES.ADMIN;
  if (primaryRole === 'Guru') primaryRole = ROLES.TEACHER;
  if (primaryRole === 'Siswa') primaryRole = ROLES.STUDENT;

  const homeroom = raw.homeroom ?? null;
  let permissions = raw.permissions || ROLE_PERMISSIONS[primaryRole] || ROLE_PERMISSIONS[ROLES.ADMIN] || [];
  if (!permissions.includes('profil.view')) {
    permissions = [...permissions, 'profil.view'];
  }

  return {
    id: raw.id,
    username: raw.email || raw.username,
    nama_lengkap: raw.name || raw.nama_lengkap,
    role: primaryRole,
    permissions,
    homeroom,
  };
}

function normalizeStudent(raw) {
  return {
    id: raw.id,
    nama_lengkap: raw.nama_lengkap,
    nisn: raw.nisn,
    kelas_id: raw.kelas_id,
    role: ROLES.STUDENT,
    permissions: ROLE_PERMISSIONS[ROLES.STUDENT] || [],
    homeroom: null,
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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        state.user = null;
        state.authType = null;
        state.error = null;
      })
      .addMatcher(authAPI.endpoints.loginUser.matchFulfilled, (state, { payload }) => {
        if (payload?.token) {
          localStorage.setItem('token', payload.token);
        }
        if (payload?.user || payload?.data?.user) {
          const userObj = normalizeUser(payload.user || payload.data.user);
          localStorage.setItem('user', JSON.stringify(userObj));
          state.user = userObj;
          state.authType = 'user';
          state.error = null;
        }
      })
      .addMatcher(authAPI.endpoints.loginStudent.matchFulfilled, (state, { payload }) => {
        if (payload?.status === 'success' && payload?.data?.student) {
          const userObj = normalizeStudent(payload.data.student);
          localStorage.setItem('user', JSON.stringify(userObj));
          state.user = userObj;
          state.authType = 'student';
          state.error = null;
        }
      })
      .addMatcher(authAPI.endpoints.getCurrentUser.matchFulfilled, (state, { payload }) => {
        if (payload?.status === 'success' && payload?.data?.user) {
          const userObj = normalizeUser(payload.data.user);
          localStorage.setItem('user', JSON.stringify(userObj));
          state.user = userObj;
          state.authType = 'user';
          state.error = null;
        }
      })
      .addMatcher(studentsAPI.endpoints.getStudentProfile.matchFulfilled, (state, { payload }) => {
        if (payload?.status === 'success' && payload?.data?.student) {
          const userObj = normalizeStudent(payload.data.student);
          localStorage.setItem('user', JSON.stringify(userObj));
          state.user = userObj;
          state.authType = 'student';
          state.error = null;
        }
      });
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
