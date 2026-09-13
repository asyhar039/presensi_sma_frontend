import { createSlice } from '@reduxjs/toolkit';
import { authAPI } from './services/authAPI';
import { studentsAPI } from '../students/services/studentsAPI';
import { ROLES, ROLE_PERMISSIONS } from '../../constants/roles';

const hasToken = Boolean(localStorage.getItem('token'));
const storedUser = localStorage.getItem('user');

function readStoredUser(value) {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
}

// Fail-closed initialization: require both token and user
const persistedUser = readStoredUser(storedUser);
const isValidPersistedSession = hasToken && persistedUser;

const initialState = {
  user: isValidPersistedSession ? persistedUser : null,
  loading: false,
  authType: isValidPersistedSession ? (persistedUser.role === 'student' ? 'student' : 'user') : null,
  sessionStatus: isValidPersistedSession ? 'checking' : 'anonymous',
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
    username: raw.email || raw.username,
    nama_lengkap: raw.name || raw.nama_lengkap,
    nisn: raw.nisn,
    kelas_id: raw.kelas_id,
    role: ROLES.STUDENT,
    permissions: ROLE_PERMISSIONS[ROLES.STUDENT] || [],
    homeroom: null,
  };
}

function normalizeAuthUser(raw) {
  const roles = Array.isArray(raw?.roles) ? raw.roles : raw?.role ? [raw.role] : [];
  return roles.includes(ROLES.STUDENT) || roles.includes('Siswa')
    ? normalizeStudent(raw)
    : normalizeUser(raw);
}

function getCurrentUserFromResponse(payload) {
  const user = payload?.data?.user || payload?.data;
  return user?.id && (Array.isArray(user.roles) || user.role) ? user : null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.authType = action.payload?.role === 'student' ? 'student' : 'user';
      state.sessionStatus = action.payload ? 'verified' : 'anonymous';
      state.error = null;
    },
    sessionVerified: (state) => {
      state.sessionStatus = state.user ? 'verified' : 'anonymous';
    },
    sessionUnavailable: (state) => {
      state.user = null;
      state.authType = null;
      state.sessionStatus = 'unverified';
      state.error = 'Sesi belum dapat diverifikasi karena layanan tidak tersedia.';
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.authType = null;
      state.sessionStatus = 'anonymous';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authAPI.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.authType = null;
        state.sessionStatus = 'anonymous';
        state.error = null;
      })
      .addMatcher(authAPI.endpoints.loginUser.matchFulfilled, (state, { payload }) => {
        if (payload?.token) {
          localStorage.setItem('token', payload.token);
        }
        const rawUser = payload?.user || payload?.data?.user || payload?.data?.student;
        if (rawUser) {
          const userObj = normalizeAuthUser(rawUser);
          localStorage.setItem('user', JSON.stringify(userObj));
          state.user = userObj;
          state.authType = userObj.role === ROLES.STUDENT ? 'student' : 'user';
          state.sessionStatus = 'verified';
          state.error = null;
        }
      })
      .addMatcher(authAPI.endpoints.loginStudent.matchFulfilled, (state, { payload }) => {
        if (payload?.status === 'success' && payload?.data?.student) {
          const userObj = normalizeStudent(payload.data.student);
          localStorage.setItem('user', JSON.stringify(userObj));
          state.user = userObj;
          state.authType = 'student';
          state.sessionStatus = 'verified';
          state.error = null;
        }
      })
      .addMatcher(authAPI.endpoints.getCurrentUser.matchFulfilled, (state, { payload }) => {
        const rawUser = getCurrentUserFromResponse(payload);
        if (rawUser) {
          const userObj = normalizeAuthUser(rawUser);
          localStorage.setItem('user', JSON.stringify(userObj));
          state.user = userObj;
          state.authType = userObj.role === ROLES.STUDENT ? 'student' : 'user';
          state.sessionStatus = 'verified';
          state.error = null;
        }
      })
      .addMatcher(studentsAPI.endpoints.getStudentProfile.matchFulfilled, (state, { payload }) => {
        if (payload?.status === 'success' && payload?.data?.student) {
          const userObj = normalizeStudent(payload.data.student);
          localStorage.setItem('user', JSON.stringify(userObj));
          state.user = userObj;
          state.authType = 'student';
          state.sessionStatus = 'verified';
          state.error = null;
        }
      });
  },
});

export const {
  setUser,
  setLoading,
  setError,
  sessionVerified,
  sessionUnavailable,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
