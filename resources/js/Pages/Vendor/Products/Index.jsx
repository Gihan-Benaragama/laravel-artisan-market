import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Package, AlertTriangle, Search, ShoppingBag, CheckCircle } from "lucide-react";
import VendorNavbar from "../../../Components/VendorNavbar";

export default function VendorProductsIndex({ products }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const deleteProduct = (id) => {
        if (confirm("Delete this product? This can't be undone.")) {
            setDeletingId(id);
            router.delete(`/vendor/products/${id}`, {
                preserveScroll: true,
                onFinish: () => setDeletingId(null),
            });
        }
    };

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F2EAE0] text-stone-800 font-sans">
            <VendorNavbar />

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-8"
            >
                {/* Flash message */}
                <AnimatePresence>
                    {flash?.success && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center space-x-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-medium"
                        >
                            <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                            <span>{flash.success}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-stone-300/60 pb-8">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                            Your Studio
                        </span>
                        <h1 className="font-serif text-3xl lg:text-4xl font-normal text-stone-900 mt-1">
                            Products
                        </h1>
                        <p className="text-sm text-stone-500 font-light mt-1.5">
                            {products.length} product{products.length !== 1 ? "s" : ""} listed
                        </p>
                    </div>
                    <Link
                        href="/vendor/products/create"
                        className="inline-flex items-center space-x-2 py-3 px-5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-xl shadow-md transition-all cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>Add Product</span>
                    </Link>
                </div>

                {/* Search bar */}
                {products.length > 0 && (
                    <div className="relative max-w-sm">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
                        />
                    </div>
                )}

                {/* Products table */}
                {products.length === 0 ? (
                    <div className="bg-white border border-stone-200 rounded-2xl p-16 text-center shadow-sm">
                        <div className="bg-stone-100 p-4 rounded-full w-fit mx-auto mb-4">
                            <ShoppingBag size={36} className="text-stone-400" />
                        </div>
                        <p className="font-serif text-xl text-stone-800 mb-2">No products yet</p>
                        <p className="text-sm text-stone-400 font-light mb-6">
                            Start building your catalog — add your first handcrafted item.
                        </p>
                        <Link
                            href="/vendor/products/create"
                            className="inline-flex items-center space-x-2 py-2.5 px-5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer shadow-sm"
                        >
                            <Plus size={15} />
                            <span>Add your first product</span>
                        </Link>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center shadow-sm">
                        <p className="text-stone-500 text-sm">No products matching "<span className="font-semibold text-stone-700">{search}</span>"</p>
                    </div>
                ) : (
                    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-[56px_1fr_120px_100px_110px] items-center gap-4 px-6 py-3.5 border-b border-stone-100 bg-stone-50">
                            <div />
                            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Product</p>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Price</p>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Stock</p>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 text-right">Actions</p>
                        </div>

                        {/* Rows */}
                        <AnimatePresence>
                            {filtered.map((p, idx) => (
                                <motion.div
                                    key={p.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: deletingId === p.id ? 0.4 : 1 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`grid grid-cols-[56px_1fr_120px_100px_110px] items-center gap-4 px-6 py-4 ${
                                        idx < filtered.length - 1 ? "border-b border-stone-100" : ""
                                    } hover:bg-stone-50/60 transition-colors group`}
                                >
                                    {/* Thumbnail */}
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0 flex items-center justify-center">
                                        {p.image ? (
                                            <img
                                                src={`/storage/${p.image}`}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <Package size={18} className="text-stone-300" />
                                        )}
                                    </div>

                                    {/* Name + category */}
                                    <div className="min-w-0">
                                        <p className="font-semibold text-stone-900 text-sm truncate group-hover:text-amber-800 transition-colors">
                                            {p.name}
                                        </p>
                                        {p.category?.name && (
                                            <p className="text-xs text-stone-400 font-light mt-0.5">{p.category.name}</p>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <p className="text-sm font-semibold text-stone-900">
                                        ${Number(p.price).toFixed(2)}
                                    </p>

                                    {/* Stock badge */}
                                    <div>
                                        {p.stock > 10 ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800">
                                                {p.stock} in stock
                                            </span>
                                        ) : p.stock > 0 ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800">
                                                Low · {p.stock} left
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-red-100 text-red-700">
                                                <AlertTriangle size={10} />
                                                <span>Out of stock</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={`/vendor/products/${p.id}/edit`}
                                            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                                            title="Edit product"
                                        >
                                            <Pencil size={15} />
                                        </Link>
                                        <button
                                            onClick={() => deleteProduct(p.id)}
                                            disabled={deletingId === p.id}
                                            className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-40"
                                            title="Delete product"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
