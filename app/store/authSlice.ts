import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/user.types';

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setCurrentUser, clearCurrentUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
