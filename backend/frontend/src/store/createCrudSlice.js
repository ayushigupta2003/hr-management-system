import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

/**
 * Factory that generates a standard CRUD slice with:
 *  - items[], meta, isLoading, isSaving, errors state
 *  - Standard pending/fulfilled/rejected handlers for fetch, save, delete
 *
 * @param {string} name         Slice name (e.g. 'employees')
 * @param {object} thunks       { fetch, save, remove } async thunks
 * @param {object} options      { extraReducers } for custom cases
 */
export function createCrudSlice(name, thunks, options = {}) {
  const { fetch: fetchThunk, save: saveThunk, remove: removeThunk } = thunks;

  const slice = createSlice({
    name,
    initialState: {
      items:     [],
      meta:      null,
      isLoading: false,
      isSaving:  false,
      errors:    null,
    },
    reducers: {
      clearErrors(state) {
        state.errors = null;
      },
    },
    extraReducers: (builder) => {
      // ── Fetch ──────────────────────────────────────────────────────────────
      if (fetchThunk) {
        builder
          .addCase(fetchThunk.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(fetchThunk.fulfilled, (state, action) => {
            state.items     = action.payload.data;
            state.meta      = action.payload.meta ?? null;
            state.isLoading = false;
          })
          .addCase(fetchThunk.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload?.message ?? `Unable to load ${name}.`);
          });
      }

      // ── Save (create / update) ─────────────────────────────────────────────
      if (saveThunk) {
        builder
          .addCase(saveThunk.pending, (state) => {
            state.isSaving = true;
            state.errors   = null;
          })
          .addCase(saveThunk.fulfilled, (state, action) => {
            state.isSaving = false;
            toast.success(action.payload.message);
          })
          .addCase(saveThunk.rejected, (state, action) => {
            state.isSaving = false;
            state.errors   = action.payload?.errors ?? null;
            toast.error(action.payload?.message ?? `Unable to save ${name}.`);
          });
      }

      // ── Delete ─────────────────────────────────────────────────────────────
      if (removeThunk) {
        builder
          .addCase(removeThunk.fulfilled, (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            toast.success(`${name.slice(0, -1)} deleted successfully.`);
          })
          .addCase(removeThunk.rejected, (_, action) => {
            toast.error(action.payload?.message ?? `Unable to delete ${name}.`);
          });
      }

      // ── Custom extra reducers ──────────────────────────────────────────────
      options.extraReducers?.(builder);
    },
  });

  return slice;
}
