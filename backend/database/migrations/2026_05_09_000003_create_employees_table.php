<?php

use App\Enums\EmployeeStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->string('employee_code')->unique();
            $table->string('first_name', 80);
            $table->string('last_name', 80);
            $table->string('email')->unique();
            $table->string('phone', 30)->nullable();
            $table->string('designation', 120);
            $table->date('joining_date')->nullable();
            $table->decimal('salary', 12, 2)->nullable();
            $table->text('address')->nullable();
            $table->string('image_path')->nullable();
            $table->string('status')->default(EmployeeStatus::Active->value);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
