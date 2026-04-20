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
        Schema::create('adr_addresses', function (Blueprint $table) {
            $table->id();
            $table->string('street')->nullable();
            $table->string('building', 20)->nullable();
            $table->string('housing', 20)->nullable();
            $table->string('flat', 20)->nullable();
            $table->string('postal_code', 15)->nullable();
            $table->foreignId('adr_city_id')->constrained('adr_cities')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adr_addresses');
    }
};
