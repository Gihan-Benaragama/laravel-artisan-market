<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

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

    /**
     * Show the shop settings edit form.
     */
    public function edit()
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor || !$vendor->shop) {
            return redirect()->route('vendor.dashboard')
                ->with('error', 'Please create your studio first.');
        }

        return Inertia::render('Vendor/ShopSettings', [
            'shop' => $vendor->shop,
        ]);
    }

    /**
     * Update the vendor's shop settings.
     */
    public function update(Request $request)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor || !$vendor->shop) {
            abort(403);
        }

        $shop = $vendor->shop;

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'banner'      => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp,avif,bmp,tiff,heic,heif|max:10240',
            'logo'        => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp,avif,bmp,tiff,heic,heif|max:10240',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . $vendor->id;

        // Handle banner upload
        if ($request->hasFile('banner')) {
            if ($shop->banner) {
                Storage::disk('public')->delete($shop->banner);
            }
            $validated['banner'] = $request->file('banner')->store('shops/banners', 'public');
            if (is_dir(public_path('storage/shops/banners'))) {
                @copy(storage_path('app/public/' . $validated['banner']), public_path('storage/' . $validated['banner']));
            }
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            if ($shop->logo) {
                Storage::disk('public')->delete($shop->logo);
            }
            $validated['logo'] = $request->file('logo')->store('shops/logos', 'public');
            if (!is_dir(public_path('storage/shops/logos'))) {
                @mkdir(public_path('storage/shops/logos'), 0777, true);
            }
            @copy(storage_path('app/public/' . $validated['logo']), public_path('storage/' . $validated['logo']));
        }

        $shop->update($validated);

        return redirect()->route('vendor.shop.edit')
            ->with('success', 'Studio settings saved!');
    }
}
