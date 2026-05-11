# HR Management System — Frontend Documentation

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| State Management | Redux Toolkit |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Excel Export | xlsx (SheetJS) |

---

## Project Structure

```
frontend/src/
├── api/
│   ├── httpClient.js           # Axios instance with JWT interceptors
│   └── createCrudApi.js        # Factory: creates list/get/create/update/remove API object
├── app/
│   └── store.js                # Redux store — combines all slice reducers
├── components/
│   ├── common/
│   │   ├── Avatar.jsx          # Initials circle with deterministic gradient
│   │   ├── Badge.jsx           # Status/role colored pill
│   │   ├── Button.jsx          # Primary / secondary / danger / ghost variants
│   │   ├── ConfirmDialog.jsx   # Destructive action confirmation popup
│   │   ├── DataTable.jsx       # Generic table with column render functions
│   │   ├── EmptyState.jsx      # Empty list placeholder with icon + action
│   │   ├── Modal.jsx           # Accessible modal (Escape, backdrop click, X button)
│   │   ├── PageHeader.jsx      # Page title + description + action buttons
│   │   ├── Pagination.jsx      # Page controls with ellipsis + per-page selector
│   │   └── SearchInput.jsx     # Search field with icon + clear button
│   ├── feedback/
│   │   ├── LoadingSkeleton.jsx # TableSkeleton, CardSkeleton, Spinner, PageLoader
│   │   └── TopLoader.jsx       # Global top progress bar (auto-activates on any loading state)
│   └── forms/
│       ├── InputField.jsx      # Labeled input with error + hint
│       └── SelectField.jsx     # Labeled select with error
├── config/
│   └── env.js                  # VITE_API_BASE_URL config
├── constants/
│   ├── appRoutes.js            # Route path constants
│   └── storageKeys.js          # localStorage key constants
├── features/
│   ├── attendance/
│   │   ├── pages/AttendancePage.jsx
│   │   ├── services/attendanceApi.js
│   │   └── store/attendanceSlice.js
│   ├── auth/
│   │   ├── components/AuthCard.jsx
│   │   ├── pages/LoginPage.jsx
│   │   ├── pages/RegisterPage.jsx
│   │   ├── services/authApi.js
│   │   └── store/authSlice.js
│   ├── dashboard/
│   │   ├── pages/DashboardPage.jsx
│   │   ├── services/dashboardApi.js
│   │   └── store/dashboardSlice.js
│   ├── departments/
│   │   ├── pages/DepartmentsPage.jsx
│   │   ├── services/departmentsApi.js
│   │   └── store/departmentsSlice.js
│   └── employees/
│       ├── pages/EmployeesPage.jsx
│       ├── services/employeesApi.js
│       └── store/employeesSlice.js
├── hooks/
│   ├── useAuth.js              # Returns full auth Redux state
│   ├── useCrudModal.js         # Encapsulates modal open/close/form/submit pattern
│   └── useRole.js              # isAdmin, isHR, isEmployee, isAdminOrHR, hasRole()
├── layouts/
│   ├── AppLayout.jsx           # Sidebar + top bar + main content area
│   └── AuthLayout.jsx          # Centered card on gradient background
├── pages/
│   └── UnauthorizedPage.jsx    # 403 page for role-restricted routes
├── routes/
│   ├── ProtectedRoute.jsx      # Redirects to /login if not authenticated
│   ├── RoleRoute.jsx           # Redirects to /dashboard if wrong role
│   └── router.jsx              # All route definitions
├── store/
│   └── createCrudSlice.js      # Factory: generates standard CRUD Redux slice
└── utils/
    ├── exportExcel.js          # exportAttendanceToExcel / exportMonthlyReportToExcel
    ├── queryString.js          # Converts params object to ?key=value string
    └── storage.js              # localStorage get/set/remove with JSON parse
```

---

## Architecture

### Feature-Sliced Design
Each feature (`auth`, `employees`, `departments`, `attendance`, `dashboard`) is self-contained:
```
features/
└── employees/
    ├── pages/      ← UI components (what the user sees)
    ├── services/   ← API call functions
    └── store/      ← Redux state (thunks + slice)
```

### Data Flow
```
User Action → Page Component → dispatch(thunk) → API Service → httpClient
                                                                    ↓
Redux State ← slice reducer ← fulfilled/rejected action ← API Response
     ↓
Component re-renders with new data
```

---

## Key Abstractions

### `createCrudApi(basePath, overrides)`
Generates a standard API object for any resource:
```js
// Usage
export const departmentsApi = createCrudApi('/departments');
// Gives you: departmentsApi.list(params), .get(id), .create(payload), .update(id, payload), .remove(id)

// With overrides (employees need FormData for file upload)
export const employeesApi = createCrudApi('/employees', {
  update: (id, payload) => { /* custom FormData logic */ },
  toggleStatus: (id) => httpClient.patch(`/employees/${id}/toggle-status`),
});
```

### `createCrudSlice(name, thunks, options)`
Generates a standard Redux slice with `items`, `meta`, `isLoading`, `isSaving`, `errors`:
```js
const slice = createCrudSlice('departments', {
  fetch:  fetchDepartments,
  save:   saveDepartment,
  remove: deleteDepartment,
});
// Automatically handles: pending/fulfilled/rejected for all 3 thunks
// Shows toast on success/error
```

