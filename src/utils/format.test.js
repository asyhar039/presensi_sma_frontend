import { describe, it, expect } from 'vitest';
import { getDisplayValue, getInitials, getStatusBadgeClass } from './format';

describe('formatters', () => {
  describe('getDisplayValue', () => {
    it('mengembalikan fallback untuk nilai null', () => {
      expect(getDisplayValue(null)).toBe('-');
    });

    it('mengembalikan fallback untuk nilai undefined', () => {
      expect(getDisplayValue(undefined)).toBe('-');
    });

    it('mengembalikan fallback untuk string kosong', () => {
      expect(getDisplayValue('')).toBe('-');
    });

    it('mengembalikan fallback custom jika diberikan', () => {
      expect(getDisplayValue(null, 'N/A')).toBe('N/A');
    });

    it('mengembalikan nilai asli jika valid', () => {
      expect(getDisplayValue('Ahmad')).toBe('Ahmad');
      expect(getDisplayValue(0)).toBe(0);
    });
  });

  describe('getInitials', () => {
    it('mengembalikan fallback jika nama kosong', () => {
      expect(getInitials('')).toBe('A');
      expect(getInitials(null)).toBe('A');
    });

    it('mengembalikan huruf pertama dalam uppercase', () => {
      expect(getInitials('ahmad dahlan')).toBe('A');
    });

    it('mengembalikan fallback custom jika diberikan', () => {
      expect(getInitials('', 'X')).toBe('X');
    });
  });

  describe('getStatusBadgeClass', () => {
    it('mengembalikan class untuk status hadir', () => {
      expect(getStatusBadgeClass('Hadir')).toBe('bg-success');
      expect(getStatusBadgeClass('hadir')).toBe('bg-success');
    });

    it('mengembalikan class untuk status izin', () => {
      expect(getStatusBadgeClass('Izin')).toBe('bg-info');
    });

    it('mengembalikan class untuk status sakit', () => {
      expect(getStatusBadgeClass('Sakit')).toBe('bg-warning');
    });

    it('mengembalikan class untuk status alfa', () => {
      expect(getStatusBadgeClass('Alfa')).toBe('bg-danger');
    });

    it('mengembalikan default class untuk status tidak dikenal', () => {
      expect(getStatusBadgeClass('unknown')).toBe('bg-secondary');
      expect(getStatusBadgeClass('')).toBe('bg-secondary');
    });
  });
});
