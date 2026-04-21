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
        Schema::create('olympiad_moderation_log', function (Blueprint $table) {
            $table->id();
            $table->foreignId('olympiad_id')->constrained()->onDelete('cascade');
            $table->foreignId('moderator_id')->constrained('users');
            $table->string('action', 50);
            $table->text('comment')->nullable();
            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('olympiad_moderation_log');
    }
};
