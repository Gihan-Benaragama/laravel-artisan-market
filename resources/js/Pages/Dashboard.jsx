import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Package, Store, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "../Components/Navbar";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F2EAE0",
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#0F0D0B",
};

export default function Dashboard({ vendor, orders }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const applyAsVendor = () => {
        router.post("/vendor/apply", {}, { preserveScroll: true });
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bgLight, color: COLORS.ink, minHeight: "100vh" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
        .voice { font-family: 'Fraunces', serif; }
        @keyframes riseIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .reveal { animation: riseIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .btn-primary { transition: opacity 0.25s ease; cursor: pointer; }
        .btn-primary:hover { opacity: 0.88; }
      `}</style>

            <Navbar />

            <div style={{ padding: "3rem 3rem 1rem" }}>
                <p style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.brass, marginBottom: 10 }}>
                    Welcome back
                </p>
                <h1 className="voice" style={{ fontSize: 34, fontWeight: 500 }}>{user?.name}</h1>
            </div>

            <div className="grid grid-cols-3 reveal" style={{ gap: 28, padding: "2rem 3rem 5rem" }}>
                {/* VENDOR STATUS CARD */}
                <div style={{ gridColumn: "span 1", background: COLORS.bg, color: COLORS.bgLight, borderRadius: 4, padding: 28 }}>
                    {!vendor && (
                        <>
                            <Store size={22} style={{ color: COLORS.brass, marginBottom: 14 }} />
                            <h3 className="voice" style={{ fontSize: 19, fontWeight: 500, marginBottom: 10 }}>Sell your craft</h3>
                            <p style={{ fontSize: 13.5, color: "rgba(242,234,224,0.75)", lineHeight: 1.6, marginBottom: 20 }}>
                                Open your own studio on Aterlier and reach customers looking for handmade work.
                            </p>
                            <button
                                onClick={applyAsVendor}
                                className="btn-primary flex items-center"
                                style={{ gap: 8, background: COLORS.sienna, color: COLORS.bgLight, border: "none", padding: "11px 20px", fontSize: 13.5, borderRadius: 2 }}
                            >
                                Become a vendor <ArrowRight size={14} />
                            </button>
                        </>
                    )}

                    {vendor && vendor.status === "pending" && (
                        <>
                            <Clock size={22} style={{ color: COLORS.brass, marginBottom: 14 }} />
                            <h3 className="voice" style={{ fontSize: 19, fontWeight: 500, marginBottom: 10 }}>Application pending</h3>
                            <p style={{ fontSize: 13.5, color: "rgba(242,234,224,0.75)", lineHeight: 1.6 }}>
                                We're reviewing your vendor application. This usually takes 1-2 days.
                            </p>
                        </>
                    )}

                    {vendor && vendor.status === "approved" && (
                        <>
                            <CheckCircle2 size={22} style={{ color: COLORS.brass, marginBottom: 14 }} />
                            <h3 className="voice" style={{ fontSize: 19, fontWeight: 500, marginBottom: 10 }}>Your studio is live</h3>
                            <p style={{ fontSize: 13.5, color: "rgba(242,234,224,0.75)", lineHeight: 1.6, marginBottom: 20 }}>
                                Manage your products, orders, and earnings from your vendor dashboard.
                            </p>
                            <Link
                                href="/vendor/dashboard"
                                className="btn-primary flex items-center"
                                style={{ gap: 8, background: COLORS.sienna, color: COLORS.bgLight, padding: "11px 20px", fontSize: 13.5, borderRadius: 2, textDecoration: "none", width: "fit-content" }}
                            >
                                Go to vendor dashboard <ArrowRight size={14} />
                            </Link>
                        </>
                    )}

                    {vendor && vendor.status === "rejected" && (
                        <>
                            <Store size={22} style={{ color: COLORS.sage, marginBottom: 14 }} />
                            <h3 className="voice" style={{ fontSize: 19, fontWeight: 500, marginBottom: 10 }}>Application not approved</h3>
                            <p style={{ fontSize: 13.5, color: "rgba(242,234,224,0.75)", lineHeight: 1.6 }}>
                                Your vendor application wasn't approved this time. Contact support for details.
                            </p>
                        </>
                    )}
                </div>

                {/* ORDERS */}
                <div style={{ gridColumn: "span 2" }}>
                    <h2 className="voice" style={{ fontSize: 22, fontWeight: 500, marginBottom: 18 }}>Your orders</h2>

                    {(!orders || orders.length === 0) ? (
                        <div style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: 32, textAlign: "center" }}>
                            <Package size={24} style={{ color: COLORS.sage, marginBottom: 12 }} />
                            <p style={{ fontSize: 14, color: COLORS.sage, marginBottom: 16 }}>You haven't placed any orders yet.</p>
                            <Link href="/shop" style={{ fontSize: 13.5, color: COLORS.sienna, textDecoration: "none" }}>Start shopping →</Link>
                        </div>
                    ) : (
                        <div className="flex flex-col" style={{ gap: 12 }}>
                            {orders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between" style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: "16px 20px" }}>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>Order #{order.id}</p>
                                        <p style={{ fontSize: 12.5, color: COLORS.sage }}>{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            padding: "5px 12px",
                                            borderRadius: 20,
                                            textTransform: "capitalize",
                                            background: order.status === "pending" ? "rgba(168,138,91,0.15)" : "rgba(124,132,113,0.15)",
                                            color: order.status === "pending" ? COLORS.brass : COLORS.sage,
                                        }}
                                    >
                                        {order.status}
                                    </span>
                                    <p style={{ fontSize: 14, fontWeight: 500 }}>${Number(order.total).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
