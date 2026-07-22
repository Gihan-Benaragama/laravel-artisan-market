import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Package, Store, Clock, CheckCircle2, ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";

export default function Dashboard({ vendor, orders }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const applyAsVendor = () => {
        router.post("/vendor/apply", {}, { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-[#F8F5F0] text-[#12100E] font-sans pb-24">
            <Navbar />

            {/* WELCOME BANNER */}
            <div className="bg-[#12100E] text-white py-12 px-6 md:px-12 border-b border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF37] block mb-2">
                        Customer & Maker Dashboard
                    </span>
                    <h1 className="font-voice text-3xl sm:text-4xl font-medium">
                        Welcome back, {user?.name}
                    </h1>
                </div>
            </div>

            {/* DASHBOARD GRID */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* VENDOR STATUS CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-[#12100E] text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col justify-between"
                >
                    {!vendor && (
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#C86D51]/20 flex items-center justify-center text-[#C86D51] mb-6">
                                <Store size={24} />
                            </div>
                            <h3 className="font-voice text-2xl font-medium mb-3">Sell Your Handcrafted Work</h3>
                            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-8 font-light">
                                Join Atelier as a verified artisan. List your unique studio items and connect directly with craft enthusiasts worldwide.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={applyAsVendor}
                                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#C86D51] to-[#B25539] text-white font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                            >
                                Become a Vendor <ArrowRight size={15} />
                            </motion.button>
                        </div>
                    )}

                    {vendor && vendor.status === "pending" && (
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-6">
                                <Clock size={24} />
                            </div>
                            <h3 className="font-voice text-2xl font-medium mb-3">Application Under Review</h3>
                            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-light">
                                We are reviewing your studio submission. Verification typically takes 24 to 48 hours.
                            </p>
                        </div>
                    )}

                    {vendor && vendor.status === "approved" && (
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="font-voice text-2xl font-medium mb-3">Your Studio is Verified</h3>
                            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-8 font-light">
                                Manage your product listings, track live orders, and review studio payouts.
                            </p>
                            <Link href="/vendor/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#C86D51] to-[#B25539] text-white font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                                >
                                    Vendor Studio Portal <ArrowRight size={15} />
                                </motion.button>
                            </Link>
                        </div>
                    )}
                </motion.div>

                {/* RECENT ORDERS LIST */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="lg:col-span-2 bg-white rounded-3xl p-8 border border-stone-200 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-voice text-2xl text-[#12100E] font-medium">Your Order History</h2>
                        <span className="text-xs text-stone-400 font-light">
                            {orders?.length || 0} order{orders?.length !== 1 && "s"} total
                        </span>
                    </div>

                    {!orders || orders.length === 0 ? (
                        <div className="py-16 text-center flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                                <Package size={28} />
                            </div>
                            <p className="font-voice text-lg text-stone-800 mb-2">No orders placed yet</p>
                            <p className="text-xs text-stone-400 max-w-sm mb-6 font-light">
                                Discover handcrafted ceramic, textile, and woodwork creations from verified studios.
                            </p>
                            <Link href="/shop">
                                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C86D51] hover:underline">
                                    Browse Shop <ArrowRight size={14} />
                                </span>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {orders.map((order) => (
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    key={order.id}
                                    className="flex items-center justify-between p-5 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-white transition-all shadow-xs"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-xl text-[#C86D51] border border-stone-200">
                                            <ShoppingBag size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-[#12100E]">Order #{order.id}</h4>
                                            <span className="text-xs text-stone-400">
                                                {new Date(order.created_at).toLocaleDateString(undefined, {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            order.status === "pending"
                                                ? "bg-amber-100 text-amber-800"
                                                : "bg-emerald-100 text-emerald-800"
                                        }`}>
                                            {order.status}
                                        </span>
                                        <span className="font-bold text-base text-[#12100E]">
                                            ${Number(order.total).toFixed(2)}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

            </div>
        </div>
    );
}
