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
        Schema::table('payouts', function (Blueprint $table) {
            if (!Schema::hasColumn('payouts', 'vendor_id')) {
                $table->foreignId('vendor_id')->constrained();
            }
            if (!Schema::hasColumn('payouts', 'amount')) {
                $table->decimal('amount', 10, 2);
            }
            if (!Schema::hasColumn('payouts', 'status')) {
                $table->string('status')->default('pending'); // pending, paid
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payouts', function (Blueprint $table) {
            //
        });
    }
};
