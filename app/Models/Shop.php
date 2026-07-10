<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    use HasFactory;

    protected $fillable = ['vendor_id', 'name', 'slug', 'description', 'logo', 'banner'];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
