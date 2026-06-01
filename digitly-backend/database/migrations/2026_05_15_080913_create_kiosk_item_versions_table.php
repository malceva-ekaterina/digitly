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
        Schema::create('kiosk_item_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kiosk_item_id')->constrained()->onDelete('cascade');
            $table->integer('version_number')->unsigned();
            $table->text('changelog')->nullable();
            $table->unsignedBigInteger('price_minor');
            $table->string('status', 50)->default('draft');
            $table->foreignId('moderated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('moderated_at')->nullable();
            $table->text('moderation_comment')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('created_at');
            $table->unique(['kiosk_item_id', 'version_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kiosk_item_versions');
    }
};
