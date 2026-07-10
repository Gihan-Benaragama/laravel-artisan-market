<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubOrder extends Model
{
    protected $fillable = ['order_id', 'vendor_id', 'status'];

    public function items()
    {
        return $this->hasMany(SubOrderItem::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}