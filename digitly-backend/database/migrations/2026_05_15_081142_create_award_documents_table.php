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
        Schema::create('award_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('olympiad_id')->constrained()->restrictOnDelete();
            $table->foreignId('attempt_id')->nullable()->constrained('olympiad_attempts')->nullOnDelete();
            $table->foreignId('recipient_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('doc_type', 50);
            $table->foreignId('template_id')->nullable()->constrained('award_document_templates')->onDelete('set null');
            $table->string('place', 50)->nullable();
            $table->date('issued_date');
            $table->string('uuid', 36)->unique();
            $table->foreignId('file_id')->nullable()->constrained('attachments')->nullOnDelete();
            $table->timestamp('generated_at')->nullable();
            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('award_documents');
    }
};
