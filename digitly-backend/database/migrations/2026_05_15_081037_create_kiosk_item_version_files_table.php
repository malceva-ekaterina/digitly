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
        Schema::create('kiosk_item_version_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kiosk_item_version_id')->constrained()->onDelete('cascade');
            $table->foreignId('attachment_id')->constrained()->restrictOnDelete();
            $table->integer('sort_order')->default(0);
            $table->boolean('allow_download')->default(1);
            $table->integer('introduced_in_version')->unsigned();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kiosk_item_version_files');
    }
};
