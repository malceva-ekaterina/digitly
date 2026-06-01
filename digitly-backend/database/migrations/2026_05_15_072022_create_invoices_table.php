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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('restrict');
            $table->foreignId('shopping_cart_id')->nullable()->constrained()->onDelete('set null');
            $table->string('number', 50)->unique();
            $table->string('currency', 3)->default('RUB');
            $table->unsignedBigInteger('total_minor');
            $table->string('status', 50)->default('pending'); //'pending / paid / canceled / expired
            $table->timestamp('due_at')->nullable();
            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
