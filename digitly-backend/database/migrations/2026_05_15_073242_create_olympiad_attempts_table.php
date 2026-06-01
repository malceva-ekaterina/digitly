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
        Schema::create('olympiad_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participation_id')->unique()->constrained()->onDelete('cascade');
            $table->foreignId('olympiad_id')->constrained()->restrictOnDelete();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('must_complete_by')->nullable();
            $table->decimal('total_score', 10, 2)->default(0.00);
            $table->decimal('max_score', 10, 2)->default(0.00);
            $table->decimal('percent_score', 5, 2)->default(0.00);
            $table->string('place', 50)->nullable();
            $table->string('status', 50)->default('draft'); //draft / in_progress / submitted / scored
            $table->timestamp('results_published_at')->nullable();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('olympiad_attempts');
    }
};
