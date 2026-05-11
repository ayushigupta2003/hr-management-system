# HR Management System

A full-stack HR management application built with **Laravel 10** (backend) and **React 18** (frontend).

---

## Quick Start

### 1. Start MySQL
Open XAMPP Control Panel → Start MySQL (port 3307)

### 2. Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate:fresh --seed
php artisan serve
# Runs on http://localhost:8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5174
```

---

## Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@hrms.test | Password123 |
| HR | hr@hrms.test | Password123 |
| Employee | employee@hrms.test | Password123 |

---

## Features

| Feature | Admin | HR | Employee |
|---|---|---|---|
| Dashboard stats | ✅ | ✅ | ✅ |
| View departments | ✅ | ✅ | ❌ |
| Manage departments | ✅ | ❌ | ❌ |
| Manage employees | ✅ | ✅ | ❌ |
| Delete employees | ✅ | ❌ | ❌ |
| Attendance management | ✅ | ✅ | ❌ |
| Excel export | ✅ | ✅ | ❌ |

---

## Documentation

- **Backend** → [`backend/DOCUMENTATION.md`](backend/DOCUMENTATION.md)
- **Frontend** → [`frontend/DOCUMENTATION.md`](frontend/DOCUMENTATION.md)

---

## Project Structure

```
hr-management-system/
├── backend/          # Laravel 10 REST API
├── frontend/         # React 18 SPA
└── README.md
```
