import { createSlice } from '@reduxjs/toolkit';
import { saveEmployee } from '../employees/store/employeesSlice';
import { markAttendance, bulkMarkAttendance } from '../attendance/store/attendanceSlice';

let nextId = 1;

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],   // { id, type, title, message, time, read }
  },
  reducers: {
    addNotification(state, action) {
      state.items.unshift({
        id:      nextId++,
        type:    action.payload.type ?? 'info',   // success | warning | error | info
        title:   action.payload.title,
        message: action.payload.message ?? '',
        time:    new Date().toISOString(),
        read:    false,
      });
      // Keep max 50 notifications
      if (state.items.length > 50) state.items = state.items.slice(0, 50);
    },
    markRead(state, action) {
      const n = state.items.find((i) => i.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead(state) {
      state.items.forEach((i) => { i.read = true; });
    },
    removeNotification(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearAll(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    // New employee created
    builder.addCase(saveEmployee.fulfilled, (state, action) => {
      const isNew = !action.meta.arg?.id;
      if (isNew) {
        const emp = action.payload?.data?.employee;
        state.items.unshift({
          id:      nextId++,
          type:    'success',
          title:   'New Employee Added',
          message: emp ? `${emp.full_name} has been added to the system.` : 'A new employee was added.',
          time:    new Date().toISOString(),
          read:    false,
        });
      }
    });

    // Attendance marked
    builder.addCase(markAttendance.fulfilled, (state, action) => {
      const att = action.payload?.data?.attendance;
      if (att?.status === 'absent') {
        state.items.unshift({
          id:      nextId++,
          type:    'warning',
          title:   'Absence Recorded',
          message: `${att.employee?.full_name ?? 'An employee'} marked absent on ${att.attendance_date}.`,
          time:    new Date().toISOString(),
          read:    false,
        });
      }
    });

    // Bulk attendance marked
    builder.addCase(bulkMarkAttendance.fulfilled, (state, action) => {
      state.items.unshift({
        id:      nextId++,
        type:    'info',
        title:   'Bulk Attendance Marked',
        message: action.payload?.message ?? 'Attendance marked for multiple employees.',
        time:    new Date().toISOString(),
        read:    false,
      });
    });
  },
});

export const {
  addNotification, markRead, markAllRead,
  removeNotification, clearAll,
} = notificationsSlice.actions;

export const notificationsReducer = notificationsSlice.reducer;
