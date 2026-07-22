import React, { useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus, CreditCard } from "lucide-react";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F8F6F2", // Slightly softer warm background
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#1C1815",
    border: "rgba(28,24,21,0.08)",
};

export default function CartDrawer({ open, onClose }) {
    const { cart } = usePage().props;
    const items = cart?.items ?? [];
    const total = items.reduce(
        (sum, i) => sum + i.quantity * Number(i.product?.price ?? 0),
        0
    );
    const totalItems = items.reduce((s, i) => s + i.quantity, 0);

    // lock body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // close on Escape key
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const updateQty = (id, quantity) => {
        if (quantity < 1) return;
        router.patch(`/cart/${id}`, { quantity }, { preserveScroll: true });
    };

    const removeItem = (id) => {
        router.delete(`/cart/${id}`, { preserveScroll: true });
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-stone-900/60 backdrop-blur-[4px] z-[200]"
                        transition={{ duration: 0.3 }}
                    />

                    {/* DRAWER CONTAINER */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 220 }}
                        className="fixed top-0 right-0 h-full w-[440px] max-w-full bg-stone-50 z-[201] flex flex-col shadow-2xl border-l border-stone-200 font-sans"
                    >
                        {/* HEADER */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-white">
                            <div className="flex items-center space-x-3">
                                <div className="bg-amber-100 p-2 rounded-lg text-amber-800">
                                    <ShoppingBag size={18} />
                                </div>
                                <div>
                                    <h3 className="font-serif text-lg font-medium text-stone-900">Your Cart</h3>
                                    <p className="text-xs text-stone-400 font-light mt-0.5">
                                        {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* ITEMS LIST */}
                        <div className="flex-1 overflow-y-auto py-3 px-6 divide-y divide-stone-100">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                                    <div className="bg-stone-100 p-4 rounded-full text-stone-400">
                                        <ShoppingBag size={36} />
                                    </div>
                                    <div>
                                        <p className="font-serif text-base text-stone-800">Your cart is empty</p>
                                        <p className="text-xs text-stone-450 mt-1 font-light">Add unique handcrafted items from the shop</p>
                                    </div>
                                    <Link
                                        href="/shop"
                                        onClick={onClose}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-xl text-white bg-amber-700 hover:bg-amber-850 transition-colors shadow-sm cursor-pointer"
                                    >
                                        Browse Shop
                                    </Link>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="py-4 flex items-center space-x-4 group"
                                    >
                                        {/* Image */}
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                                            {item.product?.image ? (
                                                <img
                                                    src={`/storage/${item.product.image}`}
                                                    alt={item.product?.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                    <ShoppingBag size={20} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-serif text-sm font-normal text-stone-850 truncate group-hover:text-amber-850 transition-colors">
                                                {item.product?.name ?? "Product"}
                                            </h4>
                                            {item.product?.shop?.name && (
                                                <span className="text-xs text-stone-400 font-light block mt-0.5">
                                                    by {item.product.shop.name}
                                                </span>
                                            )}

                                            {/* Quantity selector */}
                                            <div className="flex items-center space-x-2.5 mt-2.5">
                                                <div className="flex items-center border border-stone-200 rounded-lg bg-white overflow-hidden shadow-sm">
                                                    <button
                                                        onClick={() => updateQty(item.id, item.quantity - 1)}
                                                        className="p-1 px-2.5 hover:bg-stone-50 text-stone-500 hover:text-stone-700 transition-colors border-r border-stone-200 cursor-pointer text-xs"
                                                    >
                                                        <Minus size={10} />
                                                    </button>
                                                    <span className="px-2.5 text-xs font-semibold text-stone-800 select-none">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQty(item.id, item.quantity + 1)}
                                                        className="p-1 px-2.5 hover:bg-stone-50 text-stone-500 hover:text-stone-700 transition-colors border-l border-stone-200 cursor-pointer text-xs"
                                                    >
                                                        <Plus size={10} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-stone-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Remove item"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price block */}
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-semibold text-stone-900">
                                                ${(item.quantity * Number(item.product?.price ?? 0)).toFixed(2)}
                                            </p>
                                            <p className="text-[10px] text-stone-400 font-light mt-0.5">
                                                ${Number(item.product?.price ?? 0).toFixed(2)} each
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* FOOTER */}
                        {items.length > 0 && (
                            <div className="border-t border-stone-200 p-6 bg-white space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-stone-500">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-stone-900">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-stone-400">
                                        <span>Shipping & taxes</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    <div className="border-t border-stone-100 pt-3 flex justify-between text-base font-medium text-stone-900">
                                        <span>Total</span>
                                        <span className="font-semibold text-lg text-amber-850">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2 pt-2">
                                    <Link
                                        href="/checkout"
                                        onClick={onClose}
                                        className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-amber-700 hover:bg-amber-850 transition-colors shadow-md hover:shadow-lg cursor-pointer"
                                    >
                                        <CreditCard size={15} />
                                        <span>Checkout</span>
                                        <ArrowRight size={14} className="ml-1" />
                                    </Link>
                                    
                                    <Link
                                        href="/cart"
                                        onClick={onClose}
                                        className="w-full flex items-center justify-center py-2.5 text-xs text-stone-500 hover:text-stone-800 transition-colors font-medium border border-stone-200 rounded-xl hover:bg-stone-50 text-center cursor-pointer"
                                    >
                                        View Full Shopping Cart
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
