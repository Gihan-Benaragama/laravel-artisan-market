import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { ChevronLeft, CreditCard } from "lucide-react";
import Navbar from "../../Components/Navbar";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F2EAE0",
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#0F0D0B",
};

const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    fontSize: 14,
    border: "1px solid rgba(15,13,11,0.15)",
    borderRadius: 2,
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    marginTop: 4,
};

const labelStyle = { fontSize: 13, fontWeight: 500, color: COLORS.ink };

export default function CheckoutIndex({ cart }) {
    const items = cart?.items ?? [];
    const subtotal = items.reduce((sum, i) => sum + i.quantity * Number(i.product?.price ?? 0), 0);
    const shipping = 10.00; // Flat shipping rate
    const total = subtotal + shipping;

    const { data, setData, post, processing, errors } = useForm({
        shipping_name: "",
        shipping_address: "",
        shipping_city: "",
        shipping_postal_code: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/checkout");
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bgLight, color: COLORS.ink, minHeight: "100vh" }}>
            <Head title="Checkout — Aterlier" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
                .voice { font-family: 'Fraunces', serif; }
                input:focus, textarea:focus { border-color: ${COLORS.sienna} !important; }
                .btn-submit { transition: opacity 0.25s ease; cursor: pointer; width: 100%; border: none; }
                .btn-submit:hover { opacity: 0.88; }
            `}</style>

            <Navbar />

            <div style={{ padding: "2.5rem 3rem 1rem" }}>
                <Link href="/cart" className="flex items-center" style={{ gap: 6, fontSize: 13, color: COLORS.sage, textDecoration: "none", width: "fit-content", marginBottom: 20 }}>
                    <ChevronLeft size={15} /> Back to cart
                </Link>
                <h1 className="voice" style={{ fontSize: 34, fontWeight: 500 }}>Checkout</h1>
            </div>

            <div className="grid grid-cols-5" style={{ gap: 50, padding: "1rem 3rem 5rem" }}>
                {/* SHIPPING INFORMATION FORM */}
                <div style={{ gridColumn: "span 3" }}>
                    <div style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: 32 }}>
                        <h2 className="voice" style={{ fontSize: 22, fontWeight: 500, marginBottom: 24 }}>Shipping Details</h2>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 20 }}>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input
                                    type="text"
                                    value={data.shipping_name}
                                    onChange={e => setData("shipping_name", e.target.value)}
                                    placeholder="e.g. Jane Doe"
                                    style={inputStyle}
                                />
                                {errors.shipping_name && <p style={{ color: COLORS.sienna, fontSize: 12, marginTop: 4 }}>{errors.shipping_name}</p>}
                            </div>

                            <div>
                                <label style={labelStyle}>Address</label>
                                <input
                                    type="text"
                                    value={data.shipping_address}
                                    onChange={e => setData("shipping_address", e.target.value)}
                                    placeholder="Street Address, Apartment, Suite"
                                    style={inputStyle}
                                />
                                {errors.shipping_address && <p style={{ color: COLORS.sienna, fontSize: 12, marginTop: 4 }}>{errors.shipping_address}</p>}
                            </div>

                            <div className="grid grid-cols-2" style={{ gap: 16 }}>
                                <div>
                                    <label style={labelStyle}>City</label>
                                    <input
                                        type="text"
                                        value={data.shipping_city}
                                        onChange={e => setData("shipping_city", e.target.value)}
                                        placeholder="City Name"
                                        style={inputStyle}
                                    />
                                    {errors.shipping_city && <p style={{ color: COLORS.sienna, fontSize: 12, marginTop: 4 }}>{errors.shipping_city}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle}>Postal Code / ZIP</label>
                                    <input
                                        type="text"
                                        value={data.shipping_postal_code}
                                        onChange={e => setData("shipping_postal_code", e.target.value)}
                                        placeholder="10001"
                                        style={inputStyle}
                                    />
                                    {errors.shipping_postal_code && <p style={{ color: COLORS.sienna, fontSize: 12, marginTop: 4 }}>{errors.shipping_postal_code}</p>}
                                </div>
                            </div>

                            <div style={{ marginTop: 10, paddingTop: 20, borderTop: "1px solid rgba(15,13,11,0.1)" }}>
                                <h3 className="voice" style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>Payment Method</h3>
                                <div style={{ background: "rgba(124,132,113,0.06)", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: "16px 20px", display: "flex", items: "center", gap: 12 }}>
                                    <CreditCard size={20} style={{ color: COLORS.sage }} />
                                    <div>
                                        <p style={{ fontSize: 13.5, fontWeight: 500 }}>Payment on Delivery / Simple Demo Gateway</p>
                                        <p style={{ fontSize: 12, color: COLORS.sage }}>No payment information required for this demo application.</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-submit"
                                style={{
                                    background: COLORS.sienna,
                                    color: COLORS.bgLight,
                                    padding: "14px 0",
                                    borderRadius: 2,
                                    fontSize: 14.5,
                                    fontWeight: 500,
                                    marginTop: 10,
                                }}
                            >
                                {processing ? "Processing Order..." : `Place Order • $${total.toFixed(2)}`}
                            </button>
                        </form>
                    </div>
                </div>

                {/* ORDER SUMMARY */}
                <div style={{ gridColumn: "span 2" }}>
                    <div style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: 24, position: "sticky", top: 24 }}>
                        <h2 className="voice" style={{ fontSize: 20, fontWeight: 500, marginBottom: 18 }}>Order summary</h2>
                        
                        <div className="flex flex-col" style={{ gap: 16, marginBottom: 20, maxHeight: 300, overflowY: "auto" }}>
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center" style={{ gap: 12 }}>
                                    <div style={{ width: 50, height: 50, borderRadius: 2, flexShrink: 0, background: `linear-gradient(200deg, ${COLORS.sienna}22, ${COLORS.sage}33)` }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 2 }}>{item.product?.name}</p>
                                        <p style={{ fontSize: 12, color: COLORS.sage }}>{item.quantity} × ${Number(item.product?.price ?? 0).toFixed(2)}</p>
                                    </div>
                                    <p style={{ fontSize: 13.5, fontWeight: 500 }}>
                                        ${(item.quantity * Number(item.product?.price ?? 0)).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: "1px solid rgba(15,13,11,0.1)", paddingTop: 16 }}>
                            <div className="flex items-center justify-between" style={{ fontSize: 13.5, marginBottom: 10 }}>
                                <span style={{ color: COLORS.sage }}>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between" style={{ fontSize: 13.5, marginBottom: 18 }}>
                                <span style={{ color: COLORS.sage }}>Shipping</span>
                                <span>${shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between" style={{ fontSize: 16, fontWeight: 500 }}>
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
