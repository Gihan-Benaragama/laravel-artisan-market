import React, { useState } from "react";
import { Link, router, useForm } from "@inertiajs/react";
import { Star, ChevronLeft } from "lucide-react";
import Navbar from "../../Components/Navbar";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F2EAE0",
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#0F0D0B",
};

export default function ShopShow({ product, related, canReview, alreadyReviewed }) {
    const [qty, setQty] = useState(1);
    const [adding, setAdding] = useState(false);

    const addToCart = () => {
        setAdding(true);
        router.post(
            "/cart",
            { product_id: product.id, quantity: qty },
            {
                preserveScroll: true,
                onFinish: () => setAdding(false),
            }
        );
    };

    const avgRating =
        product.reviews?.length > 0
            ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
            : null;

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bgLight, color: COLORS.ink, minHeight: "100vh" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
        .voice { font-family: 'Fraunces', serif; }
        @keyframes riseIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .reveal { animation: riseIn 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .card-hover { transition: transform 0.4s cubic-bezier(0.22,1,0.36,1); }
        .card-hover:hover { transform: translateY(-5px); }
        .btn-primary { transition: opacity 0.25s ease; }
        .btn-primary:hover { opacity: 0.88; }
      `}</style>

            {/* NAV */}
            <nav className="w-full flex items-center justify-between" style={{ padding: "1.25rem 3rem", background: COLORS.bg, color: COLORS.bgLight }}>
                <Link href="/" className="voice" style={{ fontSize: 22, fontWeight: 500, textDecoration: "none", color: COLORS.bgLight }}>
                    Aterlier
                </Link>
                <div className="flex items-center" style={{ gap: 32, fontSize: 14 }}>
                    <Link href="/shop" style={{ opacity: 0.85, color: COLORS.bgLight, textDecoration: "none" }}>Shop</Link>
                    <span style={{ opacity: 0.85, cursor: "pointer" }}>Makers</span>
                    <Link href="/cart">
                        <ShoppingBag size={17} strokeWidth={1.5} style={{ color: COLORS.bgLight }} />
                    </Link>
                </div>
            </nav>

            <div style={{ padding: "2rem 3rem 0" }}>
                <Link href="/shop" className="flex items-center" style={{ gap: 6, fontSize: 13, color: COLORS.sage, textDecoration: "none", width: "fit-content" }}>
                    <ChevronLeft size={15} /> Back to shop
                </Link>
            </div>

            {/* PRODUCT MAIN */}
            <div className="reveal grid grid-cols-2" style={{ gap: 56, padding: "2rem 3rem 4rem" }}>
                <div
                    style={{
                        height: 480,
                        borderRadius: 4,
                        background: `linear-gradient(200deg, ${COLORS.sienna}22, ${COLORS.sage}33)`,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {product.image ? (
                        <img src={`/storage/${product.image}`} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <ShoppingBag size={48} style={{ color: COLORS.sage, opacity: 0.5 }} />
                    )}
                </div>

                <div style={{ paddingTop: 8 }}>
                    <Link
                        href={`/vendor/${product.shop?.vendor_id ?? ""}`}
                        style={{ fontSize: 13, color: COLORS.sienna, textDecoration: "none", letterSpacing: "0.04em", textTransform: "uppercase" }}
                    >
                        {product.shop?.name ?? "Unnamed Studio"}
                    </Link>

                    <h1 className="voice" style={{ fontSize: 36, fontWeight: 500, margin: "12px 0 16px", lineHeight: 1.15 }}>
                        {product.name}
                    </h1>

                    {avgRating && (
                        <div className="flex items-center" style={{ gap: 6, marginBottom: 18, fontSize: 13, color: COLORS.sage }}>
                            <Star size={14} fill={COLORS.brass} stroke="none" />
                            {avgRating} ({product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""})
                        </div>
                    )}

                    <p className="voice" style={{ fontSize: 28, color: COLORS.sienna, fontWeight: 500, marginBottom: 22 }}>
                        ${Number(product.price).toFixed(2)}
                    </p>

                    <p style={{ fontSize: 15, lineHeight: 1.75, color: "#3a3733", marginBottom: 28 }}>
                        {product.description}
                    </p>

                    <div className="flex items-center" style={{ gap: 14, marginBottom: 28 }}>
                        <div className="flex items-center" style={{ border: "1px solid rgba(15,13,11,0.2)", borderRadius: 2 }}>
                            <button
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                style={{ padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: 15 }}
                            >
                                −
                            </button>
                            <span style={{ padding: "0 14px", fontSize: 14 }}>{qty}</span>
                            <button
                                onClick={() => setQty((q) => Math.min(product.stock ?? 99, q + 1))}
                                style={{ padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: 15 }}
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={addToCart}
                            disabled={adding || product.stock === 0}
                            className="btn-primary"
                            style={{
                                flex: 1,
                                background: product.stock === 0 ? COLORS.sage : COLORS.sienna,
                                color: COLORS.bgLight,
                                border: "none",
                                padding: "13px 22px",
                                fontSize: 14,
                                fontWeight: 500,
                                borderRadius: 2,
                                cursor: product.stock === 0 ? "not-allowed" : "pointer",
                            }}
                        >
                            {product.stock === 0 ? "Out of stock" : adding ? "Adding..." : "Add to cart"}
                        </button>
                    </div>

                    <p style={{ fontSize: 12.5, color: COLORS.sage }}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Currently unavailable"} · Category: {product.category?.name}
                    </p>
                </div>
            </div>

            {/* REVIEWS */}
            {product.reviews?.length > 0 && (
                <div style={{ padding: "0 3rem 4rem", maxWidth: 800 }}>
                    <h2 className="voice" style={{ fontSize: 24, fontWeight: 500, marginBottom: 20 }}>What people are saying</h2>
                    <div className="flex flex-col" style={{ gap: 18 }}>
                        {product.reviews.map((r) => (
                            <div key={r.id} style={{ borderTop: "1px solid rgba(15,13,11,0.1)", paddingTop: 16 }}>
                                <div className="flex items-center" style={{ gap: 8, marginBottom: 6 }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={13} fill={i < r.rating ? COLORS.brass : "none"} stroke={COLORS.brass} />
                                    ))}
                                    <span style={{ fontSize: 13, color: COLORS.sage, marginLeft: 6 }}>{r.user?.name}</span>
                                </div>
                                <p style={{ fontSize: 14, lineHeight: 1.6 }}>{r.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* REVIEW FORM — only shown to customers who bought this and haven't reviewed yet */}
            {canReview && !alreadyReviewed && <ReviewForm productId={product.id} />}
            {alreadyReviewed && (
                <div style={{ padding: "0 3rem 2rem", maxWidth: 800 }}>
                    <p style={{ fontSize: 13.5, color: COLORS.sage }}>You've already reviewed this product. Thank you!</p>
                </div>
            )}

            {/* RELATED PRODUCTS */}
            {related?.length > 0 && (
                <div style={{ padding: "1rem 3rem 5rem", borderTop: `1px solid rgba(15,13,11,0.08)` }}>
                    <p style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.sage, margin: "2rem 0 20px" }}>
                        More from this studio
                    </p>
                    <div className="grid grid-cols-4" style={{ gap: 22 }}>
                        {related.map((p) => (
                            <Link
                                key={p.id}
                                href={`/shop/${p.slug}`}
                                className="card-hover"
                                style={{ textDecoration: "none", color: COLORS.ink }}
                            >
                                <div style={{ height: 170, borderRadius: 4, marginBottom: 10, background: `linear-gradient(200deg, ${COLORS.sienna}22, ${COLORS.sage}33)` }} />
                                <p style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 3 }}>{p.name}</p>
                                <p style={{ fontSize: 13, color: COLORS.sienna }}>${Number(p.price).toFixed(2)}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
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
        <div style={{ padding: "0 3rem 3rem", maxWidth: 800 }}>
            <h3 className="voice" style={{ fontSize: 20, fontWeight: 500, marginBottom: 14 }}>Leave a review</h3>
            <form onSubmit={submit} className="flex flex-col" style={{ gap: 14 }}>
                <div className="flex items-center" style={{ gap: 6 }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                            key={n}
                            size={22}
                            fill={n <= data.rating ? COLORS.brass : "none"}
                            stroke={COLORS.brass}
                            style={{ cursor: "pointer" }}
                            onClick={() => setData("rating", n)}
                        />
                    ))}
                </div>
                <textarea
                    value={data.comment}
                    onChange={(e) => setData("comment", e.target.value)}
                    placeholder="Share your thoughts on this piece..."
                    style={{ padding: "11px 14px", fontSize: 14, border: "1px solid rgba(15,13,11,0.15)", borderRadius: 2, minHeight: 90, fontFamily: "'Inter', sans-serif" }}
                />
                {errors.review && <p style={{ color: COLORS.sienna, fontSize: 13 }}>{errors.review}</p>}
                <button
                    type="submit"
                    disabled={processing}
                    style={{ background: COLORS.sienna, color: COLORS.bgLight, border: "none", padding: "12px 24px", borderRadius: 2, fontSize: 14, fontWeight: 500, width: "fit-content", cursor: "pointer" }}
                >
                    {processing ? "Submitting..." : "Submit review"}
                </button>
            </form>
        </div>
    );
}
