<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Get (or create) the current user's cart.
     */
    private function getOrCreateCart()
    {
        return Cart::firstOrCreate(['user_id' => Auth::id()]);
    }

    public function index()
    {
        $cart = $this->getOrCreateCart();
        $cart->load('items.product.shop');

        return Inertia::render('Cart/Index', [
            'cart' => $cart,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getOrCreateCart();

        $existingItem = $cart->items()->where('product_id', $request->product_id)->first();

        if ($existingItem) {
            $existingItem->increment('quantity', $request->quantity);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return back()->with('success', 'Added to cart.');
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        // security: make sure this cart item belongs to the logged-in user
        if ($cartItem->cart->user_id !== Auth::id()) {
            abort(403);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return back();
    }

    public function destroy(CartItem $cartItem)
    {
        if ($cartItem->cart->user_id !== Auth::id()) {
            abort(403);
        }

        $cartItem->delete();

        return back();
    }
}