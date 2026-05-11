<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\AttendanceController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\DepartmentController;
use App\Http\Controllers\Api\V1\DocumentController;
use App\Http\Controllers\Api\V1\EmployeeController;
use App\Http\Controllers\Api\V1\PerformanceController;
use App\Http\Controllers\Api\V1\RecruitmentController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {

    // ── Public ────────────────────────────────────────────────────────────────
    Route::prefix('auth')->group(function (): void {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login',    [AuthController::class, 'login']);
    });

    // ── Authenticated ─────────────────────────────────────────────────────────
    Route::middleware('auth:api')->group(function (): void {

        // Auth — all roles
        Route::prefix('auth')->group(function (): void {
            Route::get('me',       [AuthController::class, 'me']);
            Route::post('refresh', [AuthController::class, 'refresh']);
            Route::post('logout',  [AuthController::class, 'logout']);
            Route::put('profile',  [AuthController::class, 'updateProfile']);
            Route::put('password', [AuthController::class, 'changePassword']);
        });

        // Dashboard — all roles
        Route::get('dashboard/stats', DashboardController::class);

        // ── ADMIN only ────────────────────────────────────────────────────────
        Route::middleware('role:admin')->group(function (): void {
            // Departments — full CRUD
            Route::apiResource('departments', DepartmentController::class)
                ->except(['index', 'show']);

            // Employees — delete only admin
            Route::delete('employees/{employee}', [EmployeeController::class, 'destroy']);
        });

        // ── ADMIN + HR ────────────────────────────────────────────────────────
        Route::middleware('role:admin,hr')->group(function (): void {
            // Departments — read
            Route::apiResource('departments', DepartmentController::class)
                ->only(['index', 'show']);

            // Employees — create, read, update, toggle (no delete — admin only above)
            Route::get('employees',                                    [EmployeeController::class, 'index']);
            Route::post('employees',                                   [EmployeeController::class, 'store']);
            Route::get('employees/{employee}',                         [EmployeeController::class, 'show']);
            Route::put('employees/{employee}',                         [EmployeeController::class, 'update']);
            Route::patch('employees/{employee}',                       [EmployeeController::class, 'update']);
            Route::patch('employees/{employee}/toggle-status',         [EmployeeController::class, 'toggleStatus']);

            // Attendance — all employees
            Route::get('attendance/monthly-report',                    [AttendanceController::class, 'monthlyReport']);
            Route::post('attendance/bulk',                             [AttendanceController::class, 'bulkStore']);
            Route::apiResource('attendance', AttendanceController::class)->only(['index', 'store']);

            // Recruitment — full
            Route::get('recruitment/jobs',                             [RecruitmentController::class, 'indexJobs']);
            Route::post('recruitment/jobs',                            [RecruitmentController::class, 'storeJob']);
            Route::put('recruitment/jobs/{job}',                       [RecruitmentController::class, 'updateJob']);
            Route::delete('recruitment/jobs/{job}',                    [RecruitmentController::class, 'destroyJob']);
            Route::get('recruitment/jobs/{job}/applicants',            [RecruitmentController::class, 'indexApplicants']);
            Route::post('recruitment/jobs/{job}/applicants',           [RecruitmentController::class, 'storeApplicant']);
            Route::put('recruitment/jobs/{job}/applicants/{applicant}',[RecruitmentController::class, 'updateApplicant']);
            Route::delete('recruitment/jobs/{job}/applicants/{applicant}', [RecruitmentController::class, 'destroyApplicant']);

            // Performance — full
            Route::get('performance',              [PerformanceController::class, 'index']);
            Route::post('performance',             [PerformanceController::class, 'store']);
            Route::put('performance/{review}',     [PerformanceController::class, 'update']);
            Route::delete('performance/{review}',  [PerformanceController::class, 'destroy']);

            // Documents — full
            Route::get('documents',                        [DocumentController::class, 'index']);
            Route::post('documents',                       [DocumentController::class, 'store']);
            Route::put('documents/{document}',             [DocumentController::class, 'update']);
            Route::delete('documents/{document}',          [DocumentController::class, 'destroy']);
            Route::get('documents/{document}/download',    [DocumentController::class, 'download']);
        });

        // ── EMPLOYEE — own data only ──────────────────────────────────────────
        Route::middleware('role:employee')->group(function (): void {
            // Own attendance
            Route::get('my/attendance',  [AttendanceController::class, 'myAttendance']);

            // Own performance reviews
            Route::get('my/performance', [PerformanceController::class, 'myReviews']);

            // Own documents
            Route::get('my/documents',                          [DocumentController::class, 'myDocuments']);
            Route::get('my/documents/{document}/download',      [DocumentController::class, 'download']);
        });
    });
});
