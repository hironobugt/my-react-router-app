import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/user.types';

export interface UsersState {
  list: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  list: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.list.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.list.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(user => user.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setUsers, addUser, updateUser, removeUser, setLoading, setError } = usersSlice.actions;
export default usersSlice.reducer;
