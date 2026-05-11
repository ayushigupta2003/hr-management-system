# HR Management System — Backend Documentation

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Laravel 10 |
| Language | PHP 8.1+ |
| Authentication | JWT (tymon/jwt-auth v2.3) |
| Database | MySQL (via XAMPP, port 3307) |
| ORM | Eloquent |
| Testing | PHPUnit 10 |
| Code Style | Laravel Pint |

---

## Project Structure

```
backend/
├── app/
│   ├── Console/              # Artisan commands
│   ├── Enums/                # PHP 8.1 backed enums
│   │   ├── Concerns/
│   │   │   └── HasEnumValues.php     # Shared trait for values() method
│   │   ├── AttendanceStatus.php      # present | absent | late | leave
│   │   ├── EmployeeStatus.php        # active | inactive
│   │   ├── UserRole.php              # admin | hr | employee
│   │   └── UserStatus.php            # active | inactive
│   ├── Exceptions/
│   │   └── Handler.php               # Global JSON error handler for all API routes
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/V1/               # All API controllers (versioned)
│   │   │       ├── AttendanceController.php
│   │   │       ├── AuthController.php
│   │   │       ├── DashboardController.php
│   │   │       ├── DepartmentController.php
│   │   │       └── EmployeeController.php
│   │   ├── Middleware/
│   │   │   └── EnsureRole.php        # RBAC middleware — checks user role
│   │   ├── Requests/                 # Form request validation classes
│   │   │   ├── Attendance/
│   │   │   │   ├── BulkAttendanceRequest.php
│   │   │   │   ├── MonthlyReportRequest.php
│   │   │   │   └── StoreAttendanceRequest.php
│   │   │   ├── Auth/
│   │   │   │   ├── LoginRequest.php
│   │   │   │   └── RegisterRequest.php
│   │   │   ├── Department/
│   │   │   │   ├── StoreDepartmentRequest.php
│   │   │   │   └── UpdateDepartmentRequest.php
│   │   │   └── Employee/
│   │   │       ├── StoreEmployeeRequest.php
│   │   │       └── UpdateEmployeeRequest.php
│   │   └── Resources/                # API response transformers
│   │       ├── AttendanceResource.php
│   │       ├── DepartmentResource.php
│   │       ├── EmployeeResource.php
│   │       └── UserResource.php
│   ├── Models/
│   │   ├── Attendance.php
│   │   ├── Department.php
│   │   ├── Employee.php              # Has getFullNameAttribute() accessor
│   │   └── User.php                  # Implements JWTSubject
│   ├── Providers/
│   │   └── AppServiceProvider.php    # Binds UserRepositoryInterface → UserRepository
│   ├── Repositories/
│   │   ├── Contracts/
│   │   │   └── UserRepositoryInterface.php
│   │   └── Eloquent/
│   │       └── UserRepository.php
│   ├── Services/                     # Business logic layer
│   │   ├── AttendanceService.php
│   │   ├── AuthService.php
│   │   ├── DashboardService.php
│   │   ├── DepartmentService.php
│   │   └── EmployeeService.php
│   └── Traits/
│       └── ApiResponse.php           # successResponse() / errorResponse() helpers
├── config/
│   ├── auth.php                      # JWT guard configured as default
│   ├── cors.php                      # CORS — allows all origins (dev)
│   └── jwt.php                       # JWT TTL, algorithm, blacklist settings
├── database/
│   ├── migrations/                   # 8 migration files
│   └── seeders/
│       ├── AdminUserSeeder.php       # admin@hrms.test / Password123
│       ├── AttendanceSeeder.php      # 1,178 records across 90 days
│       ├── DatabaseSeeder.php        # Orchestrates all seeders
│       ├── DepartmentSeeder.php      # 6 departments
│       ├── EmployeeSeeder.php        # 20 employees
│       └── HRUserSeeder.php          # hr@hrms.test + employee@hrms.test
└── routes/
    └── api.php                       # All API routes with middleware
```

---

## Architecture

The backend follows a **Controller → Service → Model** layered architecture:

```
Request → FormRequest (validation) → Controller → Service → Model/Repository → Response
```

- **Controllers** — thin, delegate all logic to services, return Resources
- **Services** — all business logic lives here
- **Form Requests** — all validation separated from controllers
- **Resources** — consistent JSON response shaping
- **Traits** — `ApiResponse` on base `Controller` for uniform responses

---

## Database Schema

### users
| Column | Type | Notes |
|---|---|---|
| id | bigint | PK |
| name | varchar(120) | |
| email | varchar(255) | unique |
| password | varchar | bcrypt hashed |
| role | enum | admin / hr / employee |
| status | enum | active / inactive |
| avatar_path | varchar | nullable |
| phone | varchar(30) | nullable |
| job_title | varchar(120) | nullable |

