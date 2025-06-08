import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from '../../api/supabaseLogin';

// Thunk para login con supabase
export const loginWithSupabase = createAsyncThunk(
  'auth/loginWithSupabase',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await loginUser(email, password);
      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error de autenticación');
    }
  }
);
