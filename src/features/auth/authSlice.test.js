import { beforeEach, describe, expect, it, vi } from 'vitest';

const createStorage = (values = {}) => ({
  getItem: vi.fn((key) => values[key] ?? null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
});

describe('authSlice session handling', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('clears malformed persisted user data without throwing', async () => {
    const storage = createStorage({ token: 'stale-token', user: '{invalid-json' });
    vi.stubGlobal('localStorage', storage);

    const { default: reducer } = await import('./authSlice');
    const state = reducer(undefined, { type: '@@init' });

    expect(state.user).toBeNull();
    expect(state.sessionStatus).toBe('anonymous');
    expect(storage.removeItem).toHaveBeenCalledWith('token');
    expect(storage.removeItem).toHaveBeenCalledWith('user');
  });

  it('clears local credentials when logout action is dispatched', async () => {
    const storage = createStorage({ token: 'token', user: '{"role":"student"}' });
    vi.stubGlobal('localStorage', storage);

    const { default: reducer } = await import('./authSlice');
    const state = reducer(undefined, { type: 'auth/logout' });

    expect(state.user).toBeNull();
    expect(state.sessionStatus).toBe('anonymous');
    expect(storage.removeItem).toHaveBeenCalledWith('token');
    expect(storage.removeItem).toHaveBeenCalledWith('user');
  });

  it('normalizes a student returned by the main login endpoint', async () => {
    const storage = createStorage();
    vi.stubGlobal('localStorage', storage);

    const { default: reducer } = await import('./authSlice');
    const state = reducer(undefined, {
      type: 'authAPI/executeMutation/fulfilled',
      meta: { arg: { endpointName: 'loginUser' } },
      payload: {
        token: 'student-token',
        data: { user: { id: 7, name: 'Siswa', role: 'student' } },
      },
    });

    expect(state.user.role).toBe('student');
    expect(state.authType).toBe('student');
    expect(state.sessionStatus).toBe('verified');
    expect(storage.setItem).toHaveBeenCalledWith('token', 'student-token');
  });

  it('restores a backend user returned directly in /me data', async () => {
    const storage = createStorage();
    vi.stubGlobal('localStorage', storage);

    const { default: reducer } = await import('./authSlice');
    const state = reducer(undefined, {
      type: 'authAPI/executeQuery/fulfilled',
      meta: { arg: { endpointName: 'getCurrentUser' } },
      payload: {
        data: {
          id: 2,
          name: 'Super Admin',
          email: 'admin@nespaloka.com',
          roles: ['Super Admin'],
        },
      },
    });

    expect(state.user).toMatchObject({
      id: 2,
      nama_lengkap: 'Super Admin',
      role: 'super_admin',
    });
    expect(state.sessionStatus).toBe('verified');
    expect(storage.setItem).toHaveBeenCalledWith('user', expect.stringContaining('super_admin'));
  });
});