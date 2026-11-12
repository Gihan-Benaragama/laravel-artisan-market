<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\SubOrder;
use App\Models\SubOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $vendor = Auth::user()->vendor()->with('shop', 'payouts')->firstOrFail();

        $productCount = $vendor->shop ? $vendor->shop->products()->count() : 0;

        $subOrders = SubOrder::where('vendor_id', $vendor->id)
            ->with(['items.product', 'order.user'])
            ->latest()
            ->get();

        $totalEarnings = SubOrderItem::whereHas('subOrder', fn ($q) => $q->where('vendor_id', $vendor->id))
            ->sum('vendor_earning');

        $alreadyRequested = $vendor->payouts()->sum('amount');
        $availableBalance = $totalEarnings - $alreadyRequested;

        return Inertia::render('Vendor/Dashboard', [
            'shop'             => $vendor->shop,
            'productCount'     => $productCount,
            'subOrders'        => $subOrders,
            'totalEarnings'    => $totalEarnings,
            'availableBalance' => $availableBalance,
            'payouts'          => $vendor->payouts,
        ]);
    }

    public function updateSubOrderStatus(Request $request, SubOrder $subOrder)
    {
        $vendor = Auth::user()->vendor;

        // Security: only the owning vendor may update
        if ($subOrder->vendor_id !== $vendor->id) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $subOrder->update(['status' => $request->status]);

        return back()->with('success', "Order #{$subOrder->order_id} status updated to \"{$request->status}\".");
    }
}