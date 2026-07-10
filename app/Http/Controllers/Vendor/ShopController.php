<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ShopController extends Controller
{
    /**
     * Create the vendor's shop for the first time.
     */
    public function store(Request $request)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            abort(403, 'No vendor account found.');
        }

        // Already has a shop — just redirect
        if ($vendor->shop) {
            return redirect()->route('vendor.dashboard');
        }

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        Shop::create([
            'vendor_id'   => $vendor->id,
            'name'        => $validated['name'],
            'slug'        => Str::slug($validated['name']) . '-' . $vendor->id,
            'description' => $validated['description'] ?? null,
        ]);

        return redirect()->route('vendor.dashboard')->with('success', 'Your studio is live!');
    }
}
