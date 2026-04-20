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
        Schema::create('institution_payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained('institutions');
            $table->unsignedBigInteger('amount_minor');
            $table->date('period_from');
            $table->date('period_to');
            $table->string('status', 50)->default('pending');
            $table->foreignId('processed_by')->nullable()->constrained('users');
            $table->timestamp('processed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institution_payouts');
    }
};
