<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            // Make product_id nullable so a review can be for a shop only
            $table->foreignId('shop_id')->nullable()->after('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sub_order_id')->nullable()->after('shop_id')->constrained('sub_orders')->nullOnDelete();
        });

        // Make product_id nullable for shop-only reviews
        Schema::table('reviews', function (Blueprint $table) {
            $table->foreignId('product_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['shop_id']);
            $table->dropForeign(['sub_order_id']);
            $table->dropColumn(['shop_id', 'sub_order_id']);
            $table->foreignId('product_id')->nullable(false)->change();
        });
    }
};
