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
        Schema::create('access_grants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipient_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('recipient_email', 255);
            $table->string('product_type', 50); //olympiad / kiosk_item / question_bank
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('version_id')->nullable();
            $table->foreignId('order_item_id')->constrained()->restrictOnDelete();
            $table->string('status', 50)->default('pending'); //pending / active / expired / revoked
            $table->timestamp('activated_at')->nullable();
            $table->timestamp('expires_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('access_grants');
    }
};
