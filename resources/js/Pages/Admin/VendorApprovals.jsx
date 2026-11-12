import React from "react";
import { Link, router } from "@inertiajs/react";
import { Check, X, Clock, ChevronLeft } from "lucide-react";
import AdminNavbar from "../../Components/AdminNavbar";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F2EAE0",
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#0F0D0B",
};

function StatusBadge({ status }) {
    const map = {
        pending: { bg: "rgba(168,138,91,0.15)", color: COLORS.brass, icon: Clock },
        approved: { bg: "rgba(124,132,113,0.18)", color: "#4a5540", icon: Check },
        rejected: { bg: "rgba(181,86,60,0.12)", color: COLORS.sienna, icon: X },
    };
    const s = map[status] ?? map.pending;
    const Icon = s.icon;
    return (
        <span className="flex items-center" style={{ gap: 5, fontSize: 12, padding: "4px 10px", borderRadius: 20, background: s.bg, color: s.color, textTransform: "capitalize", width: "fit-content" }}>
            <Icon size={12} /> {status}
        </span>
    );
}

export default function AdminVendorApprovals({ vendors }) {
    const updateStatus = (vendorId, status) => {
        router.patch(`/admin/vendors/${vendorId}`, { status }, { preserveScroll: true });
    };

    const pending = vendors.filter((v) => v.status === "pending");
    const others = vendors.filter((v) => v.status !== "pending");

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bgLight, color: COLORS.ink, minHeight: "100vh" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600&family=Inter:wght@400;500;600&display=swap');
        .voice { font-family: 'Fraunces', serif; }
        .btn { transition: opacity 0.2s ease; cursor: pointer; }
        .btn:hover { opacity: 0.8; }
      `}</style>

            <AdminNavbar />

            <div style={{ padding: "2.5rem 3rem 1.5rem" }}>
                <Link href="/admin" className="flex items-center" style={{ gap: 6, fontSize: 13, color: COLORS.sage, textDecoration: "none", width: "fit-content", marginBottom: 20 }}>
                    <ChevronLeft size={15} /> Back to Admin Dashboard
                </Link>
                <p style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.brass, marginBottom: 10 }}>
                    Admin
                </p>
                <h1 className="voice" style={{ fontSize: 34, fontWeight: 500 }}>Vendor applications</h1>
            </div>

            <div style={{ padding: "0 3rem 5rem" }}>
                <h2 className="voice" style={{ fontSize: 20, fontWeight: 500, marginBottom: 14 }}>
                    Pending review ({pending.length})
                </h2>

                {pending.length === 0 ? (
                    <p style={{ fontSize: 14, color: COLORS.sage, marginBottom: 40 }}>No applications waiting on review.</p>
                ) : (
                    <div className="flex flex-col" style={{ gap: 10, marginBottom: 44 }}>
                        {pending.map((v) => (
                            <div key={v.id} className="flex items-center justify-between" style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: "16px 20px" }}>
                                <div>
                                    <p style={{ fontSize: 14.5, fontWeight: 500 }}>{v.shop?.name ?? "(no studio name yet)"}</p>
                                    <p style={{ fontSize: 13, color: COLORS.sage }}>{v.user?.name} · {v.user?.email}</p>
                                </div>
                                <div className="flex items-center" style={{ gap: 10 }}>
                                    <button
                                        className="btn flex items-center"
                                        onClick={() => updateStatus(v.id, "approved")}
                                        style={{ gap: 6, background: COLORS.sienna, color: COLORS.bgLight, border: "none", padding: "9px 16px", fontSize: 13, borderRadius: 2 }}
                                    >
                                        <Check size={14} /> Approve
                                    </button>
                                    <button
                                        className="btn flex items-center"
                                        onClick={() => updateStatus(v.id, "rejected")}
                                        style={{ gap: 6, background: "transparent", color: COLORS.sage, border: "1px solid rgba(15,13,11,0.15)", padding: "9px 16px", fontSize: 13, borderRadius: 2 }}
                                    >
                                        <X size={14} /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <h2 className="voice" style={{ fontSize: 20, fontWeight: 500, marginBottom: 14 }}>All vendors</h2>
                <div style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(15,13,11,0.08)", textAlign: "left" }}>
                                <th style={{ padding: "12px 20px", fontSize: 12, color: COLORS.sage, textTransform: "uppercase" }}>Studio</th>
                                <th style={{ padding: "12px 20px", fontSize: 12, color: COLORS.sage, textTransform: "uppercase" }}>Owner</th>
                                <th style={{ padding: "12px 20px", fontSize: 12, color: COLORS.sage, textTransform: "uppercase" }}>Status</th>
                                <th style={{ padding: "12px 20px", fontSize: 12, color: COLORS.sage, textTransform: "uppercase" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {others.map((v) => (
                                <tr key={v.id} style={{ borderBottom: "1px solid rgba(15,13,11,0.06)" }}>
                                    <td style={{ padding: "14px 20px", fontSize: 14 }}>{v.shop?.name ?? "—"}</td>
                                    <td style={{ padding: "14px 20px", fontSize: 14, color: COLORS.sage }}>{v.user?.email}</td>
                                    <td style={{ padding: "14px 20px" }}><StatusBadge status={v.status} /></td>
                                    <td style={{ padding: "14px 20px" }}>
                                        {v.status !== "approved" && (
                                            <button className="btn" onClick={() => updateStatus(v.id, "approved")} style={{ fontSize: 12.5, color: COLORS.sienna, background: "none", border: "none" }}>
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}