### `useCrudModal(emptyForm, saveThunk, fetchThunk, mapToForm)`
Encapsulates the entire modal + form pattern used in every CRUD page:
```js
const { isOpen, editing, form, setField, openModal, closeModal, handleSubmit, f } =
  useCrudModal(EMPTY_FORM, saveDepartment, fetchDepartments);

// f('name') returns an onChange handler that updates form.name
// handleSubmit(e, payload, fetchParams) dispatches save + refetches
// openModal(item) opens for edit; openModal() opens for create
```

### `useRole()`
```js
const { isAdmin, isHR, isEmployee, isAdminOrHR, hasRole } = useRole();
// hasRole('admin', 'hr') → true if user has either role
```

---

## State Management

### Redux Store Structure
```js
{
  auth: {
    token: string | null,
    user: { id, name, email, role, status, ... } | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    errors: object | null,
  },
  employees: {
    items: Employee[],
    meta: PaginationMeta | null,
    isLoading: boolean,
    isSaving: boolean,
    errors: object | null,
  },
  departments: { /* same shape */ },
  attendance: {
    items: Attendance[],
    meta: PaginationMeta | null,
    report: MonthlyReport[],
    isLoading: boolean,
    isSaving: boolean,
    errors: object | null,
  },
  dashboard: {
    stats: DashboardStats | null,
    isLoading: boolean,
    error: string | null,
  },
}
```

### Pagination Meta Shape
```js
{
  current_page: 1,
  last_page: 4,
  per_page: 10,
  total: 20,
  from: 1,
  to: 10,
}
```

---

## Routing

```
/login              → LoginPage        (public)
/register           → RegisterPage     (public)
/dashboard          → DashboardPage    (all authenticated)
/unauthorized       → UnauthorizedPage (all authenticated)
/employees          → EmployeesPage    (admin + hr only)
/departments        → DepartmentsPage  (admin + hr only)
/attendance         → AttendancePage   (admin + hr only)
/                   → redirect to /dashboard
*                   → redirect to /dashboard
```

Route guards:
- `ProtectedRoute` — checks `isAuthenticated`, redirects to `/login`
- `RoleRoute` — checks user role against allowed roles, redirects to `/dashboard`

---

## HTTP Client

`httpClient.js` wraps Axios with:
- Base URL from `VITE_API_BASE_URL` env variable (default: `http://localhost:8000/api/v1`)
- 15-second timeout
- Auto-attaches `Authorization: Bearer <token>` from localStorage on every request
- Response interceptor unwraps `response.data` (returns the API payload directly)
- Error interceptor normalizes errors to `{ message, errors, status }`

---

## Components Reference

### `<Pagination meta onChange onPerPageChange pageSizes />`
```jsx
<Pagination
  meta={meta}                              // from Redux state
  onChange={(page) => setPage(page)}
  onPerPageChange={(pp) => setPerPage(pp)}
  pageSizes={[10, 25, 50]}                 // optional
/>
```
Hides automatically when `last_page <= 1`.

### `<Avatar name size />`
```jsx
<Avatar name="John Doe" size="md" />
// sizes: xs | sm | md | lg | xl
// Gradient color is deterministic based on name string
```

### `<ConfirmDialog isOpen title message onConfirm onCancel />`
```jsx
<ConfirmDialog
  isOpen={!!deleteId}
  title="Delete Employee"
  message="This cannot be undone."
  onConfirm={() => { dispatch(deleteEmployee(deleteId)); setDeleteId(null); }}
  onCancel={() => setDeleteId(null)}
/>
```

### `<Modal title isOpen onClose />`
Closes via: X button, backdrop click, or Escape key.

### `<TopLoader />`
Automatically shows a thin brand-colored progress bar at the top of the page whenever any Redux slice has `isLoading: true` or `isSaving: true`. No props needed — just mount it once in `main.jsx`.

---

## Excel Export

```js
import { exportAttendanceToExcel, exportMonthlyReportToExcel } from '../utils/exportExcel';

// Export attendance records for a day
exportAttendanceToExcel(items, 'attendance-2026-05-10');

// Export monthly report
exportMonthlyReportToExcel(report, 2026, 5);
```

Columns exported:
- **Attendance**: Employee Name, Code, Department, Date, Check In, Check Out, Status, Remarks
- **Monthly Report**: Employee Name, Code, Department, Present, Late, Absent, Leave, Working Days

---

## Environment Variables

```env
# .env (frontend)
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## Setup Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Design System

### Colors
- **Brand**: `#246bfe` (blue) — primary actions, active states
- **Ink**: `#172033` — primary text
- **Background**: `#f0f4f9` — page background

### Tailwind Custom Classes
- `shadow-card` — subtle card shadow
- `shadow-card-hover` — elevated card shadow on hover
- `shadow-soft` — modal/dropdown shadow
- `animate-fade-in` — opacity 0→1 on mount
- `animate-slide-up` — slide up + fade on mount

### Component Variants
**Button**: `primary` (blue gradient) | `secondary` (white + border) | `danger` (red gradient) | `ghost` (transparent)

**Badge**: `active` (green) | `inactive` (grey) | `admin` (blue) | `hr` (violet) | `employee` (sky) | `present` (green) | `late` (amber) | `absent` (red) | `leave` (purple)
