<?php

use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('role')->default(UserRole::Employee->value)->after('password');
            $table->string('status')->default(UserStatus::Active->value)->after('role');
            $table->string('avatar_path')->nullable()->after('status');
            $table->string('phone', 30)->nullable()->after('avatar_path');
            $table->string('job_title', 120)->nullable()->after('phone');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['role', 'status', 'avatar_path', 'phone', 'job_title']);
        });
    }
};
