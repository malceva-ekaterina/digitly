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
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_attempt_id')->constrained()->onDelete('cascade');
            $table->string('transaction_type', 50); //charge / refund
            $table->string('external_tx_id', 255)->nullable();
            $table->unsignedBigInteger('amount_minor');
            $table->string('status', 50); //succeeded / failed
            $table->timestamp('processed_at')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
