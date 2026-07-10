<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsApprovedVendor
{
    public function handle(Request $request, Closure $next): Response
    {
        $vendor = $request->user()?->vendor;

        if (!$vendor || $vendor->status !== 'approved') {
            abort(403, 'You must be an approved vendor to access this page.');
        }

        return $next($request);
    }
}