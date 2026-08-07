import { describe, it, expect } from 'vitest';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canCreate,
  canEdit,
  canDelete,
  canView,
} from './permissions';

describe('permissions helpers', () => {
  const permissions = ['dashboard.view', 'siswa.view', 'siswa.create', 'siswa.edit'];

  describe('hasPermission', () => {
    it('mengembalikan true jika permission ada', () => {
      expect(hasPermission(permissions, 'siswa.view')).toBe(true);
    });

    it('mengembalikan false jika permission tidak ada', () => {
      expect(hasPermission(permissions, 'guru.view')).toBe(false);
    });

    it('mengembalikan false jika permissions kosong', () => {
      expect(hasPermission([], 'siswa.view')).toBe(false);
      expect(hasPermission(null, 'siswa.view')).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('mengembalikan true jika salah satu permission ada', () => {
      expect(hasAnyPermission(permissions, ['guru.view', 'siswa.view'])).toBe(true);
    });

    it('mengembalikan false jika tidak ada yang cocok', () => {
      expect(hasAnyPermission(permissions, ['guru.view', 'mapel.view'])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('mengembalikan true jika semua permission ada', () => {
      expect(hasAllPermissions(permissions, ['siswa.view', 'siswa.create'])).toBe(true);
    });

    it('mengembalikan false jika salah satu tidak ada', () => {
      expect(hasAllPermissions(permissions, ['siswa.view', 'guru.delete'])).toBe(false);
    });
  });

  describe('action helpers', () => {
    it('canCreate memeriksa permission create', () => {
      expect(canCreate(permissions, 'siswa')).toBe(true);
      expect(canCreate(permissions, 'guru')).toBe(false);
    });

    it('canEdit memeriksa permission edit', () => {
      expect(canEdit(permissions, 'siswa')).toBe(true);
    });

    it('canDelete memeriksa permission delete', () => {
      expect(canDelete(permissions, 'siswa')).toBe(false);
    });

    it('canView memeriksa permission view', () => {
      expect(canView(permissions, 'siswa')).toBe(true);
    });
  });
});
