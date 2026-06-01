<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('participations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('olympiad_id')->constrained()->restrictOnDelete();
            $table->foreignId('access_grant_id')->constrained()->onDelete('cascade');
            $table->string('role', 50); //participant / mentor
            $table->string('status', 50)->default('registered'); //registered / in_progress / completed / disqualified
            $table->string('participant_fullname', 255)->nullable();
            $table->string('participant_institution', 255)->nullable();
            $table->string('participant_grade', 50)->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participations');
    }
};
