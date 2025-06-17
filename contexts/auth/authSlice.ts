import { createSlice } from '@reduxjs/toolkit';
import { loginWithSupabase } from './authThunks';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithSupabase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithSupabase.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginWithSupabase.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Error de autenticación';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
