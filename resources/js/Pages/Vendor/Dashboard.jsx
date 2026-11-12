import React, { useState } from "react";
import { Link, useForm, router, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    DollarSign,
    Plus,
    ArrowRight,
    Store,
    TrendingUp,
    Wallet,
    Clock,
    CheckCircle,
    ShoppingBag,
    Settings,
    ChevronDown,
    ChevronUp,
    User,
    MapPin,
    Tag,
    AlertCircle,
    CheckCircle2,
    Truck,
    XCircle,
    RefreshCw,
} from "lucide-react";
import VendorNavbar from "../../Components/VendorNavbar";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F8F6F2",
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#1C1815",
};

const STATUS_CONFIG = {
    pending: {
        label: "Pending",
        bg: "bg-amber-100",
        text: "text-amber-800",
        icon: Clock,
    },
    processing: {
        label: "Processing",
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: RefreshCw,
    },
    shipped: {
        label: "Shipped",
        bg: "bg-purple-100",
        text: "text-purple-800",
        icon: Truck,
    },
    delivered: {
        label: "Delivered",
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        icon: CheckCircle2,
    },
    cancelled: {
        label: "Cancelled",
        bg: "bg-red-100",
        text: "text-red-700",
        icon: XCircle,
    },
};

const STATUS_ORDER = ["pending", "processing", "shipped", "delivered", "cancelled"];

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = cfg.icon;
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}
        >
            <Icon size={12} />
            {cfg.label}
        </span>
    );
}

function FlashBanner() {
    const { flash } = usePage().props;
    if (!flash?.success) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-5 py-3.5 rounded-xl shadow-sm"
        >
            <CheckCircle size={16} className="shrink-0" />
            {flash.success}
        </motion.div>
    );
}

