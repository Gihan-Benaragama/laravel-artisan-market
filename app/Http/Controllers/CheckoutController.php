<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\SubOrder;
use App\Models\SubOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = Auth::user()->cart()->with('items.product.shop')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index');
        }

        return Inertia::render('Checkout/Index', [
            'cart' => $cart,
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'shipping_name' => 'required|string|max:255',
        'shipping_address' => 'required|string|max:500',
        'shipping_city' => 'required|string|max:255',
        'shipping_postal_code' => 'required|string|max:20',
    ]);

    $cart = Auth::user()->cart()->with('items.product.shop')->first();

    if (!$cart || $cart->items->isEmpty()) {
        return redirect()->route('cart.index');
    }

    return DB::transaction(function () use ($cart, $request) {
        $order = Order::create([
            'user_id' => Auth::id(),
            'total' => $cart->items->sum(fn($i) => $i->quantity * $i->product->price),
            'status' => 'pending',
            'shipping_name' => $request->shipping_name,
            'shipping_address' => $request->shipping_address,
            'shipping_city' => $request->shipping_city,
            'shipping_postal_code' => $request->shipping_postal_code,
        ]);

        $cartItemsByVendor = $cart->items->groupBy('product.shop.vendor_id');

        foreach ($cartItemsByVendor as $vendorId => $items) {
            $subOrder = SubOrder::create([
                'order_id' => $order->id,
                'vendor_id' => $vendorId,
                'status' => 'pending',
            ]);

            foreach ($items as $item) {
                $product = $item->product;
                if ($product->stock < $item->quantity) {
                    abort(422, "Insufficient stock for product: {$product->name}");
                }
                $product->decrement('stock', $item->quantity);

                $lineTotal = $item->quantity * $product->price;
                $commissionRate = 15.00; // % — could later be per-vendor
                $platformFee = round($lineTotal * ($commissionRate / 100), 2);
                $vendorEarning = round($lineTotal - $platformFee, 2);

                SubOrderItem::create([
                    'sub_order_id' => $subOrder->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $product->price,
                    'commission_rate' => $commissionRate,
                    'platform_fee' => $platformFee,
                    'vendor_earning' => $vendorEarning,
                ]);
            }
        }

        $cart->items()->delete();

        return redirect()->route('checkout.success', $order->id);
    });
}

    public function success(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load('subOrders.items.product');

        return Inertia::render('Checkout/Success', [
            'order' => $order,
        ]);
    }
}