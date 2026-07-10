import React, { useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from "lucide-react";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F2EAE0",
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#0F0D0B",
};

export default function CartDrawer({ open, onClose }) {
    const { cart } = usePage().props;
    const items = cart?.items ?? [];
    const total = items.reduce(
        (sum, i) => sum + i.quantity * Number(i.product?.price ?? 0),
        0
    );

    // lock body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    // close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
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
        <>
            {/* BACKDROP */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(15,13,11,0.55)",
                    zIndex: 200,
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? "auto" : "none",
                    transition: "opacity 0.35s ease",
                    backdropFilter: "blur(2px)",
                }}
            />

            {/* DRAWER */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: 400,
                    maxWidth: "90vw",
                    background: COLORS.bgLight,
                    zIndex: 201,
                    display: "flex",
                    flexDirection: "column",
                    transform: open ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                    boxShadow: open ? "8px 0 40px rgba(15,13,11,0.18)" : "none",
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600&family=Inter:wght@400;500;600&display=swap');
                    .voice { font-family: 'Fraunces', serif; }
                    .cart-item-row { transition: background 0.15s ease; }
                    .cart-item-row:hover { background: rgba(168,138,91,0.06); }
                    .qty-btn { transition: background 0.15s ease; border: none; cursor: pointer; }
                    .qty-btn:hover { background: rgba(168,138,91,0.15) !important; }
                    .remove-btn { transition: opacity 0.2s ease; border: none; background: transparent; cursor: pointer; }
                    .remove-btn:hover { opacity: 0.6; }
                `}</style>

                {/* HEADER */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1.25rem 1.5rem",
                        background: COLORS.bg,
                        color: "#ffffff",
                        flexShrink: 0,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <ShoppingBag size={18} strokeWidth={1.5} style={{ color: COLORS.brass }} />
                        <span
                            className="voice"
                            style={{ fontSize: 18, fontWeight: 500, color: "#ffffff" }}
                        >
                            Your cart
                        </span>
                        {items.length > 0 && (
                            <span
                                style={{
                                    background: COLORS.sienna,
                                    color: "#ffffff",
                                    borderRadius: "50%",
                                    width: 20,
                                    height: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 11,
                                    fontWeight: 600,
                                }}
                            >
                                {items.reduce((s, i) => s + i.quantity, 0)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="remove-btn"
                        style={{ color: "rgba(255,255,255,0.7)", padding: 4 }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ITEMS */}
                <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0" }}>
                    {items.length === 0 ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                gap: 14,
                                color: COLORS.sage,
                                padding: "2rem",
                                textAlign: "center",
                            }}
                        >
                            <ShoppingBag size={40} strokeWidth={1} style={{ opacity: 0.4 }} />
                            <p style={{ fontSize: 15 }}>Your cart is empty</p>
                            <Link
                                href="/shop"
                                onClick={onClose}
                                style={{
                                    fontSize: 13,
                                    color: COLORS.sienna,
                                    textDecoration: "none",
                                    fontWeight: 500,
                                    borderBottom: `1px solid ${COLORS.sienna}`,
                                    paddingBottom: 2,
                                }}
                            >
                                Browse the shop →
                            </Link>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.id}
                                className="cart-item-row"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    padding: "14px 20px",
                                    borderBottom: "1px solid rgba(15,13,11,0.07)",
                                }}
                            >
                                {/* PRODUCT IMAGE */}
                                <div
                                    style={{
                                        width: 58,
                                        height: 58,
                                        borderRadius: 3,
                                        background: `linear-gradient(135deg, ${COLORS.sienna}22, ${COLORS.sage}33)`,
                                        flexShrink: 0,
                                        overflow: "hidden",
                                    }}
                                >
                                    {item.product?.image && (
                                        <img
                                            src={`/storage/${item.product.image}`}
                                            alt={item.product?.name}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    )}
                                </div>

                                {/* INFO */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p
                                        style={{
                                            fontSize: 13.5,
                                            fontWeight: 500,
                                            color: COLORS.ink,
                                            marginBottom: 2,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {item.product?.name ?? "Product"}
                                    </p>
                                    {item.product?.shop?.name && (
                                        <p style={{ fontSize: 11.5, color: COLORS.sage, marginBottom: 6 }}>
                                            {item.product.shop.name}
                                        </p>
                                    )}
                                    {/* QTY CONTROLS */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQty(item.id, item.quantity - 1)}
                                            style={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: 2,
                                                background: "rgba(15,13,11,0.07)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: COLORS.ink,
                                            }}
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <span style={{ fontSize: 13, fontWeight: 600, minWidth: 18, textAlign: "center" }}>
                                            {item.quantity}
                                        </span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQty(item.id, item.quantity + 1)}
                                            style={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: 2,
                                                background: "rgba(15,13,11,0.07)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: COLORS.ink,
                                            }}
                                        >
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                </div>

                                {/* PRICE + REMOVE */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink }}>
                                        ${(item.quantity * Number(item.product?.price ?? 0)).toFixed(2)}
                                    </span>
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeItem(item.id)}
                                        title="Remove"
                                    >
                                        <Trash2 size={14} style={{ color: COLORS.sage }} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* FOOTER */}
                {items.length > 0 && (
                    <div
                        style={{
                            borderTop: "1px solid rgba(15,13,11,0.1)",
                            padding: "1.25rem 1.5rem",
                            flexShrink: 0,
                            background: "#ffffff",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 16,
                            }}
                        >
                            <span style={{ fontSize: 14, color: COLORS.sage }}>Subtotal</span>
                            <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink }}>
                                ${total.toFixed(2)}
                            </span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={onClose}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                width: "100%",
                                padding: "13px 0",
                                background: COLORS.sienna,
                                color: "#ffffff",
                                borderRadius: 2,
                                textDecoration: "none",
                                fontSize: 14,
                                fontWeight: 600,
                                transition: "opacity 0.2s",
                                boxSizing: "border-box",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.88)}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
                        >
                            Proceed to checkout <ArrowRight size={15} />
                        </Link>
                        <Link
                            href="/cart"
                            onClick={onClose}
                            style={{
                                display: "block",
                                textAlign: "center",
                                marginTop: 10,
                                fontSize: 13,
                                color: COLORS.sage,
                                textDecoration: "none",
                            }}
                        >
                            View full cart
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
