import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Search, SlidersHorizontal, Eye, Sparkles, Filter } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../../Components/Navbar";

export default function ShopIndex({ products, categories, filters }) {
    const [search, setSearch] = useState(filters?.search || "");

    const applyFilter = (params) => {
        router.get("/shop", { ...filters, ...params }, { preserveState: true, replace: true });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilter({ search });
    };

    const productList = products?.data ?? [];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.05 }
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
        <div className="min-h-screen bg-[#F8F5F0] text-[#12100E] font-sans">
            <Navbar />

            {/* HEADER SECTION */}
            <div className="relative bg-[#12100E] text-white py-16 px-6 md:px-12 border-b border-white/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#C86D51]/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF37] block mb-3">
                        The Master Catalog
                    </span>
                    <h1 className="font-voice text-4xl sm:text-5xl font-medium mb-8">
                        Explore Handcrafted Pieces
                    </h1>

                    {/* SEARCH INPUT BAR */}
                    <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-xl">
                        <div className="relative w-full flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-3 text-sm focus-within:border-[#D4AF37] transition-all">
                            <Search size={18} className="text-stone-400 mr-3 flex-shrink-0" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.value || e.target.value)}
                                placeholder="Search ceramic vases, woodwork, linen..."
                                className="w-full bg-transparent border-none outline-none text-white placeholder-stone-400 text-sm"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#C86D51] to-[#B25539] text-white font-medium text-sm shadow-md transition-all flex items-center justify-center gap-2"
                        >
                            <Filter size={15} />
                            Filter
                        </motion.button>
                    </form>
                </div>
            </div>

            {/* CATEGORY FILTER PILLS BAR */}
            <div className="bg-white border-b border-stone-200/80 px-6 md:px-12 py-5 sticky top-[73px] z-40 backdrop-blur-lg bg-white/90">
                <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                    <SlidersHorizontal size={16} className="text-[#C86D51] flex-shrink-0 mr-2" />
                    
                    <button
                        onClick={() => applyFilter({ category: null })}
                        className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex-shrink-0 ${
                            !filters?.category
                                ? "bg-[#12100E] text-white shadow-md"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
                        }`}
                    >
                        All Categories
                    </button>

                    {categories?.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => applyFilter({ category: cat.slug })}
                            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex-shrink-0 ${
                                filters?.category === cat.slug
                                    ? "bg-[#C86D51] text-white shadow-md"
                                    : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* PRODUCT CATALOG GRID */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                {productList.length === 0 ? (
                    <div className="p-20 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 font-light shadow-sm">
                        <Sparkles size={40} className="mx-auto mb-4 text-[#C86D51] opacity-60" />
                        <h3 className="font-voice text-xl text-[#12100E] mb-2">No artisan creations found</h3>
                        <p className="text-xs text-stone-400">Try adjusting your search criteria or selecting another category.</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
                    >
                        {productList.map((p) => (
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
                                                {p.shop?.name || "Studio Creation"}
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

                {/* PAGINATION */}
                {products?.links && products.links.length > 3 && (
                    <div className="flex items-center justify-center gap-2 mt-16">
                        {products.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                                    link.active
                                        ? "bg-[#C86D51] text-white shadow-md"
                                        : "bg-white text-stone-700 hover:bg-stone-200 border border-stone-200"
                                } ${!link.url && "opacity-40 cursor-not-allowed"}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
