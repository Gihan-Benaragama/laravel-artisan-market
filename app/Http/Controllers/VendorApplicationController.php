<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Support\Facades\Auth;

class VendorApplicationController extends Controller
{
    public function store()
    {
        Vendor::firstOrCreate(
            ['user_id' => Auth::id()],
            ['status' => 'pending']
        );

        return back()->with('success', 'Application submitted.');
    }
}