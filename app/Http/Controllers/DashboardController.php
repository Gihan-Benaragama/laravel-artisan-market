<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user()->load('vendor', 'orders');

        return Inertia::render('Dashboard', [
            'vendor' => $user->vendor,
            'orders' => $user->orders,
        ]);
    }
}