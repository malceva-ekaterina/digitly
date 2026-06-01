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
        Schema::create('cart_item_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_item_id')->constrained()->onDelete('cascade');
            $table->foreignId('recipient_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('recipient_email', 255);
            $table->string('recipient_fullname', 255);
            $table->timestamp('created_at');

            $table->unique(['cart_item_id', 'recipient_email']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_item_recipients');
    }
};
