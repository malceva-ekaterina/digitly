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
        Schema::create('attempt_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('olympiad_attempt_id')->constrained()->onDelete('cascade');
            $table->foreignId('olympiad_question_id')->constrained()->restrictOnDelete();
            $table->json('response_data')->nullable();
            $table->decimal('score', 5, 2)->nullable();
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('reviewer_comment')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('saved_at')->useCurrent()->useCurrentOnUpdate();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attempt_responses');
    }
};
