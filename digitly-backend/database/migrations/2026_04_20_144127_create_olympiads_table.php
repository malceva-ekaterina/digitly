<?php

use App\Models\Subject;
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
        Schema::create('olympiads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained('institutions')->onDelete('restrict');
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict');
            $table->string('title');
            $table->text('description');
            $table->string('type', 50);
            $table->unsignedBigInteger('price_minor')->default(0);
            $table->string('currency', 3)->default('RUB');
            $table->unsignedInteger('time_limit_minutes')->nullable();
            $table->string('display_mode', 50)->default('one');
            $table->tinyInteger('random_questions')->default(0);
            $table->string('tiebreak_rule', 50)->default('same_place');
            $table->tinyInteger('show_public_rating')->default(1);
            $table->timestamp('registration_start_at')->nullable();
            $table->timestamp('registration_end_at')->nullable();
            $table->timestamp('participation_start_at')->nullable();
            $table->timestamp('participation_end_at')->nullable();
            $table->string('status', 50)->default('draft');
            $table->foreignId('moderated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('moderated_at')->nullable();
            $table->timestamp('first_purchase_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('olympiads');
    }
};
