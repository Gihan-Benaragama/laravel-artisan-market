<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Payout;
use App\Models\Product;
use App\Models\Shop;
use App\Models\SubOrder;
use App\Models\SubOrderItem;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $grossRevenue = (float) Order::where('status', '!=', 'cancelled')->sum('total');
        $platformEarnings = (float) SubOrderItem::sum('platform_fee');
        $vendorEarnings = (float) SubOrderItem::sum('vendor_earning');

        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $completedOrders = Order::where('status', 'completed')->count();

        $totalVendors = Vendor::count();
        $approvedVendors = Vendor::where('status', 'approved')->count();
        $pendingVendors = Vendor::where('status', 'pending')->count();

        $totalShops = Shop::count();
        $totalProducts = Product::count();
        $lowStockProducts = Product::where('stock', '>', 0)->where('stock', '<=', 5)->count();
        $outOfStockProducts = Product::where('stock', '<=', 0)->count();

        $pendingPayoutsCount = Payout::where('status', 'pending')->count();
        $pendingPayoutsAmount = (float) Payout::where('status', 'pending')->sum('amount');
        $paidPayoutsAmount = (float) Payout::where('status', 'paid')->sum('amount');

        $totalUsers = User::count();

        // Pending items needing immediate admin action
        $pendingVendorsList = Vendor::with('user', 'shop')
            ->where('status', 'pending')
            ->latest()
            ->get();

        $pendingPayoutsList = Payout::with('vendor.shop', 'vendor.user')
            ->where('status', 'pending')
            ->latest()
            ->get();

        // Recent Orders with full details
        $orders = Order::with([
            'user',
            'subOrders.vendor.shop',
            'subOrders.items.product',
        ])
            ->latest()
            ->take(15)
            ->get();

        // Artisan Studios overview
        $shops = Shop::with('vendor.user')
            ->withCount('products')
            ->latest()
            ->get();

        // Products with stock alert priority
        $products = Product::with('shop', 'category')
            ->latest()
            ->take(20)
            ->get();

        // Category breakdown
        $categories = Category::withCount('products')->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'grossRevenue' => $grossRevenue,
                'platformEarnings' => $platformEarnings,
                'vendorEarnings' => $vendorEarnings,
                'commissionRate' => 15.0,
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'completedOrders' => $completedOrders,
                'totalVendors' => $totalVendors,
                'approvedVendors' => $approvedVendors,
                'pendingVendors' => $pendingVendors,
                'totalShops' => $totalShops,
                'totalProducts' => $totalProducts,
                'lowStockProducts' => $lowStockProducts,
                'outOfStockProducts' => $outOfStockProducts,
                'totalUsers' => $totalUsers,
                'pendingPayoutsCount' => $pendingPayoutsCount,
                'pendingPayoutsAmount' => $pendingPayoutsAmount,
                'paidPayoutsAmount' => $paidPayoutsAmount,
            ],
            'pendingVendorsList' => $pendingVendorsList,
            'pendingPayoutsList' => $pendingPayoutsList,
            'orders' => $orders,
            'shops' => $shops,
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
        ]);

        $order->update(['status' => $request->status]);

        // If order completed or cancelled, sync pending sub-orders if applicable
        if (in_array($request->status, ['completed', 'cancelled'])) {
            $order->subOrders()->where('status', 'pending')->update([
                'status' => $request->status === 'completed' ? 'delivered' : 'cancelled',
            ]);
        }

        return back()->with('success', "Order #{$order->id} status updated to {$request->status}.");
    }

    public function updateSubOrderStatus(Request $request, SubOrder $subOrder)
    {
        $request->validate([
            'status' => 'required|in:pending,shipped,delivered,cancelled',
        ]);

        $subOrder->update(['status' => $request->status]);

        return back()->with('success', "Sub-order #{$subOrder->id} status updated.");
    }
}

