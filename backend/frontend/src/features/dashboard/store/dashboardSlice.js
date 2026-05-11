import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { dashboardApi } from '../services/dashboardApi';

export const fetchDashboardStats = createAsyncThunk('dashboard/fetchStats', async (_, { rejectWithValue }) => {
  try {
    return await dashboardApi.stats();
  } catch (error) {
    return rejectWithValue(error);
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
        state.isLoading = false;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message ?? 'Unable to load dashboard.';
      });
  },
});

export const dashboardReducer = dashboardSlice.reducer;
