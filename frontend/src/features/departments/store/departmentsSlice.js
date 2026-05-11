import { createAsyncThunk } from '@reduxjs/toolkit';
import { createCrudSlice } from '../../../store/createCrudSlice';
import { departmentsApi } from '../services/departmentsApi';

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchDepartments = createAsyncThunk(
  'departments/fetch',
  async (params = {}, { rejectWithValue }) => {
    try { return await departmentsApi.list(params); }
    catch (e) { return rejectWithValue(e); }
  }
);

export const saveDepartment = createAsyncThunk(
  'departments/save',
  async ({ id, payload }, { rejectWithValue }) => {
    try { return id ? await departmentsApi.update(id, payload) : await departmentsApi.create(payload); }
    catch (e) { return rejectWithValue(e); }
  }
);

export const deleteDepartment = createAsyncThunk(
  'departments/delete',
  async (id, { rejectWithValue }) => {
    try { await departmentsApi.remove(id); return id; }
    catch (e) { return rejectWithValue(e); }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const slice = createCrudSlice('departments', {
  fetch:  fetchDepartments,
  save:   saveDepartment,
  remove: deleteDepartment,
});

export const { clearErrors: clearDepartmentErrors } = slice.actions;
export const departmentsReducer = slice.reducer;
