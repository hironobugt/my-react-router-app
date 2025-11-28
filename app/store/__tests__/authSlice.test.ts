import { describe, it, expect } from 'vitest';
import authReducer, { setCurrentUser, clearCurrentUser, setLoading } from '../authSlice';
import type { AuthState } from '../authSlice';
import type { User } from '../../types/user.types';

describe('authSlice', () => {
  const initialState: AuthState = {
    currentUser: null,
    isAuthenticated: false,
    loading: false,
  };

  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setCurrentUser', () => {
    const actual = authReducer(initialState, setCurrentUser(mockUser));
    expect(actual.currentUser).toEqual(mockUser);
    expect(actual.isAuthenticated).toBe(true);
    expect(actual.loading).toBe(false);
  });

  it('should handle clearCurrentUser', () => {
    const stateWithUser: AuthState = {
      currentUser: mockUser,
      isAuthenticated: true,
      loading: false,
    };
    const actual = authReducer(stateWithUser, clearCurrentUser());
    expect(actual.currentUser).toBeNull();
    expect(actual.isAuthenticated).toBe(false);
    expect(actual.loading).toBe(false);
  });

  it('should handle setLoading', () => {
    const actual = authReducer(initialState, setLoading(true));
    expect(actual.loading).toBe(true);
  });
});
