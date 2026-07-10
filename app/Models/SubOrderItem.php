<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubOrderItem extends Model
{
    protected $fillable = ['sub_order_id', 'product_id', 'quantity', 'price', 'commission_rate', 'platform_fee', 'vendor_earning'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function subOrder()
    {
        return $this->belongsTo(SubOrder::class);
    }
}