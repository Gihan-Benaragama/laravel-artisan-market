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
        $shop = \App\Models\Shop::with(['vendor.user', 'products.category', 'reviews.user'])
            ->where('slug', $slugOrId)
            ->orWhere('id', $slugOrId)
            ->firstOrFail();

        // Which of the customer's delivered sub-orders are from this shop's vendor?
        $reviewableSubOrders = collect();
        $existingReviews = collect();

        if (auth()->check()) {
            $reviewableSubOrders = \App\Models\SubOrder::where('vendor_id', $shop->vendor_id)
                ->whereHas('order', fn ($q) => $q->where('user_id', auth()->id()))
                ->with('order')
                ->get();

            $existingReviews = \App\Models\Review::where('user_id', auth()->id())
                ->where('shop_id', $shop->id)
                ->pluck('sub_order_id')
                ->toArray();
        }

        return Inertia::render('Shop/StudioShow', [
            'shop'                 => $shop,
            'products'             => $shop->products,
            'reviewableSubOrders'  => $reviewableSubOrders,
            'existingReviews'      => $existingReviews,
        ]);
    }

    public function vendorShow($vendorId)
    {
        $vendor = \App\Models\Vendor::with(['shop.products.category', 'shop.reviews.user', 'user'])
            ->findOrFail($vendorId);

        if (!$vendor->shop) {
            abort(404, 'Studio not found');
        }

        $shop = $vendor->shop;

        $reviewableSubOrders = collect();
        $existingReviews = collect();

        if (auth()->check()) {
            $reviewableSubOrders = \App\Models\SubOrder::where('vendor_id', $vendor->id)
                ->whereHas('order', fn ($q) => $q->where('user_id', auth()->id()))
                ->with('order')
                ->get();

            $existingReviews = \App\Models\Review::where('user_id', auth()->id())
                ->where('shop_id', $shop->id)
                ->pluck('sub_order_id')
                ->toArray();
        }

        return Inertia::render('Shop/StudioShow', [
            'shop'                => $shop,
            'products'            => $shop->products,
            'reviewableSubOrders' => $reviewableSubOrders,
            'existingReviews'     => $existingReviews,
        ]);
    }
}