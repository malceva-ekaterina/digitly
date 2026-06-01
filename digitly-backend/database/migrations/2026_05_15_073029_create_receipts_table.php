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
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
             $table->foreignId('transaction_id')->constrained('payment_transactions')->restrictOnDelete();
            $table->foreignId('invoice_id')->nullable();
            $table->string('number', 100)->nullable()->unique();
            $table->string('status', 50); //pending / issued / failed
            $table->string('fiscal_provider', 50);
            $table->string('external_receipt_id', 255)->nullable();
            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('receipts');
    }
};
