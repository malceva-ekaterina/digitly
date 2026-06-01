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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->restrictOnDelete();
            $table->string('product_type', 50);
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('version_id')->nullable();
            $table->string('name', 255);
            $table->integer('quantity')->unsigned()->default(1);
            $table->unsignedBigInteger('unit_price_minor');
            $table->unsignedBigInteger('gateway_fee_minor');
            $table->unsignedBigInteger('platform_fee_minor')->default(0);
            $table->unsignedBigInteger('institution_earn_minor')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
