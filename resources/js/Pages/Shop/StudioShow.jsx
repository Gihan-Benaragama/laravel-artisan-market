import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    Store,
    Sparkles,
    ChevronLeft,
    Eye,
    ShieldCheck,
    Package,
    Star,
    MessageSquare,
    CheckCircle,
    AlertCircle,
    User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../Components/Navbar";

/* ───────────────────────── helpers ───────────────────────── */
function avg(reviews) {
    if (!reviews || reviews.length === 0) return null;
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
}

function StarRow({ value, onChange, size = 24, readonly = false }) {
    const [hovered, setHovered] = useState(0);
    const display = hovered || value;
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    size={size}
                    fill={n <= display ? "#D4AF37" : "none"}
                    stroke="#D4AF37"
                    className={readonly ? "" : "cursor-pointer hover:scale-110 transition-transform"}
                    onClick={() => !readonly && onChange && onChange(n)}
                    onMouseEnter={() => !readonly && setHovered(n)}
                    onMouseLeave={() => !readonly && setHovered(0)}
                />
            ))}
        </div>
    );
}

/* ───────────────────── review form ───────────────────────── */
function ReviewForm({ shopId, subOrders, existingReviews }) {
    const { flash } = usePage().props;

    // Sub-orders that haven't been reviewed yet
    const eligible = (subOrders || []).filter(
        (so) => !existingReviews.includes(so.id)
    );

    const [selectedSubOrderId, setSelectedSubOrderId] = useState(
        eligible.length > 0 ? eligible[0].id : null
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        shop_id:      shopId,
        sub_order_id: selectedSubOrderId,
        rating:       5,
        comment:      "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/reviews/shop", {
            onSuccess: () => reset("comment", "rating"),
        });
    };

    if (eligible.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 max-w-xl"
        >
            <h3 className="font-voice text-xl font-medium text-[#12100E] mb-1">
                Rate this Studio
            </h3>
            <p className="text-xs text-stone-400 mb-5">
                Share your experience to help other craft enthusiasts.
            </p>

            {flash?.success && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4">
                    <CheckCircle size={15} />
                    {flash.success}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Order picker (if multiple eligible) */}
                {eligible.length > 1 && (
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                            Select Order
                        </label>
                        <select
                            value={data.sub_order_id}
                            onChange={(e) => {
                                const id = Number(e.target.value);
                                setSelectedSubOrderId(id);
                                setData("sub_order_id", id);
                            }}
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-800 focus:outline-none focus:border-[#C86D51]"
                        >
                            {eligible.map((so) => (
                                <option key={so.id} value={so.id}>
                                    Order #{so.order_id} — {new Date(so.created_at).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Star rating */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                        Your Rating
                    </label>
                    <StarRow value={data.rating} onChange={(n) => setData("rating", n)} />
                    {errors.rating && (
                        <p className="text-xs text-red-500 mt-1">{errors.rating}</p>
                    )}
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                        Review <span className="text-stone-400 font-light">(optional)</span>
                    </label>
                    <textarea
                        value={data.comment}
                        onChange={(e) => setData("comment", e.target.value)}
                        placeholder="Describe your experience with this studio..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C86D51] resize-none"
                    />
                    {errors.comment && (
                        <p className="text-xs text-red-500 mt-1">{errors.comment}</p>
                    )}
                </div>

                {errors.review && (
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                        <AlertCircle size={13} />
                        {errors.review}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={processing}
                    className="px-7 py-3 rounded-full bg-[#12100E] hover:bg-[#C86D51] text-white text-xs font-semibold uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {processing ? "Posting…" : "Post Review"}
                </button>
            </form>
        </motion.div>
    );
}

/* ───────────────────── review list ───────────────────────── */
function ReviewList({ reviews }) {
    const average = avg(reviews);

    return (
        <div>
            {/* Summary header */}
            <div className="flex items-center gap-6 mb-8">
                {average ? (
                    <>
                        <div className="bg-[#12100E] text-white rounded-2xl px-6 py-4 text-center min-w-[80px]">
                            <p className="text-3xl font-bold">{average}</p>
                            <div className="flex justify-center mt-1">
                                <Star size={12} fill="#D4AF37" stroke="#D4AF37" />
                                <Star size={12} fill="#D4AF37" stroke="#D4AF37" />
                                <Star size={12} fill="#D4AF37" stroke="#D4AF37" />
                                <Star size={12} fill="#D4AF37" stroke="#D4AF37" />
                                <Star size={12} fill={Number(average) >= 4.5 ? "#D4AF37" : "none"} stroke="#D4AF37" />
                            </div>
                            <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider">
                                {reviews.length} review{reviews.length !== 1 && "s"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = reviews.filter((r) => r.rating === star).length;
                                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-2 text-xs">
                                        <span className="w-3 text-stone-500">{star}</span>
                                        <Star size={10} fill="#D4AF37" stroke="#D4AF37" />
                                        <div className="w-28 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#D4AF37] rounded-full"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="text-stone-400">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-stone-500 font-light">No reviews yet — be the first!</p>
                )}
            </div>

            {/* Individual reviews */}
            {reviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {reviews.map((r) => (
                        <motion.div
                            key={r.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#C86D51]/10 flex items-center justify-center text-[#C86D51]">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#12100E]">
                                            {r.user?.name || "Verified Customer"}
                                        </p>
                                        <p className="text-[10px] text-stone-400">
                                            {new Date(r.created_at).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <StarRow value={r.rating} readonly size={13} />
                            </div>
                            {r.comment && (
                                <p className="text-sm text-stone-600 leading-relaxed font-light">
                                    {r.comment}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ───────────────────── main page ─────────────────────────── */
export default function StudioShow({
    shop,
    products = [],
    reviewableSubOrders = [],
    existingReviews = [],
}) {
    const { auth } = usePage().props;
    const reviews = shop.reviews || [];
    const average = avg(reviews);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 25, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
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

            {/* STUDIO PROFILE CARD */}
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

                            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400">
                                {shop.vendor?.user?.name && (
                                    <span className="flex items-center gap-1">
                                        <Sparkles size={13} className="text-[#C86D51]" />
                                        Master Craftsman: {shop.vendor.user.name}
                                    </span>
                                )}
                                {average && (
                                    <span className="flex items-center gap-1 text-[#D4AF37] font-semibold">
                                        <Star size={13} fill="currentColor" stroke="currentColor" />
                                        {average} · {reviews.length} review{reviews.length !== 1 && "s"}
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

            {/* PRODUCTS GRID */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
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
                                                src={p.image.startsWith("http") ? p.image : `/storage/${p.image}`}
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

            {/* REVIEWS SECTION */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-stone-200/80 pt-16 pb-8">
                <div className="mb-10">
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C86D51] block mb-1">
                        Customer Feedback
                    </span>
                    <h2 className="font-voice text-2xl text-[#12100E] font-medium flex items-center gap-2">
                        <MessageSquare size={22} className="text-stone-400" />
                        Studio Reviews
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* Review list (left 2/3) */}
                    <div className="lg:col-span-2">
                        <ReviewList reviews={reviews} />
                    </div>

                    {/* Review form (right 1/3) */}
                    <div>
                        {!auth?.user ? (
                            <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center shadow-sm">
                                <Star size={28} className="mx-auto text-[#D4AF37] mb-3" />
                                <p className="text-sm font-medium text-stone-700 mb-1">
                                    Want to rate this studio?
                                </p>
                                <p className="text-xs text-stone-400 mb-5">
                                    Sign in to leave a review after purchasing.
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-block px-6 py-2.5 rounded-full bg-[#12100E] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#C86D51] transition-colors"
                                >
                                    Sign In
                                </Link>
                            </div>
                        ) : reviewableSubOrders.length === 0 ? (
                            <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center shadow-sm">
                                <ShieldCheck size={28} className="mx-auto text-stone-300 mb-3" />
                                <p className="text-sm font-medium text-stone-600 mb-1">
                                    Purchase to review
                                </p>
                                <p className="text-xs text-stone-400">
                                    You can rate this studio after completing an order from them.
                                </p>
                            </div>
                        ) : (
                            <ReviewForm
                                shopId={shop.id}
                                subOrders={reviewableSubOrders}
                                existingReviews={existingReviews}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
