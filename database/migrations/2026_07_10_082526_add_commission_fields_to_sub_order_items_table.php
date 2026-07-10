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
        Schema::table('sub_order_items', function (Blueprint $table) {
            $table->decimal('commission_rate', 5, 2)->default(15.00); // percentage
            $table->decimal('platform_fee', 10, 2)->default(0);
            $table->decimal('vendor_earning', 10, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sub_order_items', function (Blueprint $table) {
            //
        });
    }
};
