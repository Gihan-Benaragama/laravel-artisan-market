import React, { useState } from "react";
import { Link, router, useForm } from "@inertiajs/react";
import { Star, ChevronLeft, ShoppingBag, Plus, Minus, ShieldCheck, Truck, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../../Components/Navbar";

export default function ShopShow({ product, related = [], canReview, alreadyReviewed }) {
    const [qty, setQty] = useState(1);
    const [adding, setAdding] = useState(false);
    const [addedSuccess, setAddedSuccess] = useState(false);

    const addToCart = () => {
        setAdding(true);
        router.post(
            "/cart",
            { product_id: product.id, quantity: qty },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setAddedSuccess(true);
                    setTimeout(() => setAddedSuccess(false), 2500);
                },
                onFinish: () => setAdding(false),
            }
        );
    };

    const avgRating =
        product.reviews?.length > 0
            ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
            : null;

    return (
        <div className="min-h-screen bg-[#F8F5F0] text-[#12100E] font-sans pb-24">
            <Navbar />

            {/* BREADCRUMB BACK BUTTON */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8">
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-[#C86D51] transition-colors"
                >
                    <ChevronLeft size={16} /> Back to Catalog
                </Link>
            </div>

            {/* PRODUCT MAIN CONTAINER */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                
                {/* IMAGE DISPLAY */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-lg h-[460px] sm:h-[560px] flex items-center justify-center"
                >
                    {product.image ? (
                        <img
                            src={product.image.startsWith('http') ? product.image : `/storage/${product.image}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-stone-300">
                            <ShoppingBag size={56} />
                            <span className="text-xs uppercase tracking-widest text-stone-400">Handcrafted Piece</span>
                        </div>
                    )}
                    <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-[#12100E] uppercase tracking-widest shadow-md">
                        Authentic Studio Work
                    </div>
                </motion.div>

                {/* PRODUCT DETAILS */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="flex flex-col"
                >
                    {/* Studio Tag */}
                    <div className="mb-3">
                        <Link
                            href={`/shop`}
                            className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#C86D51] hover:underline"
                        >
                            {product.shop?.name ?? "Artisan Studio"}
                        </Link>
                    </div>

                    <h1 className="font-voice text-3xl sm:text-4xl text-[#12100E] font-medium leading-tight mb-4">
                        {product.name}
                    </h1>

                    {/* RATING */}
                    {avgRating && (
                        <div className="flex items-center gap-2 mb-6 text-sm text-stone-600">
                            <div className="flex items-center gap-1 text-[#D4AF37]">
                                <Star size={16} fill="currentColor" />
                                <span className="font-bold text-[#12100E]">{avgRating}</span>
                            </div>
                            <span className="text-stone-400">•</span>
                            <span>{product.reviews.length} customer review{product.reviews.length !== 1 && "s"}</span>
                        </div>
                    )}

                    {/* PRICE */}
                    <div className="text-3xl font-bold text-[#12100E] mb-6">
                        ${Number(product.price).toFixed(2)}
                    </div>

                    <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-8 font-light">
                        {product.description || "Each item is carefully crafted using traditional studio methods, making every single piece unique."}
                    </p>

                    {/* QUANTITY & ADD TO CART */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                        <div className="flex items-center justify-between border border-stone-300 rounded-full px-4 py-2.5 bg-white shadow-sm w-36">
                            <button
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                className="p-1 text-stone-600 hover:text-black transition-colors"
                            >
                                <Minus size={14} />
                            </button>
                            <span className="font-semibold text-sm select-none">{qty}</span>
                            <button
                                onClick={() => setQty((q) => Math.min(product.stock ?? 99, q + 1))}
                                className="p-1 text-stone-600 hover:text-black transition-colors"
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={addToCart}
                            disabled={adding || product.stock === 0}
                            className={`flex-1 px-8 py-3.5 rounded-full font-medium text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                                product.stock === 0
                                    ? "bg-stone-400 cursor-not-allowed"
                                    : addedSuccess
                                    ? "bg-emerald-600"
                                    : "bg-gradient-to-r from-[#C86D51] to-[#B25539]"
                            }`}
                        >
                            {addedSuccess ? (
                                <>
                                    <CheckCircle2 size={18} /> Added to Cart!
                                </>
                            ) : product.stock === 0 ? (
                                "Sold Out"
                            ) : adding ? (
                                "Adding..."
                            ) : (
                                <>
                                    <ShoppingBag size={18} /> Add to Cart
                                </>
                            )}
                        </motion.button>
                    </div>

                    {/* PERKS BADGES */}
                    <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-stone-200/80 mb-8 text-xs text-stone-600">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={20} className="text-[#C86D51]" />
                            <span>Direct Studio Guarantee</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Truck size={20} className="text-[#C86D51]" />
                            <span>Eco-friendly Studio Packaging</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* REVIEWS SECTION */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 border-t border-stone-200/80">
                <h2 className="font-voice text-2xl text-[#12100E] font-medium mb-8">
                    Customer Reviews
                </h2>

                {product.reviews?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {product.reviews.map((r) => (
                            <div key={r.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex text-[#D4AF37]">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} stroke="currentColor" />
                                        ))}
                                    </div>
                                    <span className="text-xs font-semibold text-stone-700 ml-2">{r.user?.name || "Verified Customer"}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{r.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-stone-500 font-light mb-8">No customer reviews yet.</p>
                )}

                {canReview && !alreadyReviewed && <ReviewForm productId={product.id} />}
            </div>
        </div>
    );
}

function ReviewForm({ productId }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: productId,
        rating: 5,
        comment: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/reviews", { onSuccess: () => reset("comment") });
    };

    return (
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm max-w-xl">
            <h3 className="font-voice text-xl font-medium mb-4">Write a Review</h3>
            <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                            key={n}
                            size={22}
                            fill={n <= data.rating ? "#D4AF37" : "none"}
                            stroke="#D4AF37"
                            className="cursor-pointer hover:scale-110 transition-transform"
                            onClick={() => setData("rating", n)}
                        />
                    ))}
                </div>
                <textarea
                    value={data.comment}
                    onChange={(e) => setData("comment", e.target.value)}
                    placeholder="Share your experience with this studio piece..."
                    className="w-full p-4 rounded-xl border border-stone-300 focus:outline-none focus:border-[#C86D51] text-sm"
                    rows={4}
                />
                {errors.comment && <p className="text-xs text-red-500">{errors.comment}</p>}
                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-3 rounded-full bg-[#12100E] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#C86D51] transition-colors w-fit"
                >
                    {processing ? "Submitting..." : "Post Review"}
                </button>
            </form>
        </div>
    );
}
