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
        Schema::create('institution_question_bank_access', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained('institutions')->onDelete('cascade');
            $table->foreignId('question_bank_id')->constrained('question_banks')->onDelete('restrict');
            $table->unsignedBigInteger('order_item_id')->nullable();
            $table->timestamp('purchased_at');
            $table->unsignedBigInteger('price_minor')->default(0);
            $table->unique(['institution_id', 'question_bank_id'], 'unique_institution_bank');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institution_question_bank_access');
    }
};
