<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->is_admin && request()->query('view') !== 'customer') {
            return redirect()->route('admin.dashboard');
        }

        $user->load('vendor', 'orders.subOrders.items.product', 'orders.subOrders.vendor.shop');

        // IDs of sub_orders the customer already reviewed for the shop
        $reviewedSubOrderIds = \App\Models\Review::where('user_id', $user->id)
            ->whereNotNull('shop_id')
            ->pluck('sub_order_id')
            ->toArray();

        return Inertia::render('Dashboard', [
            'vendor'              => $user->vendor,
            'orders'              => $user->orders,
            'reviewedSubOrderIds' => $reviewedSubOrderIds,
        ]);
    }
}