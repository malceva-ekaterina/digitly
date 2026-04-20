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
        Schema::create('institution_financials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->unique()->constrained('institutions')->onDelete('set null');
            $table->string('bank_account', 20)->nullable();
            $table->string('bank_bik', 9)->nullable();
            $table->string('bank_name')->nullable();
            $table->unsignedBigInteger('accumulated_minor')->default(0);
            $table->timestamp('last_payout_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institution_financials');
    }
};
