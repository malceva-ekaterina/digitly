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
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'name')) { $table->dropColumn('name'); }
            $table->string('fullname', 150)->after('id');
            $table->string('phone_number', 30)->nullable()->unique()->after('email_verified_at');
            $table->timestamp('phone_verified_at')->nullable()->after('phone_number');
            $table->date('birth_date')->nullable();
            $table->string('study_place')->nullable();
            $table->string('study_grade', 50)->nullable();
            $table->foreignId('adr_address_id')->nullable()->constrained('adr_addresses')->onDelete('set null');
            $table->foreignId('avatar_id')->nullable()->constrained('attachments')->onDelete('set null');
            $table->timestamp('accepted_terms_at')->nullable();
            $table->timestamp('accepted_privacy_at')->nullable();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
