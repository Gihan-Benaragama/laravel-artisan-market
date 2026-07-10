<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\SubOrderItem;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $vendor = Auth::user()->vendor()->with('shop', 'payouts')->firstOrFail();

        $productCount = $vendor->shop->products()->count();

        $subOrders = \App\Models\SubOrder::where('vendor_id', $vendor->id)
            ->with('items.product', 'order')
            ->latest()
            ->take(10)
            ->get();

        $totalEarnings = SubOrderItem::whereHas('subOrder', fn ($q) => $q->where('vendor_id', $vendor->id))
            ->sum('vendor_earning');

        $alreadyRequested = $vendor->payouts()->sum('amount');
        $availableBalance = $totalEarnings - $alreadyRequested;

        return Inertia::render('Vendor/Dashboard', [
            'shop' => $vendor->shop,
            'productCount' => $productCount,
            'subOrders' => $subOrders,
            'totalEarnings' => $totalEarnings,
            'availableBalance' => $availableBalance,
            'payouts' => $vendor->payouts,
        ]);
    }
}