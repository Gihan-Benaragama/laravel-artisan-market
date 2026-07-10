<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use App\Models\SubOrderItem;
use Illuminate\Support\Facades\Auth;

class PayoutController extends Controller
{
    public function store()
    {
        $vendor = Auth::user()->vendor;

        $totalEarned = SubOrderItem::whereHas('subOrder', fn ($q) => $q->where('vendor_id', $vendor->id))
            ->sum('vendor_earning');

        $alreadyRequested = $vendor->payouts()->sum('amount');

        $available = $totalEarned - $alreadyRequested;

        if ($available <= 0) {
            return back()->withErrors(['payout' => 'No available balance to request.']);
        }

        Payout::create([
            'vendor_id' => $vendor->id,
            'amount' => $available,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Payout requested.');
    }
}