<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\SubOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
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
            'user_id' => Auth::id(),
            'product_id' => $validated['product_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return back()->with('success', 'Review submitted.');
    }
}