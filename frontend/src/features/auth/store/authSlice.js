import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { storage } from '../../../utils/storage';
import { authApi } from '../services/authApi';

const initialToken = storage.get(STORAGE_KEYS.authToken);
// Normalize legacy stored user that may have been wrapped in { data: {...} }
const rawUser = storage.get(STORAGE_KEYS.authUser);
const initialUser = rawUser?.data ?? rawUser;

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    return await authApi.login(payload);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    return await authApi.register(payload);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
    return true;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    return await authApi.updateProfile(payload);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (payload, { rejectWithValue }) => {
  try {
    return await authApi.changePassword(payload);
  } catch (error) {
    return rejectWithValue(error);
  }
});

const persistSession = (data) => {
  storage.set(STORAGE_KEYS.authToken, data.access_token);
  storage.set(STORAGE_KEYS.authUser, data.user);
};

const clearSession = () => {
  storage.remove(STORAGE_KEYS.authToken);
  storage.remove(STORAGE_KEYS.authUser);
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
    user: initialUser,
    isAuthenticated: Boolean(initialToken),
    isLoading: false,
    errors: null,
  },
  reducers: {
    clearAuthError(state) {
      state.errors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const data = action.payload.data;
        persistSession(data);
        state.token = data.access_token;
        state.user = data.user;
        state.isAuthenticated = true;
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload?.errors;
        toast.error(action.payload?.message ?? 'Login failed.');
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        const data = action.payload.data;
        persistSession(data);
        state.token = data.access_token;
        state.user = data.user;
        state.isAuthenticated = true;
        state.isLoading = false;
        toast.success(action.payload.message);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload?.errors;
        toast.error(action.payload?.message ?? 'Registration failed.');
      })
      .addCase(logout.fulfilled, (state) => {
        clearSession();
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        toast.success('Logged out successfully.');
      })
      .addCase(logout.rejected, (state) => {
        clearSession();
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      // updateProfile
      .addCase(updateProfile.pending, (state) => { state.isLoading = true; state.errors = null; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const user = action.payload.data.user;
        state.user = user;
        state.isLoading = false;
        storage.set(STORAGE_KEYS.authUser, user);
        toast.success(action.payload.message);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload?.errors;
        toast.error(action.payload?.message ?? 'Failed to update profile.');
      })
      // changePassword
      .addCase(changePassword.pending, (state) => { state.isLoading = true; state.errors = null; })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errors = null;
        toast.success(action.payload.message);
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload?.errors;
        toast.error(action.payload?.message ?? 'Failed to change password.');
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export const authReducer = authSlice.reducer;
