import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { createCrudSlice } from '../../../store/createCrudSlice';
import { employeesApi } from '../services/employeesApi';

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchEmployees = createAsyncThunk(
  'employees/fetch',
  async (params = {}, { rejectWithValue }) => {
    try { return await employeesApi.list(params); }
    catch (e) { return rejectWithValue(e); }
  }
);

export const saveEmployee = createAsyncThunk(
  'employees/save',
  async ({ id, payload }, { rejectWithValue }) => {
    try { return id ? await employeesApi.update(id, payload) : await employeesApi.create(payload); }
    catch (e) { return rejectWithValue(e); }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, { rejectWithValue }) => {
    try { await employeesApi.remove(id); return id; }
    catch (e) { return rejectWithValue(e); }
  }
);

export const toggleEmployeeStatus = createAsyncThunk(
  'employees/toggleStatus',
  async (id, { rejectWithValue }) => {
    try { return await employeesApi.toggleStatus(id); }
    catch (e) { return rejectWithValue(e); }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const slice = createCrudSlice('employees', {
  fetch:  fetchEmployees,
  save:   saveEmployee,
  remove: deleteEmployee,
}, {
  extraReducers: (builder) => {
    builder
      .addCase(toggleEmployeeStatus.fulfilled, (state, action) => {
        const updated = action.payload.data.employee;
        state.items = state.items.map((emp) => emp.id === updated.id ? updated : emp);
        toast.success(action.payload.message);
      })
      .addCase(toggleEmployeeStatus.rejected, (_, action) => {
        toast.error(action.payload?.message ?? 'Unable to toggle status.');
      });
  },
});

export const { clearErrors: clearEmployeeErrors } = slice.actions;
export const employeesReducer = slice.reducer;