/** Shown when an approved vendor hasn't created their shop yet */
function SetupShopCard() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/vendor/shop");
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#F2EAE0]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-2xl border border-stone-200 shadow-xl p-8"
            >
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="bg-amber-100 p-3.5 rounded-full text-amber-800 mb-4">
                        <Store size={32} />
                    </div>
                    <h2 className="font-serif text-2xl font-normal text-stone-900">
                        Set up your studio
                    </h2>
                    <p className="text-sm text-stone-500 font-light mt-2 max-w-sm">
                        Before you can list products, give your creative studio a name and details so customers can find you.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                            Studio name
                        </label>
                        <input
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="e.g. Earthen & Co."
                            className="block w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all font-sans text-sm"
                            required
                        />
                        {errors.name && (
                            <p className="text-xs text-red-600 mt-1.5">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                            Short description <span className="text-stone-400 font-light">(optional)</span>
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            placeholder="Tell customers what you make..."
                            rows={4}
                            className="block w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all resize-none font-sans text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center py-3 bg-stone-900 hover:bg-stone-850 text-white font-medium text-sm rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50"
                    >
                        {processing ? "Creating studio..." : "Create my studio"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

/** Single expandable order card with status control */
function OrderCard({ subOrder }) {
    const [expanded, setExpanded] = useState(false);
    const [updating, setUpdating] = useState(false);

    const order = subOrder.order || {};
    const customer = order.user || {};

    const subTotal = (subOrder.items || []).reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
    );

    const handleStatusChange = (newStatus) => {
        if (newStatus === subOrder.status) return;
        setUpdating(true);
        router.patch(
            `/vendor/sub-orders/${subOrder.id}/status`,
            { status: newStatus },
            {
                preserveScroll: true,
                onFinish: () => setUpdating(false),
            }
        );
    };

    return (
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Card Header — always visible */}
            <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 cursor-pointer hover:bg-stone-50/70 transition-colors"
                onClick={() => setExpanded((prev) => !prev)}
            >
                <div className="flex items-center gap-4">
                    <div className="bg-amber-50 p-2.5 rounded-xl text-amber-800 shrink-0">
                        <ShoppingBag size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-stone-900">
                            Order #{order.id ?? subOrder.order_id}
                        </p>
                        <p className="text-xs text-stone-400 font-light mt-0.5">
                            {customer.name || "Customer"} · {new Date(subOrder.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <StatusBadge status={subOrder.status} />
                    <span className="text-sm font-semibold text-stone-900">
                        ${subTotal.toFixed(2)}
                    </span>
                    <span className="text-stone-400">
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                </div>
            </div>

            {/* Expandable Details */}
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        key="details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-stone-100 p-5 space-y-5">
                            {/* Customer & Shipping Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Customer */}
                                <div className="bg-stone-50 rounded-xl p-4 space-y-1.5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
                                        <User size={11} /> Customer
                                    </p>
                                    <p className="text-sm font-semibold text-stone-900">{customer.name || "—"}</p>
                                    <p className="text-xs text-stone-500">{customer.email || "—"}</p>
                                </div>

                                {/* Shipping */}
                                <div className="bg-stone-50 rounded-xl p-4 space-y-1.5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
                                        <MapPin size={11} /> Shipping Address
                                    </p>
                                    <p className="text-sm font-semibold text-stone-900">
                                        {order.shipping_name || customer.name || "—"}
                                    </p>
                                    <p className="text-xs text-stone-500 leading-relaxed">
                                        {[
                                            order.shipping_address,
                                            order.shipping_city,
                                            order.shipping_postal_code,
                                            order.shipping_country,
                                        ]
                                            .filter(Boolean)
                                            .join(", ") || "No address on file"}
                                    </p>
                                </div>
                            </div>

                            {/* Line Items */}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1.5 mb-3">
                                    <Tag size={11} /> Items Ordered
                                </p>
                                <div className="space-y-2">
                                    {(subOrder.items || []).map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                {item.product?.image ? (
                                                    <img
                                                        src={`/storage/${item.product.image}`}
                                                        alt={item.product?.name}
                                                        className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                                                        onError={(e) => { e.target.style.display = "none"; }}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400">
                                                        <Package size={16} />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm text-stone-800 font-medium">
                                                        {item.product?.name || "Product"}
                                                    </p>
                                                    <p className="text-xs text-stone-400">
                                                        Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-stone-900">
                                                ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-stone-200">
                                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                        Sub-total
                                    </span>
                                    <span className="text-base font-bold text-stone-900">
                                        ${subTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Status Update */}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
                                    Update Order Status
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {STATUS_ORDER.map((s) => {
                                        const cfg = STATUS_CONFIG[s];
                                        const isActive = subOrder.status === s;
                                        return (
                                            <button
                                                key={s}
                                                disabled={updating || isActive}
                                                onClick={() => handleStatusChange(s)}
                                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                                                    isActive
                                                        ? `${cfg.bg} ${cfg.text} border-transparent ring-2 ring-offset-1 ring-current`
                                                        : "bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-800"
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {React.createElement(cfg.icon, { size: 11 })}
                                                {cfg.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                {updating && (
                                    <p className="text-xs text-stone-400 mt-2 animate-pulse">Updating status…</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function VendorDashboard({ shop, productCount, subOrders, totalEarnings, availableBalance = 0, payouts = [] }) {
    const requestPayout = () => {
        if (availableBalance <= 0) return;
        if (confirm(`Request payout of $${Number(availableBalance).toFixed(2)}?`)) {
            router.post("/vendor/payouts", {}, { preserveScroll: true });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", damping: 25 } },
    };

    return (
        <div className="min-h-screen bg-[#F2EAE0] text-stone-800 font-sans selection:bg-amber-100 selection:text-amber-900">
            {/* NAV */}
            <VendorNavbar />

            {/* If no shop yet — prompt vendor to create one */}
            {!shop ? (
                <SetupShopCard />
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-10"
                >
                    {/* HEADER */}
                    <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-200 pb-8">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                                Vendor Portal
                            </span>
                            <h1 className="font-serif text-3xl lg:text-4xl font-normal text-stone-900 mt-1">
                                {shop?.name}
                            </h1>
                            {shop?.description && (
                                <p className="text-sm text-stone-500 font-light mt-1.5 max-w-2xl">{shop.description}</p>
                            )}
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link
                                href="/vendor/shop/edit"
                                className="inline-flex items-center space-x-2 py-3 px-5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium text-sm rounded-xl shadow-sm transition-all cursor-pointer"
                            >
                                <Settings size={16} />
                                <span>Shop Settings</span>
                            </Link>
                            <Link
                                href="/vendor/products/create"
                                className="inline-flex items-center space-x-2 py-3 px-5 bg-stone-900 hover:bg-stone-850 active:bg-stone-950 text-white font-medium text-sm rounded-xl shadow-md transition-all cursor-pointer"
                            >
                                <Plus size={16} />
                                <span>Add Product</span>
                            </Link>
                        </div>
                    </motion.div>

                    {/* FLASH BANNER */}
                    <motion.div variants={itemVariants}>
                        <FlashBanner />
                    </motion.div>

                    {/* STATS */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Listed Products */}
                        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex items-start space-x-4">
                            <div className="bg-amber-50 p-3 rounded-xl text-amber-800">
                                <Package size={22} />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-stone-900">{productCount}</p>
                                <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mt-1">Products Listed</p>
                            </div>
                        </div>

                        {/* Total Earnings */}
                        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex items-start space-x-4">
                            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-800">
                                <TrendingUp size={22} />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-stone-900">${Number(totalEarnings ?? 0).toFixed(2)}</p>
                                <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mt-1">Total Earnings</p>
                            </div>
                        </div>

                        {/* Available Balance */}
                        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                                <div className="bg-amber-100 p-3 rounded-xl text-amber-900">
                                    <Wallet size={22} />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold text-stone-900">${Number(availableBalance ?? 0).toFixed(2)}</p>
                                    <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mt-1">Available Balance</p>
                                </div>
                            </div>
                            {availableBalance > 0 && (
                                <button
                                    onClick={requestPayout}
                                    className="py-1.5 px-3.5 bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer self-center"
                                >
                                    Withdraw
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* MAIN COLUMNS */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* ORDERS PANEL (LEFT 2/3) */}
                        <div className="lg:col-span-2 space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-serif text-2xl font-normal text-stone-900">Customer Orders</h2>
                                    <p className="text-xs text-stone-400 font-light mt-0.5">
                                        {subOrders?.length || 0} order{subOrders?.length !== 1 && "s"} · click to expand details
                                    </p>
                                </div>
                                <Link
                                    href="/vendor/products"
                                    className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-amber-850 hover:text-amber-950 transition-colors"
                                >
                                    <span>Manage Products</span>
                                    <ArrowRight size={13} />
                                </Link>
                            </div>

                            {(!subOrders || subOrders.length === 0) ? (
                                <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center shadow-sm">
                                    <ShoppingBag size={42} className="mx-auto text-stone-300 mb-3" />
                                    <p className="text-sm font-medium text-stone-600">No orders yet</p>
                                    <p className="text-xs text-stone-400 font-light mt-1">
                                        Orders will appear here once a customer purchases from your studio.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {subOrders.map((so) => (
                                        <OrderCard key={so.id} subOrder={so} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* PAYOUT HISTORY (RIGHT 1/3) */}
                        <div className="space-y-6">
                            <h2 className="font-serif text-2xl font-normal text-stone-900">Payouts</h2>

                            {payouts.length === 0 ? (
                                <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center shadow-sm">
                                    <Clock size={36} className="mx-auto text-stone-300 mb-3" />
                                    <p className="text-sm font-medium text-stone-600">No payout history</p>
                                    <p className="text-xs text-stone-400 font-light mt-1">Earnings payouts log here.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {payouts.map((p) => (
                                        <div
                                            key={p.id}
                                            className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex items-center justify-between"
                                        >
                                            <div className="flex items-center space-x-3.5">
                                                <div className="bg-stone-50 p-2.5 rounded-xl text-stone-500">
                                                    <CheckCircle size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-stone-900">${Number(p.amount).toFixed(2)}</p>
                                                    <p className="text-xs text-stone-400 font-light mt-0.5">
                                                        {new Date(p.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    p.status === "pending"
                                                        ? "bg-amber-100 text-amber-850"
                                                        : "bg-emerald-100 text-emerald-800"
                                                }`}
                                            >
                                                {p.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