### departments
| Column | Type | Notes |
|---|---|---|
| id | bigint | PK |
| name | varchar(120) | unique |
| code | varchar(30) | unique |
| description | text | nullable |
| is_active | boolean | default true |

### employees
| Column | Type | Notes |
|---|---|---|
| id | bigint | PK |
| user_id | bigint | FK → users (nullable) |
| department_id | bigint | FK → departments |
| employee_code | varchar(60) | unique |
| first_name | varchar(80) | |
| last_name | varchar(80) | |
| email | varchar(255) | unique |
| phone | varchar(30) | nullable |
| designation | varchar(120) | |
| joining_date | date | nullable |
| salary | decimal(12,2) | nullable |
| address | text | nullable |
| image_path | varchar | nullable |
| status | enum | active / inactive |

### attendances
| Column | Type | Notes |
|---|---|---|
| id | bigint | PK |
| employee_id | bigint | FK → employees |
| attendance_date | date | |
| check_in | time | nullable |
| check_out | time | nullable |
| status | enum | present / absent / late / leave |
| remarks | text | nullable |
| unique | (employee_id, attendance_date) | one record per employee per day |

---

## API Routes

Base URL: `http://localhost:8000/api/v1`

### Authentication (Public)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user (role: employee) |
| POST | `/auth/login` | Login, returns JWT token |

### Authentication (Protected — `auth:api`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/auth/me` | Get authenticated user |
| POST | `/auth/refresh` | Refresh JWT token |
| POST | `/auth/logout` | Logout (blacklist token) |

### Dashboard (All authenticated users)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard/stats` | Employee, department, attendance stats |

### Departments (admin + hr: read | admin only: write)
| Method | Endpoint | Roles |
|---|---|---|
| GET | `/departments` | admin, hr |
| GET | `/departments/{id}` | admin, hr |
| POST | `/departments` | admin only |
| PUT | `/departments/{id}` | admin only |
| DELETE | `/departments/{id}` | admin only |

### Employees (admin + hr)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees` | List with search, filter, pagination |
| POST | `/employees` | Create (supports image upload) |
| GET | `/employees/{id}` | Show single |
| PUT | `/employees/{id}` | Update |
| DELETE | `/employees/{id}` | Delete |
| PATCH | `/employees/{id}/toggle-status` | Toggle active/inactive |

### Attendance (admin + hr)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/attendance` | List with date/employee/status filter + pagination |
| POST | `/attendance` | Mark single attendance |
| POST | `/attendance/bulk` | Mark multiple employees at once |
| GET | `/attendance/monthly-report` | Monthly summary per employee |

---

## Authentication Flow

1. Client sends `POST /auth/login` with email + password
2. Server validates credentials, checks user status (active/inactive)
3. Returns `{ access_token, token_type: "bearer", expires_in, user }`
4. Client stores token in localStorage
5. All subsequent requests include `Authorization: Bearer <token>` header
6. Token TTL: 60 minutes (configurable via `JWT_TTL` in `.env`)
7. Token can be refreshed via `POST /auth/refresh` before expiry

---

## RBAC (Role-Based Access Control)

Roles: `admin` > `hr` > `employee`

| Feature | admin | hr | employee |
|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ |
| View departments | ✅ | ✅ | ❌ |
| Manage departments (CUD) | ✅ | ❌ | ❌ |
| Manage employees | ✅ | ✅ | ❌ |
| Delete employees | ✅ | ❌ | ❌ |
| Manage attendance | ✅ | ✅ | ❌ |

Enforced via `EnsureRole` middleware registered as `role` alias in `Kernel.php`.

---

## Response Format

All API responses follow this structure:

```json
// Success
{
  "success": true,
  "message": "Operation successful.",
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "Error description.",
  "errors": { "field": ["validation message"] }
}
```

Paginated list responses include:
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 4,
    "per_page": 10,
    "total": 20,
    "from": 1,
    "to": 10
  }
}
```

---

## Environment Variables (.env)

```env
APP_KEY=base64:...          # Laravel app key
DB_HOST=127.0.0.1
DB_PORT=3307                # XAMPP MySQL port
DB_DATABASE=hr_management
DB_USERNAME=root
DB_PASSWORD=
JWT_SECRET=...              # Generate with: php artisan jwt:secret
JWT_TTL=60                  # Token lifetime in minutes
```

---

## Setup Commands

```bash
# Install dependencies
composer install

# Copy env file
cp .env.example .env

# Generate app key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Run migrations + seed all data
php artisan migrate:fresh --seed

# Start development server
php artisan serve
```

---

## Seeded Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@hrms.test | Password123 |
| HR | hr@hrms.test | Password123 |
| Employee | employee@hrms.test | Password123 |
