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
        Schema::create('award_document_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name', 255);
            $table->string('doc_type', 50); //diploma / certificate / gratitude_mentor / gratitude_org / protocol
            $table->foreignId('background_id')->nullable()->constrained('attachments')->onDelete('set null');
            $table->json('fields_config');
            $table->boolean('is_preset')->default(0);
            $table->string('status', 50)->default('pending'); //pending / approved / rejected
            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('award_document_templates');
    }
};
