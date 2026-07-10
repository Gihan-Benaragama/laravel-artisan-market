<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Vendor;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $makers = Vendor::with('shop')
            ->where('status', 'approved')
            ->take(3)
            ->get();

        $products = Product::with('shop.vendor')
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('Home', [
            'makers' => $makers,
            'products' => $products,
        ]);
    }
}