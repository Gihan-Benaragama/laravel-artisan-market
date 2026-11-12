<?php

use App\Http\Controllers\Admin\VendorApprovalController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\VendorApplicationController;
use App\Http\Controllers\Vendor\DashboardController as VendorDashboardController;
use App\Http\Controllers\Vendor\ProductController as VendorProductController;
use App\Http\Controllers\Vendor\ShopController as VendorShopController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\Vendor\PayoutController as VendorPayoutController;
use App\Http\Controllers\Admin\PayoutController as AdminPayoutController;
use App\Http\Controllers\Auth\GoogleController;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);
    Route::patch('/orders/{order}/status', [AdminDashboardController::class, 'updateOrderStatus'])->name('orders.update');
    Route::patch('/sub-orders/{subOrder}/status', [AdminDashboardController::class, 'updateSubOrderStatus'])->name('suborders.update');
    Route::get('/vendors', [VendorApprovalController::class, 'index'])->name('vendors.index');
    Route::patch('/vendors/{vendor}', [VendorApprovalController::class, 'update'])->name('vendors.update');
    Route::get('/payouts', [AdminPayoutController::class, 'index'])->name('payouts.index');
    Route::patch('/payouts/{payout}', [AdminPayoutController::class, 'update'])->name('payouts.update');
});

Route::middleware('auth')->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/checkout/success/{order}', [CheckoutController::class, 'success'])->name('checkout.success');
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::post('/reviews/shop', [ReviewController::class, 'storeShopReview'])->name('reviews.shop.store');
});

Route::middleware(['auth', 'vendor'])->prefix('vendor')->name('vendor.')->group(function () {
    Route::get('/dashboard', [VendorDashboardController::class, 'index'])->name('dashboard');
    Route::patch('/sub-orders/{subOrder}/status', [VendorDashboardController::class, 'updateSubOrderStatus'])->name('suborders.update');
    Route::post('/shop', [VendorShopController::class, 'store'])->name('shop.store');
    Route::get('/shop/edit', [VendorShopController::class, 'edit'])->name('shop.edit');
    Route::post('/shop/edit', [VendorShopController::class, 'update'])->name('shop.update');
    Route::post('/payouts', [VendorPayoutController::class, 'store'])->name('payouts.store');

    Route::get('/products', [VendorProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [VendorProductController::class, 'create'])->name('products.create');
    Route::post('/products', [VendorProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}/edit', [VendorProductController::class, 'edit'])->name('products.edit');
    Route::patch('/products/{product}', [VendorProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [VendorProductController::class, 'destroy'])->name('products.destroy');
});

Route::middleware('auth')->group(function () {
    Route::post('/vendor/apply', [VendorApplicationController::class, 'store'])->name('vendor.apply');
});

Route::middleware('auth')->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');
});

Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/shop/{slug}', [ShopController::class, 'show'])->name('shop.show');
Route::get('/studios/{shop}', [ShopController::class, 'studioShow'])->name('studios.show');
Route::get('/vendor/{vendor}', [ShopController::class, 'vendorShow'])->name('vendor.show');

// Home
Route::get('/', [HomeController::class, 'index'])->name('home');

// Google OAuth — server-side Socialite redirect flow
Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('auth.google.callback');

// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Profile (Breeze)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Storage Fallback for environments where symlinks are not created
Route::get('/storage/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);
    if (!file_exists($filePath)) {
        abort(404);
    }
    $mime = mime_content_type($filePath) ?: 'application/octet-stream';
    return response(file_get_contents($filePath), 200, [
        'Content-Type' => $mime,
        'Content-Length' => filesize($filePath),
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('path', '.*');

require __DIR__.'/auth.php';