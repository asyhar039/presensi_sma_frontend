import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectUserRole,
  selectUserPermissions,
  selectAuthType,
  selectIsAdmin,
  selectIsTeacher,
  selectIsStudent,
  selectUserHomeroom,
} from './authSelectors';

describe('authSelectors', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key) => {
        if (key === 'token') return 'mock-token';
        return null;
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
  const adminState = {
    auth: {
      user: {
        id: 1,
        nama_lengkap: 'Admin',
        role: 'super_admin',
        permissions: ['dashboard.view', 'siswa.view'],
      },
      authType: 'user',
      sessionStatus: 'verified',
    },
  };

  const studentState = {
    auth: {
      user: {
        id: 5,
        nama_lengkap: 'Siswa',
        role: 'student',
        permissions: ['profil.view'],
      },
      authType: 'student',
      sessionStatus: 'verified',
    },
  };

  const emptyState = {
    auth: { user: null, authType: null },
  };

  describe('selectUser', () => {
    it('mengembalikan user jika ada', () => {
      expect(selectUser(adminState)).toEqual(adminState.auth.user);
    });

    it('mengembalikan null jika tidak ada', () => {
      expect(selectUser(emptyState)).toBeNull();
    });
  });

  describe('selectIsAuthenticated', () => {
    it('mengembalikan true jika user ada dan token ada', () => {
      expect(selectIsAuthenticated(adminState)).toBe(true);
    });

    it('mengembalikan false jika user null', () => {
      expect(selectIsAuthenticated(emptyState)).toBe(false);
    });

    it('mengembalikan false jika user ada tetapi token tidak ada', () => {
      vi.stubGlobal('localStorage', {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      });
      // Pass a new object reference to bypass memoization
      expect(selectIsAuthenticated({ ...adminState })).toBe(false);
    });
  });

  describe('selectUserRole', () => {
    it('mengembalikan role admin', () => {
      expect(selectUserRole(adminState)).toBe('super_admin');
    });

    it('mengembalikan null jika user null', () => {
      expect(selectUserRole(emptyState)).toBeNull();
    });
  });

  describe('selectUserPermissions', () => {
    it('mengembalikan array permissions', () => {
      expect(selectUserPermissions(adminState)).toEqual(['dashboard.view', 'siswa.view']);
    });

    it('mengembalikan array kosong jika user null', () => {
      expect(selectUserPermissions(emptyState)).toEqual([]);
    });
  });

  describe('selectAuthType', () => {
    it('mengembalikan authType user', () => {
      expect(selectAuthType(adminState)).toBe('user');
    });

    it('mengembalikan authType student', () => {
      expect(selectAuthType(studentState)).toBe('student');
    });
  });

  describe('role selectors', () => {
    it('selectIsAdmin', () => {
      expect(selectIsAdmin(adminState)).toBe(true);
      expect(selectIsAdmin(studentState)).toBe(false);
    });

    it('selectIsTeacher', () => {
      expect(selectIsTeacher(studentState)).toBe(false);
    });

    it('selectIsStudent', () => {
      expect(selectIsStudent(studentState)).toBe(true);
      expect(selectIsStudent(adminState)).toBe(false);
    });
  });

  describe('selectUserHomeroom', () => {
    it('returns null when homeroom is not set', () => {
      expect(selectUserHomeroom(adminState)).toBeNull();
    });

    it('returns homeroom object when set', () => {
      const stateWithHomeroom = {
        auth: {
          user: {
            id: 15,
            role: 'guru',
            homeroom: { is_homeroom_teacher: true, class_id: 10, class_name: 'X IPA 1' },
          },
        },
      };
      expect(selectUserHomeroom(stateWithHomeroom)).toEqual({
        is_homeroom_teacher: true,
        class_id: 10,
        class_name: 'X IPA 1',
      });
    });
  });
});
