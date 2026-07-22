<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('shop.vendor', 'category')
            ->when($request->category, fn($q, $cat) => $q->whereHas('category', fn($q2) => $q2->where('slug', $cat)))
            ->when($request->search, fn($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->latest()
            ->paginate(12);

        $categories = Category::all();

        return Inertia::render('Shop/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search']),
        ]);
    }
    public function show(string $slug)
    {
        $product = Product::with('shop.vendor', 'category', 'reviews.user')
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Product::where('shop_id', $product->shop_id)
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get();

        $canReview = false;
        $alreadyReviewed = false;

        if (auth()->check()) {
            $canReview = \App\Models\SubOrderItem::where('product_id', $product->id)
                ->whereHas('subOrder.order', fn ($q) => $q->where('user_id', auth()->id()))
                ->exists();

            $alreadyReviewed = $product->reviews->contains('user_id', auth()->id());
        }

        return Inertia::render('Shop/Show', [
            'product' => $product,
            'related' => $related,
            'canReview' => $canReview,
            'alreadyReviewed' => $alreadyReviewed,
        ]);
    }

    public function studioShow(string $slugOrId)
    {
        $shop = \App\Models\Shop::with(['vendor.user', 'products.category'])
            ->where('slug', $slugOrId)
            ->orWhere('id', $slugOrId)
            ->firstOrFail();

        return Inertia::render('Shop/StudioShow', [
            'shop' => $shop,
            'products' => $shop->products,
        ]);
    }

    public function vendorShow($vendorId)
    {
        $vendor = \App\Models\Vendor::with(['shop.products.category', 'user'])
            ->findOrFail($vendorId);

        if (!$vendor->shop) {
            abort(404, 'Studio not found');
        }

        return Inertia::render('Shop/StudioShow', [
            'shop' => $vendor->shop,
            'products' => $vendor->shop->products,
        ]);
    }
}