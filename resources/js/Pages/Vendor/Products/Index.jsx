import React from "react";
import { Link, router } from "@inertiajs/react";
import { Plus, Pencil, Trash2, ChevronLeft } from "lucide-react";
import VendorNavbar from "../../../Components/VendorNavbar";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F2EAE0",
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#0F0D0B",
};

export default function VendorProductsIndex({ products }) {
    const deleteProduct = (id) => {
        if (confirm("Delete this product? This can't be undone.")) {
            router.delete(`/vendor/products/${id}`, { preserveScroll: true });
        }
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bgLight, color: COLORS.ink, minHeight: "100vh" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600&family=Inter:wght@400;500;600&display=swap');
        .voice { font-family: 'Fraunces', serif; }
        .icon-btn { transition: opacity 0.2s ease; cursor: pointer; }
        .icon-btn:hover { opacity: 0.6; }
      `}</style>

            <VendorNavbar />

            <div style={{ padding: "2.5rem 3rem 1.5rem" }}>
                <Link href="/vendor/dashboard" className="flex items-center" style={{ gap: 6, fontSize: 13, color: COLORS.sage, textDecoration: "none", width: "fit-content", marginBottom: 20 }}>
                    <ChevronLeft size={15} /> Back to dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <p style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.brass, marginBottom: 10 }}>
                            Your studio
                        </p>
                        <h1 className="voice" style={{ fontSize: 34, fontWeight: 500 }}>Products</h1>
                    </div>
                    <Link
                        href="/vendor/products/create"
                        className="flex items-center"
                        style={{ gap: 8, background: COLORS.sienna, color: COLORS.bgLight, padding: "12px 22px", borderRadius: 2, fontSize: 14, fontWeight: 500, textDecoration: "none" }}
                    >
                        <Plus size={16} /> Add product
                    </Link>
                </div>
            </div>

            <div style={{ padding: "0 3rem 5rem" }}>
                {products.length === 0 ? (
                    <div style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: 40, textAlign: "center" }}>
                        <p style={{ fontSize: 15, color: COLORS.sage, marginBottom: 16 }}>You haven't listed any products yet.</p>
                        <Link href="/vendor/products/create" style={{ fontSize: 14, color: COLORS.sienna, textDecoration: "none" }}>
                            Add your first product →
                        </Link>
                    </div>
                ) : (
                    <div style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid rgba(15,13,11,0.08)", textAlign: "left" }}>
                                    <th style={{ padding: "14px 20px", fontSize: 12.5, color: COLORS.sage, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Product</th>
                                    <th style={{ padding: "14px 20px", fontSize: 12.5, color: COLORS.sage, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Price</th>
                                    <th style={{ padding: "14px 20px", fontSize: 12.5, color: COLORS.sage, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Stock</th>
                                    <th style={{ padding: "14px 20px", fontSize: 12.5, color: COLORS.sage, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.id} style={{ borderBottom: "1px solid rgba(15,13,11,0.06)" }}>
                                        <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 500 }}>{p.name}</td>
                                        <td style={{ padding: "16px 20px", fontSize: 14, color: COLORS.sienna }}>${Number(p.price).toFixed(2)}</td>
                                        <td style={{ padding: "16px 20px", fontSize: 14 }}>
                                            {p.stock > 0 ? p.stock : <span style={{ color: COLORS.sienna }}>Out of stock</span>}
                                        </td>
                                        <td style={{ padding: "16px 20px" }}>
                                            <div className="flex items-center" style={{ gap: 16, justifyContent: "flex-end" }}>
                                                <Link href={`/vendor/products/${p.id}/edit`}>
                                                    <Pencil size={16} className="icon-btn" style={{ color: COLORS.sage }} />
                                                </Link>
                                                <Trash2 size={16} className="icon-btn" style={{ color: COLORS.sage }} onClick={() => deleteProduct(p.id)} />
                                            </div>
                                        </td>
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
