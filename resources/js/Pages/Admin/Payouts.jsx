import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Check, Clock, DollarSign, ArrowLeft } from "lucide-react";
import AdminNavbar from "../../Components/AdminNavbar";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F2EAE0",
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#0F0D0B",
};

export default function AdminPayouts({ payouts = [] }) {
    const markAsPaid = (id) => {
        if (confirm("Mark this payout request as paid?")) {
            router.patch(`/admin/payouts/${id}`, {}, { preserveScroll: true });
        }
    };

    const pending = payouts.filter(p => p.status === "pending");
    const completed = payouts.filter(p => p.status === "paid");

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bgLight, color: COLORS.ink, minHeight: "100vh" }}>
            <Head title="Admin Payout Requests — Aterlier" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600&family=Inter:wght@400;500;600&display=swap');
                .voice { font-family: 'Fraunces', serif; }
                .btn { transition: opacity 0.2s ease; cursor: pointer; border: none; }
                .btn:hover { opacity: 0.8; }
            `}</style>

            <AdminNavbar />

            <div style={{ padding: "2.5rem 3rem 1.5rem" }}>
                <Link href="/admin" className="flex items-center" style={{ gap: 6, fontSize: 13, color: COLORS.sage, textDecoration: "none", width: "fit-content", marginBottom: 20 }}>
                    <ArrowLeft size={15} /> Back to Admin Dashboard
                </Link>
                <p style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.brass, marginBottom: 10 }}>
                    Admin panel
                  </p>
                <h1 className="voice" style={{ fontSize: 34, fontWeight: 500 }}>Payout Requests</h1>
            </div>

            <div style={{ padding: "0 3rem 5rem" }}>
                {/* PENDING PAYOUTS */}
                <h2 className="voice" style={{ fontSize: 20, fontWeight: 500, marginBottom: 16 }}>
                    Pending Requests ({pending.length})
                </h2>

                {pending.length === 0 ? (
                    <p style={{ fontSize: 14.5, color: COLORS.sage, marginBottom: 40 }}>No pending payout requests.</p>
                ) : (
                    <div className="flex flex-col" style={{ gap: 12, marginBottom: 44 }}>
                        {pending.map((p) => (
                            <div key={p.id} className="flex items-center justify-between" style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: "18px 24px" }}>
                                <div>
                                    <div className="flex items-center" style={{ gap: 10, marginBottom: 4 }}>
                                        <p style={{ fontSize: 16, fontWeight: 600, color: COLORS.sienna }}>${Number(p.amount).toFixed(2)}</p>
                                        <span style={{ fontSize: 12, display: "flex", items: "center", gap: 4, background: "rgba(168,138,91,0.12)", color: COLORS.brass, padding: "3px 8px", borderRadius: 10 }}>
                                            <Clock size={11} /> Pending
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 13.5, color: COLORS.ink, fontWeight: 500 }}>
                                        {p.vendor?.shop?.name ?? "Unnamed Studio"}
                                    </p>
                                    <p style={{ fontSize: 12.5, color: COLORS.sage }}>
                                        Requested by {p.vendor?.user?.name} ({p.vendor?.user?.email}) on {new Date(p.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    className="btn flex items-center"
                                    onClick={() => markAsPaid(p.id)}
                                    style={{ gap: 6, background: COLORS.sage, color: COLORS.bgLight, padding: "10px 18px", fontSize: 13, borderRadius: 2 }}
                                >
                                    <Check size={14} /> Mark as Paid
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* COMPLETED PAYOUTS */}
                <h2 className="voice" style={{ fontSize: 20, fontWeight: 500, marginBottom: 16 }}>
                    Paid History ({completed.length})
                </h2>

                {completed.length === 0 ? (
                    <p style={{ fontSize: 14.5, color: COLORS.sage }}>No completed payouts yet.</p>
                ) : (
                    <div style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid rgba(15,13,11,0.08)", textAlign: "left" }}>
                                    <th style={{ padding: "14px 20px", fontSize: 12, color: COLORS.sage, textTransform: "uppercase" }}>Studio</th>
                                    <th style={{ padding: "14px 20px", fontSize: 12, color: COLORS.sage, textTransform: "uppercase" }}>Amount Paid</th>
                                    <th style={{ padding: "14px 20px", fontSize: 12, color: COLORS.sage, textTransform: "uppercase" }}>Date Paid</th>
                                    <th style={{ padding: "14px 20px", fontSize: 12, color: COLORS.sage, textTransform: "uppercase" }}>Recipient</th>
                                </tr>
                            </thead>
                            <tbody>
                                {completed.map((p) => (
                                    <tr key={p.id} style={{ borderBottom: "1px solid rgba(15,13,11,0.06)" }}>
                                        <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 500 }}>{p.vendor?.shop?.name ?? "—"}</td>
                                        <td style={{ padding: "16px 20px", fontSize: 14, color: COLORS.sienna, fontWeight: 600 }}>${Number(p.amount).toFixed(2)}</td>
                                        <td style={{ padding: "16px 20px", fontSize: 14, color: COLORS.sage }}>{new Date(p.updated_at).toLocaleDateString()}</td>
                                        <td style={{ padding: "16px 20px", fontSize: 13.5, color: COLORS.sage }}>{p.vendor?.user?.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
