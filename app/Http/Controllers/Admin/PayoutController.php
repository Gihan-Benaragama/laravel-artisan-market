<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use Inertia\Inertia;

class PayoutController extends Controller
{
    public function index()
    {
        $payouts = Payout::with('vendor.shop', 'vendor.user')->latest()->get();

        return Inertia::render('Admin/Payouts', [
            'payouts' => $payouts,
        ]);
    }

    public function update(Payout $payout)
    {
        $payout->update(['status' => 'paid']);

        return back()->with('success', 'Payout marked as paid.');
    }
}