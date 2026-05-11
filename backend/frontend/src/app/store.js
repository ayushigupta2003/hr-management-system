import { configureStore } from '@reduxjs/toolkit';
import { attendanceReducer } from '../features/attendance/store/attendanceSlice';
import { authReducer } from '../features/auth/store/authSlice';
import { dashboardReducer } from '../features/dashboard/store/dashboardSlice';
import { departmentsReducer } from '../features/departments/store/departmentsSlice';
import { employeesReducer } from '../features/employees/store/employeesSlice';
import { notificationsReducer } from '../features/notifications/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    attendance:    attendanceReducer,
    dashboard:     dashboardReducer,
    departments:   departmentsReducer,
    employees:     employeesReducer,
    notifications: notificationsReducer,
  },
});
