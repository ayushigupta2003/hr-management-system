import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { attendanceApi } from '../services/attendanceApi';

export const fetchAttendance = createAsyncThunk(
  'attendance/fetch',
  async (params = {}, { rejectWithValue }) => {
    try { return await attendanceApi.list(params); }
    catch (e) { return rejectWithValue(e); }
  }
);

export const markAttendance = createAsyncThunk(
  'attendance/mark',
  async (payload, { rejectWithValue }) => {
    try { return await attendanceApi.mark(payload); }
    catch (e) { return rejectWithValue(e); }
  }
);

export const bulkMarkAttendance = createAsyncThunk(
  'attendance/bulkMark',
  async (records, { rejectWithValue }) => {
    try { return await attendanceApi.bulkMark({ records }); }
    catch (e) { return rejectWithValue(e); }
  }
);

export const fetchMonthlyReport = createAsyncThunk(
  'attendance/monthlyReport',
  async (params, { rejectWithValue }) => {
    try { return await attendanceApi.monthlyReport(params); }
    catch (e) { return rejectWithValue(e); }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    items:     [],
    meta:      null,
    report:    [],
    isLoading: false,
    isSaving:  false,
    errors:    null,
  },
  reducers: {
    clearAttendanceErrors(state) { state.errors = null; },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchAttendance.pending,   (state) => { state.isLoading = true; })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.items     = action.payload.data;
        state.meta      = action.payload.meta ?? null;
        state.isLoading = false;
      })
      .addCase(fetchAttendance.rejected,  (state, action) => {
        state.isLoading = false;
        toast.error(action.payload?.message ?? 'Unable to load attendance.');
      })
      // single mark
      .addCase(markAttendance.pending,   (state) => { state.isSaving = true; state.errors = null; })
      .addCase(markAttendance.fulfilled, (state) => { state.isSaving = false; toast.success('Attendance marked.'); })
      .addCase(markAttendance.rejected,  (state, action) => {
        state.isSaving = false;
        state.errors   = action.payload?.errors;
        toast.error(action.payload?.message ?? 'Unable to mark attendance.');
      })
      // bulk mark
      .addCase(bulkMarkAttendance.pending,   (state) => { state.isSaving = true; state.errors = null; })
      .addCase(bulkMarkAttendance.fulfilled, (state, action) => {
        state.isSaving = false;
        toast.success(action.payload.message);
      })
      .addCase(bulkMarkAttendance.rejected,  (state, action) => {
        state.isSaving = false;
        state.errors   = action.payload?.errors;
        toast.error(action.payload?.message ?? 'Unable to mark bulk attendance.');
      })
      // monthly report
      .addCase(fetchMonthlyReport.pending,   (state) => { state.isLoading = true; })
      .addCase(fetchMonthlyReport.fulfilled, (state, action) => {
        state.report    = action.payload.data.report;
        state.isLoading = false;
      })
      .addCase(fetchMonthlyReport.rejected,  (state) => { state.isLoading = false; });
  },
});

export const { clearAttendanceErrors } = attendanceSlice.actions;
export const attendanceReducer = attendanceSlice.reducer;
