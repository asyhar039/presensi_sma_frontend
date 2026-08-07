import { describe, it, expect } from 'vitest';
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
} from './authSelectors';

describe('authSelectors', () => {
  const adminState = {
    auth: {
      user: {
        id: 1,
        nama_lengkap: 'Admin',
        role: 'admin',
        permissions: ['dashboard.view', 'siswa.view'],
      },
      authType: 'user',
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
    it('mengembalikan true jika user ada', () => {
      expect(selectIsAuthenticated(adminState)).toBe(true);
    });

    it('mengembalikan false jika user null', () => {
      expect(selectIsAuthenticated(emptyState)).toBe(false);
    });
  });

  describe('selectUserRole', () => {
    it('mengembalikan role admin', () => {
      expect(selectUserRole(adminState)).toBe('admin');
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
});
