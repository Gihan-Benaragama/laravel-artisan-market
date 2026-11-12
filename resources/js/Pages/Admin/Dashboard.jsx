import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUp,
    DollarSign,
    Percent,
    ShoppingBag,
    Store,
    Package,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    ShieldCheck,
    Sparkles,
    Check,
    X,
    Layers,
    Truck,
    Box,
    Users,
    ArrowRight,
    AlertCircle,
    Building2,
    Palette
} from "lucide-react";
import AdminNavbar from "../../Components/AdminNavbar";

const COLORS = {
    bg: "#12100E",
    bgDarker: "#0C0A09",
    bgLight: "#F8F5F0",
    cardBg: "#FFFFFF",
    sienna: "#C86D51",
    siennaDark: "#B25539",
    sage: "#7C8471",
    brass: "#D4AF37",
    brassDark: "#B5932D",
    ink: "#12100E",
    stoneText: "#57534E",
    borderLight: "rgba(18, 16, 14, 0.08)",
};

export default function AdminDashboard({
    stats,
    pendingVendorsList = [],
    pendingPayoutsList = [],
    orders = [],
    shops = [],
    products = [],
    categories = [],
}) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState("orders");
    const [expandedOrders, setExpandedOrders] = useState({});
    const [orderFilter, setOrderFilter] = useState("all");
    const [submittingId, setSubmittingId] = useState(null);

    const toggleOrder = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    const updateVendorStatus = (vendorId, status) => {
        setSubmittingId(vendorId);
        router.patch(
            `/admin/vendors/${vendorId}`,
            { status },
            {
                preserveScroll: true,
                onFinish: () => setSubmittingId(null),
            }
        );
    };

    const updateOrderStatus = (orderId, newStatus) => {
        router.patch(
            `/admin/orders/${orderId}/status`,
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    const updateSubOrderStatus = (subOrderId, newStatus) => {
        router.patch(
            `/admin/sub-orders/${subOrderId}/status`,
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    const markPayoutPaid = (payoutId) => {
        if (confirm("Confirm marking this payout as paid?")) {
            router.patch(`/admin/payouts/${payoutId}`, {}, { preserveScroll: true });
        }
    };

    const filteredOrders = orders.filter((o) => {
        if (orderFilter === "all") return true;
        return o.status === orderFilter;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case "approved":
            case "paid":
            case "delivered":
            case "completed":
                return "bg-emerald-50 text-emerald-800 border-emerald-200";
            case "pending":
                return "bg-amber-50 text-amber-800 border-amber-200";
            case "processing":
            case "shipped":
                return "bg-blue-50 text-blue-800 border-blue-200";
            case "rejected":
            case "cancelled":
                return "bg-rose-50 text-rose-800 border-rose-200";
            default:
                return "bg-stone-50 text-stone-700 border-stone-200";
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F5F0] text-[#12100E] font-sans selection:bg-[#D4AF37]/20 selection:text-[#12100E]">
            <Head title="Admin Dashboard — Atelier Marketplace" />
            <AdminNavbar />

            {/* FLASH NOTIFICATION */}
            <AnimatePresence>
                {flash?.success && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 right-8 z-50 bg-[#12100E] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#D4AF37]/30 flex items-center gap-3 text-sm"
                    >
                        <CheckCircle2 size={18} className="text-[#D4AF37]" />
                        <span>{flash.success}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HERO EXECUTIVE OVERVIEW BANNER */}
            <div className="bg-[#12100E] text-white pt-10 pb-12 px-6 md:px-12 border-b border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#D4AF37]/15 to-[#C86D51]/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#D4AF37]">
                                    Atelier Executive Control Center
                                </span>
                                <span className="text-white/30">•</span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Marketplace Live
                                </span>
                            </div>
                            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
                                Platform Dashboard
                            </h1>
                            <p className="text-stone-400 text-sm font-light mt-2 max-w-2xl leading-relaxed">
                                Complete real-time status of artisan studios, multi-vendor orders, 15% platform commissions, catalog inventory, and artisan payouts.
                            </p>
                        </div>

                        {/* QUICK STAT BADGE PILLS */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
                                <span className="text-[10px] uppercase tracking-widest text-stone-400 block font-medium">
                                    Commission Rate
                                </span>
                                <span className="font-serif text-xl font-medium text-[#D4AF37]">
                                    {stats.commissionRate}%
                                </span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
                                <span className="text-[10px] uppercase tracking-widest text-stone-400 block font-medium">
                                    Platform Revenue
                                </span>
                                <span className="font-serif text-xl font-medium text-emerald-400">
                                    ${Number(stats.platformEarnings).toFixed(2)}
                                </span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
                                <span className="text-[10px] uppercase tracking-widest text-stone-400 block font-medium">
                                    Gross Sales (GMV)
                                </span>
                                <span className="font-serif text-xl font-medium text-white">
                                    ${Number(stats.grossRevenue).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8">

                {/* CRITICAL ACTIONS NEEDED / ALERT BANNERS */}
                {pendingVendorsList.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-6 shadow-sm"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-amber-100 rounded-xl text-amber-800 shrink-0 mt-0.5">
                                    <Clock size={22} />
                                </div>
                                <div>
                                    <h3 className="font-serif text-lg font-medium text-amber-950">
                                        {pendingVendorsList.length} Artisan Application{pendingVendorsList.length > 1 ? "s" : ""} Awaiting Review
                                    </h3>
                                    <p className="text-xs text-amber-850 mt-1 font-light leading-relaxed">
                                        Artisans are ready to publish their creative studios. Approve them to permit catalog listing and sales.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/admin/vendors"
                                    className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm"
                                >
                                    <span>Review Applications</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Inline review cards for pending vendors */}
                        <div className="mt-4 pt-4 border-t border-amber-200/60 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {pendingVendorsList.slice(0, 4).map((v) => (
                                <div
                                    key={v.id}
                                    className="bg-white/90 rounded-xl p-3.5 border border-amber-200/70 flex items-center justify-between gap-3 shadow-xs"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-stone-900">
                                            {v.shop?.name || "(Studio Name Pending)"}
                                        </p>
                                        <p className="text-xs text-stone-500 font-light">
                                            {v.user?.name} • {v.user?.email}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            onClick={() => updateVendorStatus(v.id, "approved")}
                                            disabled={submittingId === v.id}
                                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-all"
                                        >
                                            <Check size={13} /> Approve
                                        </button>
                                        <button
                                            onClick={() => updateVendorStatus(v.id, "rejected")}
                                            disabled={submittingId === v.id}
                                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-all"
                                        >
                                            <X size={13} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* PENDING PAYOUTS ALERT */}
                {pendingPayoutsList.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-800 shrink-0">
                                <DollarSign size={22} />
                            </div>
                            <div>
                                <h3 className="font-serif text-lg font-medium text-emerald-950">
                                    {pendingPayoutsList.length} Payout Request{pendingPayoutsList.length > 1 ? "s" : ""} Pending (${Number(stats.pendingPayoutsAmount).toFixed(2)})
                                </h3>
                                <p className="text-xs text-emerald-850 mt-1 font-light">
                                    Artisans have requested withdrawals of their fulfilled sales earnings.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/admin/payouts"
                            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm shrink-0"
                        >
                            <span>Process Payouts</span>
                            <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                )}

                {/* 6 CORE EXECUTIVE METRIC CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 1. Gross Sales */}
                    <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                                Gross Merchandise Value
                            </span>
                            <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-serif text-3xl font-medium text-stone-900">
                                ${Number(stats.grossRevenue).toFixed(2)}
                            </span>
                        </div>
                        <p className="text-xs text-stone-500 font-light mt-2 flex items-center gap-1.5">
                            <span className="font-medium text-stone-800">{stats.totalOrders} total orders</span> placed across all studios
                        </p>
                    </div>

                    {/* 2. Platform Revenue (15% Commission) */}
                    <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                                Platform Fee Net (15%)
                            </span>
                            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl">
                                <Percent size={20} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-serif text-3xl font-medium text-emerald-700">
                                ${Number(stats.platformEarnings).toFixed(2)}
                            </span>
                        </div>
                        <p className="text-xs text-stone-500 font-light mt-2">
                            Marketplace revenue retained from completed sales
                        </p>
                    </div>

                    {/* 3. Artisan Net Earnings (85%) */}
                    <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                                Artisan Total Earnings
                            </span>
                            <div className="p-2.5 bg-blue-50 text-blue-800 rounded-xl">
                                <DollarSign size={20} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-serif text-3xl font-medium text-stone-900">
                                ${Number(stats.vendorEarnings).toFixed(2)}
                            </span>
                        </div>
                        <p className="text-xs text-stone-500 font-light mt-2">
                            85% share allocated to maker studios
                        </p>
                    </div>

                    {/* 4. Active Studios */}
                    <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                                Creative Studios & Makers
                            </span>
                            <div className="p-2.5 bg-purple-50 text-purple-800 rounded-xl">
                                <Store size={20} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-serif text-3xl font-medium text-stone-900">
                                {stats.totalShops}
                            </span>
                            <span className="text-xs text-stone-500">
                                ({stats.approvedVendors} approved makers)
                            </span>
                        </div>
                        <p className="text-xs text-stone-500 font-light mt-2 flex items-center gap-1.5">
                            {stats.pendingVendors > 0 ? (
                                <span className="text-amber-700 font-medium">{stats.pendingVendors} pending review</span>
                            ) : (
                                <span className="text-emerald-700 font-medium">All applications reviewed</span>
                            )}
                        </p>
                    </div>

                    {/* 5. Listed Handcrafted Goods */}
                    <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                                Catalog Products
                            </span>
                            <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl">
                                <Package size={20} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-serif text-3xl font-medium text-stone-900">
                                {stats.totalProducts}
                            </span>
                            <span className="text-xs text-stone-500">
                                in {categories.length} categories
                            </span>
                        </div>
                        <p className="text-xs text-stone-500 font-light mt-2 flex items-center gap-2">
                            {stats.lowStockProducts > 0 && (
                                <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                                    <AlertTriangle size={12} /> {stats.lowStockProducts} low stock
                                </span>
                            )}
                            {stats.outOfStockProducts > 0 && (
                                <span className="text-rose-700 font-medium">
                                    • {stats.outOfStockProducts} out of stock
                                </span>
                            )}
                            {stats.lowStockProducts === 0 && stats.outOfStockProducts === 0 && (
                                <span className="text-emerald-700 font-medium">Stock levels healthy</span>
                            )}
                        </p>
                    </div>

                    {/* 6. Orders Fulfillment */}
                    <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                                Fulfillment Pipeline
                            </span>
                            <div className="p-2.5 bg-stone-100 text-stone-800 rounded-xl">
                                <ShoppingBag size={20} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-serif text-3xl font-medium text-stone-900">
                                {stats.totalOrders}
                            </span>
                            <span className="text-xs text-stone-500">
                                orders total
                            </span>
                        </div>
                        <p className="text-xs text-stone-500 font-light mt-2">
                            <span className="text-amber-700 font-medium">{stats.pendingOrders} pending</span> • <span className="text-emerald-700 font-medium">{stats.completedOrders} completed</span>
                        </p>
                    </div>
                </div>

                {/* TABS NAVIGATION */}
                <div className="border-b border-stone-200">
                    <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`pb-4 text-sm font-medium tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === "orders"
                                    ? "border-[#D4AF37] text-stone-900 font-semibold"
                                    : "border-transparent text-stone-500 hover:text-stone-800"
                            }`}
                        >
                            <ShoppingBag size={16} />
                            <span>Orders & Fulfillment</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold">
                                {orders.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab("studios")}
                            className={`pb-4 text-sm font-medium tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === "studios"
                                    ? "border-[#D4AF37] text-stone-900 font-semibold"
                                    : "border-transparent text-stone-500 hover:text-stone-800"
                            }`}
                        >
                            <Store size={16} />
                            <span>Studios & Artisans</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold">
                                {shops.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab("products")}
                            className={`pb-4 text-sm font-medium tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === "products"
                                    ? "border-[#D4AF37] text-stone-900 font-semibold"
                                    : "border-transparent text-stone-500 hover:text-stone-800"
                            }`}
                        >
                            <Package size={16} />
                            <span>Catalog Inventory</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold">
                                {products.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab("categories")}
                            className={`pb-4 text-sm font-medium tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === "categories"
                                    ? "border-[#D4AF37] text-stone-900 font-semibold"
                                    : "border-transparent text-stone-500 hover:text-stone-800"
                            }`}
                        >
                            <Palette size={16} />
                            <span>Craft Categories</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold">
                                {categories.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab("financials")}
                            className={`pb-4 text-sm font-medium tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === "financials"
                                    ? "border-[#D4AF37] text-stone-900 font-semibold"
                                    : "border-transparent text-stone-500 hover:text-stone-800"
                            }`}
                        >
                            <DollarSign size={16} />
                            <span>Financials & Payouts</span>
                        </button>
                    </div>
                </div>

                {/* TAB 1: ORDERS & FULFILLMENT */}
                {activeTab === "orders" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="font-serif text-2xl font-normal text-stone-900">
                                    Marketplace Orders
                                </h2>
                                <p className="text-xs text-stone-500 font-light mt-1">
                                    Each customer order is split automatically into sub-orders per artisan studio for independent fulfillment.
                                </p>
                            </div>

                            {/* Status Filter Buttons */}
                            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200">
                                {["all", "pending", "processing", "completed", "cancelled"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setOrderFilter(f)}
                                        className={`px-3 py-1.5 text-xs rounded-lg font-medium capitalize transition-all cursor-pointer ${
                                            orderFilter === f
                                                ? "bg-stone-900 text-white shadow-xs"
                                                : "text-stone-600 hover:text-stone-900"
                                        }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
                                <ShoppingBag size={40} className="mx-auto text-stone-300 mb-3" />
                                <h3 className="font-serif text-lg text-stone-700">No orders match filter</h3>
                                <p className="text-xs text-stone-400 mt-1">Change or reset filter to see more orders.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => {
                                    const isExpanded = !!expandedOrders[order.id];
                                    const allItemsCount = order.sub_orders?.reduce(
                                        (sum, so) => sum + (so.items?.length || 0),
                                        0
                                    ) || 0;

                                    return (
                                        <div
                                            key={order.id}
                                            className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden transition-all hover:border-stone-300"
                                        >
                                            {/* ORDER SUMMARY ROW */}
                                            <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-[#12100E] text-white rounded-xl">
                                                        <Box size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-serif text-lg font-semibold text-stone-900">
                                                                Order #{order.id}
                                                            </span>
                                                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-stone-500 font-light mt-1">
                                                            Placed by <span className="font-medium text-stone-800">{order.user?.name || order.shipping_name || "Customer"}</span> ({order.user?.email || "Direct checkout"}) on {new Date(order.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                                        </p>
                                                        {order.shipping_address && (
                                                            <p className="text-[11px] text-stone-400 mt-0.5">
                                                                Ship to: {order.shipping_name}, {order.shipping_address}, {order.shipping_city} {order.shipping_postal_code}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 lg:gap-8 justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-stone-100">
                                                    <div className="text-left lg:text-right">
                                                        <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                                                            Order Total
                                                        </span>
                                                        <span className="font-serif text-xl font-semibold text-stone-900">
                                                            ${Number(order.total).toFixed(2)}
                                                        </span>
                                                        <span className="text-[11px] text-emerald-700 block font-medium">
                                                            Fee: ${(Number(order.total) * 0.15).toFixed(2)}
                                                        </span>
                                                    </div>

                                                    {/* Quick Status Dropdown */}
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                            className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>

                                                        <button
                                                            onClick={() => toggleOrder(order.id)}
                                                            className="p-2 hover:bg-stone-100 rounded-lg text-stone-600 transition-colors cursor-pointer"
                                                            title={isExpanded ? "Collapse Details" : "View Studio Sub-orders"}
                                                        >
                                                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* EXPANDABLE SUB-ORDERS SECTION */}
                                            {isExpanded && (
                                                <div className="bg-stone-50/70 border-t border-stone-100 p-5 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                                                            Studio Fulfillment Breakdown ({order.sub_orders?.length || 0} Studios)
                                                        </h4>
                                                        <span className="text-xs text-stone-400 font-light">
                                                            {allItemsCount} total items in this shipment
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {order.sub_orders?.map((so) => (
                                                            <div
                                                                key={so.id}
                                                                className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 shadow-xs"
                                                            >
                                                                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                                                                    <div className="flex items-center gap-2">
                                                                        <Store size={15} className="text-[#C86D51]" />
                                                                        <span className="font-semibold text-xs text-stone-900">
                                                                            {so.vendor?.shop?.name || "Independent Artisan"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <select
                                                                            value={so.status}
                                                                            onChange={(e) => updateSubOrderStatus(so.id, e.target.value)}
                                                                            className="text-[10px] font-semibold uppercase tracking-wider bg-stone-50 border border-stone-200 rounded px-2 py-0.5 text-stone-700 cursor-pointer"
                                                                        >
                                                                            <option value="pending">Pending</option>
                                                                            <option value="shipped">Shipped</option>
                                                                            <option value="delivered">Delivered</option>
                                                                            <option value="cancelled">Cancelled</option>
                                                                        </select>
                                                                    </div>
                                                                </div>

                                                                {/* Line items for this vendor */}
                                                                <div className="space-y-2">
                                                                    {so.items?.map((item) => (
                                                                        <div
                                                                            key={item.id}
                                                                            className="flex items-center justify-between text-xs"
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="font-semibold text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded">
                                                                                    {item.quantity}×
                                                                                </span>
                                                                                <span className="text-stone-700 font-light truncate max-w-[200px]">
                                                                                    {item.product?.name || "Handmade Item"}
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <span className="font-medium text-stone-900">
                                                                                    ${Number(item.price * item.quantity).toFixed(2)}
                                                                                </span>
                                                                                <span className="text-[10px] text-stone-400 block font-light">
                                                                                    Fee: ${Number(item.platform_fee || 0).toFixed(2)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* TAB 2: STUDIOS & ARTISANS */}
                {activeTab === "studios" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="font-serif text-2xl font-normal text-stone-900">
                                    Artisan Studios & Makers
                                </h2>
                                <p className="text-xs text-stone-500 font-light mt-1">
                                    All registered creative studios on Atelier, their verification status, catalog volume, and maker contacts.
                                </p>
                            </div>
                            <Link
                                href="/admin/vendors"
                                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center gap-1.5"
                            >
                                <span>Manage Vendor Approvals</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {shops.map((shop) => (
                                <div
                                    key={shop.id}
                                    className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(shop.vendor?.status)}`}>
                                                {shop.vendor?.status || "active"}
                                            </span>
                                            <span className="text-xs text-stone-400 font-light">
                                                Studio #{shop.id}
                                            </span>
                                        </div>

                                        <h3 className="font-serif text-xl font-medium text-stone-900 mb-1">
                                            {shop.name}
                                        </h3>
                                        <p className="text-xs text-stone-500 font-light line-clamp-2 mb-4">
                                            {shop.description || "Curated artisan studio creating handcrafted wares."}
                                        </p>

                                        <div className="p-3 bg-stone-50 rounded-xl space-y-1 mb-4 text-xs font-light text-stone-600">
                                            <p className="flex justify-between">
                                                <span className="text-stone-400">Maker:</span>
                                                <span className="font-medium text-stone-800">{shop.vendor?.user?.name}</span>
                                            </p>
                                            <p className="flex justify-between truncate">
                                                <span className="text-stone-400">Email:</span>
                                                <span className="font-medium text-stone-800">{shop.vendor?.user?.email}</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span className="text-stone-400">Products Listed:</span>
                                                <span className="font-semibold text-[#C86D51]">{shop.products_count ?? 0}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                                        <Link
                                            href={`/studios/${shop.id}`}
                                            target="_blank"
                                            className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium text-center inline-flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <span>View Public Studio</span>
                                            <ExternalLink size={12} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* TAB 3: CATALOG INVENTORY */}
                {activeTab === "products" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="font-serif text-2xl font-normal text-stone-900">
                                    Catalog Inventory & Stock Supply
                                </h2>
                                <p className="text-xs text-stone-500 font-light mt-1">
                                    Monitoring inventory stock across studios to prevent overselling and track top artisan creations.
                                </p>
                            </div>
                            <Link
                                href="/shop"
                                target="_blank"
                                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center gap-1.5"
                            >
                                <span>Browse Live Marketplace</span>
                                <ExternalLink size={14} />
                            </Link>
                        </div>

                        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-stone-100 bg-stone-50/50 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                                            <th className="py-3.5 px-6">Product</th>
                                            <th className="py-3.5 px-6">Studio</th>
                                            <th className="py-3.5 px-6">Category</th>
                                            <th className="py-3.5 px-6">Price</th>
                                            <th className="py-3.5 px-6">Stock Status</th>
                                            <th className="py-3.5 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100 text-xs">
                                        {products.map((p) => {
                                            const isLowStock = p.stock > 0 && p.stock <= 5;
                                            const isOutOfStock = p.stock <= 0;

                                            return (
                                                <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                                                    <td className="py-4 px-6 font-medium text-stone-900">
                                                        <div className="flex items-center gap-3">
                                                            {p.image ? (
                                                                <img
                                                                    src={`/storage/${p.image}`}
                                                                    alt={p.name}
                                                                    className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display = 'none';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400">
                                                                    <Package size={18} />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="font-semibold text-stone-900 text-sm">{p.name}</p>
                                                                <p className="text-[11px] text-stone-400 font-light">ID #{p.id} • {p.slug}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-stone-700 font-medium">
                                                        {p.shop?.name || "Independent"}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-medium text-[11px]">
                                                            {p.category?.name || "General"}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 font-serif font-semibold text-stone-900 text-sm">
                                                        ${Number(p.price).toFixed(2)}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {isOutOfStock ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                                                                <XCircle size={11} /> Out of stock ({p.stock})
                                                            </span>
                                                        ) : isLowStock ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                                                                <AlertTriangle size={11} /> Low stock ({p.stock})
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                <CheckCircle2 size={11} /> In stock ({p.stock})
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <Link
                                                            href={`/shop/${p.slug}`}
                                                            target="_blank"
                                                            className="text-stone-500 hover:text-stone-900 font-medium inline-flex items-center gap-1 text-xs"
                                                        >
                                                            <span>View</span>
                                                            <ExternalLink size={12} />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* TAB 4: CRAFT CATEGORIES */}
                {activeTab === "categories" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div>
                            <h2 className="font-serif text-2xl font-normal text-stone-900">
                                Craft Categories
                            </h2>
                            <p className="text-xs text-stone-500 font-light mt-1">
                                Atelier marketplace merchandise is organized by specialized artisan medium and technique.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#B5932D]">
                                            <Palette size={22} />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-lg font-medium text-stone-900">
                                                {cat.name}
                                            </h3>
                                            <p className="text-xs text-stone-400 font-light mt-0.5">
                                                Slug: {cat.slug}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="font-serif text-2xl font-semibold text-stone-900 block">
                                            {cat.products_count ?? 0}
                                        </span>
                                        <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                                            Products
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* TAB 5: FINANCIALS & PAYOUTS */}
                {activeTab === "financials" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="font-serif text-2xl font-normal text-stone-900">
                                Financial Performance & Payouts
                            </h2>
                            <p className="text-xs text-stone-500 font-light mt-1">
                                Tracking total merchandise gross volume, 15% platform take-rate, and artisan earnings disbursements.
                            </p>
                        </div>

                        {/* Financial Ledger Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#12100E] text-white rounded-2xl p-6 border border-white/10 shadow-lg">
                                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#D4AF37] block mb-2">
                                    Platform Commission Retained
                                </span>
                                <span className="font-serif text-3xl font-medium text-emerald-400">
                                    ${Number(stats.platformEarnings).toFixed(2)}
                                </span>
                                <p className="text-xs text-stone-400 mt-2 font-light">
                                    15% transaction fee earned across completed sub-orders
                                </p>
                            </div>

                            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
                                <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block mb-2">
                                    Artisan Disbursed / Paid
                                </span>
                                <span className="font-serif text-3xl font-medium text-stone-900">
                                    ${Number(stats.paidPayoutsAmount).toFixed(2)}
                                </span>
                                <p className="text-xs text-stone-400 mt-2 font-light">
                                    Historical earnings paid out to creative studios
                                </p>
                            </div>

                            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
                                <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block mb-2">
                                    Pending Payout Requests
                                </span>
                                <span className="font-serif text-3xl font-medium text-amber-700">
                                    ${Number(stats.pendingPayoutsAmount).toFixed(2)}
                                </span>
                                <p className="text-xs text-stone-400 mt-2 font-light">
                                    {stats.pendingPayoutsCount} withdrawal requests awaiting release
                                </p>
                            </div>
                        </div>

                        {/* Payouts Table / Status */}
                        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-serif text-xl font-medium text-stone-900">
                                    Artisan Withdrawal Requests
                                </h3>
                                <Link
                                    href="/admin/payouts"
                                    className="text-xs font-semibold uppercase tracking-wider text-[#C86D51] hover:underline"
                                >
                                    View Full Payouts Ledger →
                                </Link>
                            </div>

                            {pendingPayoutsList.length === 0 ? (
                                <div className="text-center py-10 text-stone-400">
                                    <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                                    <p className="text-sm font-medium text-stone-700">No pending payout requests</p>
                                    <p className="text-xs text-stone-400 mt-0.5">All vendor balances are currently up to date.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingPayoutsList.map((p) => (
                                        <div
                                            key={p.id}
                                            className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="font-serif text-base font-semibold text-stone-900">
                                                    ${Number(p.amount).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-stone-500">
                                                    Requested by {p.vendor?.shop?.name || p.vendor?.user?.name} on {new Date(p.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => markPayoutPaid(p.id)}
                                                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                                            >
                                                <Check size={14} /> Mark as Paid
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
}

