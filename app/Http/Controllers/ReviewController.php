<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\SubOrder;
use App\Models\SubOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Store a product review (must have purchased the product).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string|max:1000',
        ]);

        $hasPurchased = SubOrderItem::where('product_id', $validated['product_id'])
            ->whereHas('subOrder.order', fn ($q) => $q->where('user_id', Auth::id()))
            ->exists();

        if (!$hasPurchased) {
            return back()->withErrors(['review' => 'You can only review products you have purchased.']);
        }

        $alreadyReviewed = Review::where('user_id', Auth::id())
            ->where('product_id', $validated['product_id'])
            ->exists();

        if ($alreadyReviewed) {
            return back()->withErrors(['review' => 'You have already reviewed this product.']);
        }

        Review::create([
            'user_id'    => Auth::id(),
            'product_id' => $validated['product_id'],
            'rating'     => $validated['rating'],
            'comment'    => $validated['comment'],
        ]);

        return back()->with('success', 'Review submitted.');
    }

    /**
     * Store a seller/shop review (must have a delivered sub-order from that shop).
     */
    public function storeShopReview(Request $request)
    {
        $validated = $request->validate([
            'shop_id'      => 'required|exists:shops,id',
            'sub_order_id' => 'required|exists:sub_orders,id',
            'rating'       => 'required|integer|min:1|max:5',
            'comment'      => 'nullable|string|max:1000',
        ]);

        // Verify the sub-order belongs to this user and is from this shop
        $subOrder = SubOrder::where('id', $validated['sub_order_id'])
            ->whereHas('order', fn ($q) => $q->where('user_id', Auth::id()))
            ->first();

        if (!$subOrder) {
            return back()->withErrors(['review' => 'Invalid order.']);
        }

        // Check the sub-order is for the given shop (via vendor)
        if ($subOrder->vendor->shop_id !== (int) $validated['shop_id'] &&
            optional($subOrder->vendor->shop)->id !== (int) $validated['shop_id']) {
            return back()->withErrors(['review' => 'Order does not match the studio.']);
        }

        // Prevent duplicate review per sub-order
        $alreadyReviewed = Review::where('user_id', Auth::id())
            ->where('sub_order_id', $validated['sub_order_id'])
            ->exists();

        if ($alreadyReviewed) {
            return back()->withErrors(['review' => 'You have already reviewed this seller for this order.']);
        }

        Review::create([
            'user_id'      => Auth::id(),
            'shop_id'      => $validated['shop_id'],
            'sub_order_id' => $validated['sub_order_id'],
            'rating'       => $validated['rating'],
            'comment'      => $validated['comment'],
        ]);

        return back()->with('success', 'Thank you for rating this studio!');
    }
}
