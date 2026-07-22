import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { ArrowRight, Sparkles, ShieldCheck, Heart, Eye, Award } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";

function ThreadDivider() {
    return (
        <div className="w-full flex items-center justify-center py-12">
            <div className="w-full max-w-5xl flex items-center gap-4 px-6">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C86D51]/30 to-[#C86D51]/60" />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 rounded-full border border-[#C86D51]/40 flex items-center justify-center text-[#C86D51]"
                >
                    <Sparkles size={14} />
                </motion.div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#C86D51]/60 via-[#C86D51]/30 to-transparent" />
            </div>
        </div>
    );
}

export default function ArtisanMarketplaceHome({ makers = [], products = [] }) {
    const [selectedCategory, setSelectedCategory] = useState("all");

    const categories = ["all", "Ceramics", "Textiles", "Woodwork", "Glassware"];

    const filteredProducts = selectedCategory === "all"
        ? products
        : products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F5F0] text-[#12100E] font-sans">
            <Head title="Atelier — Independent Artisan Marketplace" />

            {/* NAVIGATION HEADER */}
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#12100E] text-white px-6 md:px-12 py-20">
                {/* Hero Background Image with Gradient Overlay */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center scale-105 transition-transform duration-1000 opacity-40"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1800&auto=format&fit=crop')`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-[#12100E]/70 to-transparent z-0" />

                {/* Hero Content Box */}
                <div className="relative z-10 max-w-4xl text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.2em] mb-6 shadow-xl"
                    >
                        <Award size={14} />
                        100% Studio Direct Artisans
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.2 }}
                        className="font-voice text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.1] mb-6 tracking-tight"
                    >
                        Every object carries the <span className="shimmer-text font-serif-luxury font-bold italic">maker's soul.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.4 }}
                        className="text-base sm:text-lg text-stone-300 max-w-2xl mb-10 leading-relaxed font-light"
                    >
                        An exclusive marketplace for independent craftspeople — pottery, hand-woven textiles, and carved woodwork, shipped directly from artisan studios worldwide.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap items-center justify-center gap-4"
                    >
                        <Link href="/shop">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -5px rgba(200, 109, 81, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-[#C86D51] to-[#B25539] text-white font-medium text-sm rounded-full flex items-center gap-3 shadow-lg transition-all"
                            >
                                Explore All Studios
                                <ArrowRight size={17} />
                            </motion.button>
                        </Link>

                        <div className="flex items-center gap-6 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs text-stone-300">
                            <span className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-[#D4AF37]" /> Authenticity Guaranteed
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            <ThreadDivider />

            {/* FEATURED MAKERS / STUDIOS */}
            <section className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
                    <div>
                        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C86D51] block mb-2">
                            Featured Master Craftsmen
                        </span>
                        <h2 className="font-voice text-3xl sm:text-4xl text-[#12100E] font-medium">
                            Meet the Independent Studios
                        </h2>
                    </div>

                    <Link
                        href="/shop"
                        className="group flex items-center gap-2 text-sm font-semibold text-[#C86D51] hover:text-[#9E452E] transition-colors"
                    >
                        View all studios
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {makers.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-sm text-stone-500 font-light">
                        No studio profiles available at this moment. Check back soon.
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {makers.slice(0, 3).map((m) => (
                            <motion.div
                                key={m.id}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="h-48 overflow-hidden relative bg-stone-100">
                                    {m.shop?.banner ? (
                                        <img
                                            src={m.shop.banner}
                                            alt={m.shop.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#7C8471]/20 to-[#C86D51]/20 flex items-center justify-center text-stone-400">
                                            <Sparkles size={32} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#12100E] tracking-wider uppercase shadow-md">
                                        Verified Studio
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="font-voice text-xl font-medium text-[#12100E] mb-2 group-hover:text-[#C86D51] transition-colors">
                                        {m.shop?.name ?? "Unnamed Studio"}
                                    </h3>
                                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4">
                                        {m.shop?.description || "Dedicated to handcrafted perfection with traditional techniques."}
                                    </p>
                                    <Link
                                        href="/shop"
                                        className="inline-flex items-center text-xs font-semibold text-[#12100E] group-hover:text-[#C86D51] gap-1"
                                    >
                                        Visit Studio <ArrowRight size={13} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </section>

            <ThreadDivider />

            {/* CURATED PRODUCTS GRID */}
            <section className="px-6 md:px-12 py-12 max-w-7xl mx-auto pb-24">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                    <div>
                        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C86D51] block mb-2">
                            Fresh From The Bench
                        </span>
                        <h2 className="font-voice text-3xl sm:text-4xl text-[#12100E] font-medium">
                            Curated Masterpieces
                        </h2>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 text-xs font-medium rounded-full capitalize transition-all duration-300 ${
                                    selectedCategory === cat
                                        ? "bg-[#12100E] text-white shadow-md scale-105"
                                        : "bg-white text-stone-600 hover:bg-stone-200/60 border border-stone-200"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 shadow-sm text-stone-500 font-light">
                        No products available in this category yet.
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
                    >
                        {filteredProducts.map((p) => (
                            <motion.div
                                key={p.id}
                                variants={itemVariants}
                                className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-500"
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
                                            <Sparkles size={36} className="text-stone-300" />
                                        )}

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                            <span className="p-3 bg-white/90 text-[#12100E] rounded-full shadow-lg hover:scale-110 transition-transform">
                                                <Eye size={18} />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[11px] font-semibold text-[#C86D51] uppercase tracking-wider">
                                                {p.shop?.name || "Artisan Studio"}
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
            </section>

            {/* LUXURY FOOTER */}
            <footer className="bg-[#12100E] text-stone-400 py-16 px-6 md:px-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="font-serif-luxury text-2xl font-bold text-white tracking-wider mb-2">
                            ATELIER
                        </span>
                        <p className="text-xs text-stone-500 max-w-sm text-center md:text-left">
                            Supporting independent craftsmen directly. Zero mass manufacturing, 100% studio authenticity.
                        </p>
                    </div>

                    <div className="flex items-center gap-8 text-xs font-medium">
                        <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
                        <Link href="/login" className="hover:text-white transition-colors">Artisan Login</Link>
                        <Link href="/register" className="hover:text-white transition-colors">Become a Seller</Link>
                    </div>

                    <div className="text-xs text-stone-600">
                        &copy; {new Date().getFullYear()} Atelier Artisan Marketplace. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
