import { describe, it, expect } from 'vitest';
import usersReducer, {
  setUsers,
  addUser,
  updateUser,
  removeUser,
  setLoading,
  setError,
} from '../usersSlice';
import type { UsersState } from '../usersSlice';
import type { User } from '../../types/user.types';

describe('usersSlice', () => {
  const initialState: UsersState = {
    list: [],
    loading: false,
    error: null,
  };

  const mockUser1: User = {
    id: '1',
    username: 'user1',
    email: 'user1@example.com',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockUser2: User = {
    id: '2',
    username: 'user2',
    email: 'user2@example.com',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  };

  it('should return the initial state', () => {
    expect(usersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setUsers', () => {
    const users = [mockUser1, mockUser2];
    const actual = usersReducer(initialState, setUsers(users));
    expect(actual.list).toEqual(users);
    expect(actual.loading).toBe(false);
    expect(actual.error).toBeNull();
  });

  it('should handle addUser', () => {
    const actual = usersReducer(initialState, addUser(mockUser1));
    expect(actual.list).toHaveLength(1);
    expect(actual.list[0]).toEqual(mockUser1);
  });

  it('should handle updateUser', () => {
    const stateWithUsers: UsersState = {
      list: [mockUser1, mockUser2],
      loading: false,
      error: null,
    };

    const updatedUser: User = {
      ...mockUser1,
      username: 'updateduser',
    };

    const actual = usersReducer(stateWithUsers, updateUser(updatedUser));
    expect(actual.list[0].username).toBe('updateduser');
    expect(actual.list[1]).toEqual(mockUser2);
  });

  it('should handle removeUser', () => {
    const stateWithUsers: UsersState = {
      list: [mockUser1, mockUser2],
      loading: false,
      error: null,
    };

    const actual = usersReducer(stateWithUsers, removeUser('1'));
    expect(actual.list).toHaveLength(1);
    expect(actual.list[0]).toEqual(mockUser2);
  });

  it('should handle setLoading', () => {
    const actual = usersReducer(initialState, setLoading(true));
    expect(actual.loading).toBe(true);
  });

  it('should handle setError', () => {
    const errorMessage = 'Something went wrong';
    const actual = usersReducer(initialState, setError(errorMessage));
    expect(actual.error).toBe(errorMessage);
    expect(actual.loading).toBe(false);
  });
});
