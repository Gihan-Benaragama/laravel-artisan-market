import React from "react";
import { Head, Link } from "@inertiajs/react";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "../../Components/Navbar";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F2EAE0",
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#0F0D0B",
};

export default function CheckoutSuccess({ order }) {
    const total = Number(order?.total ?? 0);
    const subOrders = order?.sub_orders ?? [];

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bgLight, color: COLORS.ink, minHeight: "100vh" }}>
            <Head title="Order Successful — Aterlier" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
                .voice { font-family: 'Fraunces', serif; }
                .btn-action { transition: opacity 0.25s ease; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; font-weight: 500; border-radius: 2px; }
                .btn-action:hover { opacity: 0.88; }
            `}</style>

            <Navbar />

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 2rem", textAlign: "center" }}>
                <CheckCircle size={56} style={{ color: COLORS.sage, marginBottom: 20 }} />
                <p style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.brass, marginBottom: 8 }}>
                    Thank you for your order
                </p>
                <h1 className="voice" style={{ fontSize: 38, fontWeight: 500, marginBottom: 12 }}>
                    Your purchase is complete
                </h1>
                <p style={{ fontSize: 15, color: COLORS.sage, maxWidth: 520, lineHeight: 1.6, marginBottom: 32 }}>
                    Your order #{order?.id} has been placed. We've notified the independent artisans, and they will begin preparing your handcrafted items.
                </p>

                {/* ORDER DETAIL BOX */}
                <div style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, width: "100%", maxWidth: 580, padding: 32, textAlign: "left", marginBottom: 40 }}>
                    <h3 className="voice" style={{ fontSize: 19, fontWeight: 500, marginBottom: 18, borderBottom: "1px solid rgba(15,13,11,0.1)", paddingBottom: 12 }}>
                        Order Summary
                    </h3>

                    {/* ITEMS LIST */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                        {subOrders.map((so) => (
                            <div key={so.id}>
                                <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: COLORS.sienna, fontWeight: 600, marginBottom: 8 }}>
                                    Studio shipment #{so.id}
                                </p>
                                {so.items?.map((item) => (
                                    <div key={item.id} style={{ display: "flex", justifyContent: "between", alignItems: "center", fontSize: 14, marginBottom: 6 }}>
                                        <span style={{ flex: 1, color: COLORS.ink }}>
                                            {item.product?.name} <span style={{ color: COLORS.sage }}>({item.quantity}x)</span>
                                        </span>
                                        <span style={{ fontWeight: 500 }}>
                                            ${(item.quantity * Number(item.price)).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: "1px solid rgba(15,13,11,0.1)", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <p style={{ fontSize: 13, color: COLORS.sage }}>Shipped to</p>
                            <p style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{order?.shipping_name}</p>
                            <p style={{ fontSize: 13, color: COLORS.sage, marginTop: 1 }}>{order?.shipping_address}, {order?.shipping_city}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: 13, color: COLORS.sage }}>Amount Paid</p>
                            <p style={{ fontSize: 20, fontWeight: 600, color: COLORS.sienna, marginTop: 2 }}>${total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div style={{ display: "flex", gap: 16 }}>
                    <Link
                        href="/shop"
                        className="btn-action"
                        style={{ border: `1px solid ${COLORS.sienna}`, color: COLORS.sienna, padding: "12px 24px" }}
                    >
                        Back to shop
                    </Link>
                    <Link
                        href="/dashboard"
                        className="btn-action"
                        style={{ background: COLORS.sienna, color: COLORS.bgLight, padding: "12px 24px" }}
                    >
                        Go to Dashboard <ArrowRight size={15} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
