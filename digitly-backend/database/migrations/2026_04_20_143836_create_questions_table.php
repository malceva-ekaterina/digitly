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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->nullable()->constrained('institutions')->onDelete('set null');
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('restrict');
            $table->text('prompt');
            $table->string('type', 50);
            $table->decimal('weight', 5, 2)->default(1.00);
            $table->json('metadata');
            $table->tinyInteger('random_options');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
