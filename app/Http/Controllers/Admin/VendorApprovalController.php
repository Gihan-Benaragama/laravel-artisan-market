<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorApprovalController extends Controller
{
    public function index()
    {
        $vendors = Vendor::with('user', 'shop')->latest()->get();

        return Inertia::render('Admin/VendorApprovals', [
            'vendors' => $vendors,
        ]);
    }

    public function update(Request $request, Vendor $vendor)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected,pending',
        ]);

        $vendor->update(['status' => $request->status]);

        return back()->with('success', 'Vendor status updated.');
    }
}