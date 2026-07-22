import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Store, Sparkles, ChevronLeft, Eye, ShieldCheck, MapPin, Package } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../../Components/Navbar";

export default function StudioShow({ shop, products = [] }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 25, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F5F0] text-[#12100E] font-sans pb-24">
            <Head title={`${shop.name} — Artisan Studio`} />
            <Navbar />

            {/* STUDIO HERO BANNER */}
            <div className="relative w-full h-80 bg-[#12100E] text-white overflow-hidden">
                {shop.banner ? (
                    <img
                        src={`/storage/${shop.banner}`}
                        alt={shop.name}
                        className="w-full h-full object-cover opacity-60 scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-[#12100E] via-[#C86D51]/30 to-[#D4AF37]/20 flex items-center justify-center opacity-40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-[#12100E]/40 to-transparent" />

                <div className="absolute bottom-6 left-6 md:left-12 flex items-center gap-2">
                    <Link
                        href="/shop"
                        className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider hover:bg-black/60 transition-colors flex items-center gap-1.5 border border-white/10"
                    >
                        <ChevronLeft size={14} /> Back to Catalog
                    </Link>
                </div>
            </div>

            {/* STUDIO HEADER PROFILE CARD */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-16 relative z-10 mb-12">
                <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        {/* Logo */}
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 border-2 border-[#D4AF37]/40 shadow-md flex-shrink-0 flex items-center justify-center">
                            {shop.logo ? (
                                <img
                                    src={`/storage/${shop.logo}`}
                                    alt={shop.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#C86D51] to-[#D4AF37] flex items-center justify-center text-white font-bold text-2xl">
                                    {shop.name.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="font-voice text-3xl font-medium text-[#12100E]">
                                    {shop.name}
                                </h1>
                                <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#9A7A25] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    <ShieldCheck size={13} /> Verified Studio
                                </span>
                            </div>

                            <p className="text-stone-500 text-xs sm:text-sm max-w-2xl font-light leading-relaxed mb-3">
                                {shop.description || "Dedicated to handcrafted perfection, creating one-of-a-kind artisanal pieces."}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-stone-400">
                                {shop.vendor?.user?.name && (
                                    <span className="flex items-center gap-1">
                                        <Sparkles size={13} className="text-[#C86D51]" /> Master Craftsman: {shop.vendor.user.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-center flex items-center gap-3">
                        <Package size={20} className="text-[#C86D51]" />
                        <div className="text-left">
                            <span className="block font-bold text-base text-[#12100E]">
                                {products.length}
                            </span>
                            <span className="text-[11px] text-stone-400 font-light uppercase tracking-wider">
                                Studio Pieces
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* STUDIO PRODUCTS CATALOG GRID */}
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="mb-8">
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C86D51] block mb-1">
                        Studio Catalog
                    </span>
                    <h2 className="font-voice text-2xl text-[#12100E] font-medium">
                        Handcrafted by {shop.name}
                    </h2>
                </div>

                {products.length === 0 ? (
                    <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 shadow-sm text-stone-500 font-light">
                        This studio has not listed any public products yet.
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
                    >
                        {products.map((p) => (
                            <motion.div
                                key={p.id}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
                            >
                                <Link href={`/shop/${p.slug}`}>
                                    <div className="h-72 overflow-hidden relative bg-stone-100 flex items-center justify-center">
                                        {p.image ? (
                                            <img
                                                src={p.image.startsWith('http') ? p.image : `/storage/${p.image}`}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <Sparkles size={32} className="text-stone-300" />
                                        )}

                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <span className="p-3 bg-white/95 text-[#12100E] rounded-full shadow-xl hover:scale-110 transition-transform">
                                                <Eye size={18} />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[11px] font-bold text-[#C86D51] uppercase tracking-wider">
                                                {p.category?.name || "Handcrafted"}
                                            </span>
                                            <span className="text-base font-bold text-[#12100E]">
                                                ${Number(p.price).toFixed(2)}
                                            </span>
                                        </div>

                                        <h3 className="font-voice text-lg text-[#12100E] font-medium group-hover:text-[#C86D51] transition-colors truncate">
                                            {p.name}
                                        </h3>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
