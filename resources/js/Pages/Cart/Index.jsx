import React from "react";
import { Link, router } from "@inertiajs/react";
import { Trash2, ChevronLeft, ArrowRight } from "lucide-react";
import Navbar from "../../Components/Navbar";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F2EAE0",
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#0F0D0B",
};

export default function CartIndex({ cart }) {
    const items = cart?.items ?? [];
    const total = items.reduce((sum, i) => sum + i.quantity * Number(i.product?.price ?? 0), 0);

    // group items by vendor shop, since checkout will split by vendor too
    const groupedByShop = items.reduce((acc, item) => {
        const shopName = item.product?.shop?.name ?? "Unknown studio";
        if (!acc[shopName]) acc[shopName] = [];
        acc[shopName].push(item);
        return acc;
    }, {});

    const updateQty = (id, quantity) => {
        if (quantity < 1) return;
        router.patch(`/cart/${id}`, { quantity }, { preserveScroll: true });
    };

    const removeItem = (id) => {
        router.delete(`/cart/${id}`, { preserveScroll: true });
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bgLight, color: COLORS.ink, minHeight: "100vh" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
        .voice { font-family: 'Fraunces', serif; }
        @keyframes riseIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .reveal { animation: riseIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .icon-btn { transition: opacity 0.2s ease; cursor: pointer; }
        .icon-btn:hover { opacity: 0.6; }
      `}</style>

            <Navbar />

            <div style={{ padding: "2.5rem 3rem 1rem" }}>
                <Link href="/shop" className="flex items-center" style={{ gap: 6, fontSize: 13, color: COLORS.sage, textDecoration: "none", width: "fit-content", marginBottom: 20 }}>
                    <ChevronLeft size={15} /> Back to shop
                </Link>
                <h1 className="voice" style={{ fontSize: 34, fontWeight: 500 }}>Your cart</h1>
            </div>

            {items.length === 0 ? (
                <div style={{ padding: "2rem 3rem 6rem" }}>
                    <p style={{ fontSize: 15, color: COLORS.sage, marginBottom: 20 }}>Your cart is empty.</p>
                    <Link
                        href="/shop"
                        style={{ background: COLORS.sienna, color: COLORS.bgLight, padding: "12px 22px", borderRadius: 2, fontSize: 14, textDecoration: "none" }}
                    >
                        Browse the shop
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-3" style={{ gap: 40, padding: "1rem 3rem 5rem" }}>
                    {/* ITEMS */}
                    <div style={{ gridColumn: "span 2" }}>
                        {Object.entries(groupedByShop).map(([shopName, shopItems]) => (
                            <div key={shopName} className="reveal" style={{ marginBottom: 32 }}>
                                <p style={{ fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.sienna, marginBottom: 14 }}>
                                    {shopName}
                                </p>
                                {shopItems.map((item) => (
                                    <div key={item.id} className="flex items-center" style={{ gap: 18, padding: "16px 0", borderTop: "1px solid rgba(15,13,11,0.1)" }}>
                                        <div style={{ width: 84, height: 84, borderRadius: 4, flexShrink: 0, background: `linear-gradient(200deg, ${COLORS.sienna}22, ${COLORS.sage}33)` }} />

                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: 14.5, fontWeight: 500, marginBottom: 4 }}>{item.product?.name}</p>
                                            <p style={{ fontSize: 13, color: COLORS.sage }}>${Number(item.product?.price ?? 0).toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center" style={{ border: "1px solid rgba(15,13,11,0.2)", borderRadius: 2 }}>
                                            <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ padding: "6px 12px", background: "transparent", border: "none", cursor: "pointer" }}>−</button>
                                            <span style={{ padding: "0 10px", fontSize: 13 }}>{item.quantity}</span>
                                            <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ padding: "6px 12px", background: "transparent", border: "none", cursor: "pointer" }}>+</button>
                                        </div>

                                        <p style={{ fontSize: 14, fontWeight: 500, minWidth: 70, textAlign: "right" }}>
                                            ${(item.quantity * Number(item.product?.price ?? 0)).toFixed(2)}
                                        </p>

                                        <Trash2 size={16} className="icon-btn" style={{ color: COLORS.sage }} onClick={() => removeItem(item.id)} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* SUMMARY */}
                    <div>
                        <div style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: 24, position: "sticky", top: 24 }}>
                            <h2 className="voice" style={{ fontSize: 19, fontWeight: 500, marginBottom: 18 }}>Order summary</h2>
                            <div className="flex items-center justify-between" style={{ fontSize: 14, marginBottom: 10 }}>
                                <span style={{ color: COLORS.sage }}>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between" style={{ fontSize: 14, marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid rgba(15,13,11,0.1)" }}>
                                <span style={{ color: COLORS.sage }}>Shipping</span>
                                <span style={{ color: COLORS.sage }}>Calculated at checkout</span>
                            </div>
                            <div className="flex items-center justify-between" style={{ fontSize: 16, fontWeight: 500, marginBottom: 22 }}>
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <Link
                                href="/checkout"
                                className="flex items-center justify-center"
                                style={{ gap: 8, background: COLORS.sienna, color: COLORS.bgLight, padding: "13px 0", borderRadius: 2, fontSize: 14, fontWeight: 500, textDecoration: "none" }}
                            >
                                Proceed to checkout <ArrowRight size={15} />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
