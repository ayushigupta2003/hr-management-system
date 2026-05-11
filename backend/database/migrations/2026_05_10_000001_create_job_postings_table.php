<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_postings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->string('type')->default('full_time'); // full_time, part_time, contract, internship
            $table->string('status')->default('open');    // open, closed, on_hold
            $table->date('deadline')->nullable();
            $table->unsignedInteger('vacancies')->default(1);
            $table->timestamps();
        });

        Schema::create('applicants', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('job_posting_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('resume_path')->nullable();
            $table->string('status')->default('applied'); // applied, screening, interview, offered, hired, rejected
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applicants');
        Schema::dropIfExists('job_postings');
    }
};
