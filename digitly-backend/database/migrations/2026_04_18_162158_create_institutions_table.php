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
        Schema::create('institutions', function (Blueprint $table) {
            $table->id();
            $table->text('fullname');
            $table->string('shortname');
            $table->string('inn', 12)->unique();
            $table->string('kpp', 9)->nullable();
            $table->string('website_url', 500)->nullable();
            $table->foreignId('legal_address_id')->nullable()->constrained('adr_addresses')->onDelete('set null');
            $table->foreignId('actual_address_id')->nullable()->constrained('adr_addresses')->onDelete('set null');
            $table->string('contact_email')->nullable();
            $table->string('contact_phone', 30)->nullable();
            // $table->foreignId('application_scan')->nullable()->constrained('attachments')->onDelete('set null');
            $table->foreignId('logotype_id')->nullable()->constrained('attachments')->onDelete('set null');
            $table->foreignId('signature_id')->nullable()->constrained('attachments')->onDelete('set null');
            $table->foreignId('seal_id')->nullable()->constrained('attachments')->onDelete('set null');
            $table->foreignId('director_app_id')->nullable()->constrained('attachments')->onDelete('set null');
            $table->string('status', 50)->default('pending');
            $table->foreignId('moderated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('moderated_at')->nullable();
            $table->text('moderation_comment')->nullable();
            $table->boolean('is_requisites_pending')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institutions');
    }
};
