import React, { useEffect, useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Search, ArrowRight } from "lucide-react";
import Navbar from "../Components/Navbar";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F2EAE0",
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#0F0D0B",
};

function ThreadDivider() {
    return (
        <div className="w-full flex items-center justify-center" style={{ padding: "2.5rem 0" }}>
            <svg width="100%" height="24" viewBox="0 0 1200 24" preserveAspectRatio="none" style={{ maxWidth: 1100 }}>
                <line x1="0" y1="12" x2="1200" y2="12" stroke={COLORS.sienna} strokeWidth="1.5" strokeDasharray="10 10" strokeLinecap="round" />
                <circle cx="600" cy="12" r="4" fill={COLORS.sienna} />
            </svg>
        </div>
    );
}

export default function ArtisanMarketplaceHome({ makers = [], products = [] }) {
    const [heroLoaded, setHeroLoaded] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setHeroLoaded(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bgLight, color: COLORS.ink }}>
            <Head title="Aterlier — Handmade, sold direct" />
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
        .voice { font-family: 'Fraunces', serif; }
        @keyframes riseIn { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        .reveal { animation: riseIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .card-hover { transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
        .card-hover:hover { transform: translateY(-6px); }
      `}</style>

            {/* NAV */}
            <Navbar />

            {/* HERO */}
            <div
                className="relative w-full flex items-center"
                style={{
                    height: "86vh",
                    minHeight: 560,
                    background: `linear-gradient(180deg, rgba(15,13,11,0.15) 0%, rgba(15,13,11,0.75) 100%), url('https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1800&auto=format&fit=crop') center/cover no-repeat`,
                }}
            >
                <div style={{ padding: "0 3rem", maxWidth: 640, color: COLORS.bgLight, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0)" : "translateY(24px)", transition: "opacity 1.1s cubic-bezier(0.22,1,0.36,1), transform 1.1s cubic-bezier(0.22,1,0.36,1)" }}>
                    <p style={{ fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: COLORS.brass, marginBottom: 18 }}>
                        Made by hand, not by machine
                    </p>
                    <h1 className="voice" style={{ fontSize: 56, lineHeight: 1.08, fontWeight: 500, marginBottom: 22 }}>
                        Every object carries the maker's hand.
                    </h1>
                    <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(242,234,224,0.85)", marginBottom: 32, maxWidth: 480 }}>
                        A marketplace for independent artisans — ceramics, textiles, and woodwork, sold directly from the studios that make them.
                    </p>
                    <Link href="/shop" className="flex items-center" style={{ gap: 10, background: COLORS.sienna, color: COLORS.bgLight, border: "none", padding: "13px 26px", fontSize: 14, fontWeight: 500, borderRadius: 2, textDecoration: "none", width: "fit-content" }}>
                        Explore the studios <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            <ThreadDivider />

            {/* FEATURED MAKERS */}
            <div style={{ padding: "1rem 3rem 3rem" }}>
                <div className="flex items-end justify-between" style={{ marginBottom: 36 }}>
                    <div>
                        <p style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.sage, marginBottom: 8 }}>Featured studios</p>
                        <h2 className="voice" style={{ fontSize: 32, fontWeight: 500 }}>Meet the makers</h2>
                    </div>
                    <Link href="/shop" style={{ fontSize: 14, color: COLORS.sienna, textDecoration: "none" }}>View all studios →</Link>
                </div>

                {makers.length === 0 ? (
                    <p style={{ color: COLORS.sage, fontSize: 14 }}>No approved studios yet — check back soon.</p>
                ) : (
                    <div className="grid grid-cols-3 reveal" style={{ gap: 24 }}>
                        {makers.map((m) => (
                            <div key={m.id} className="card-hover" style={{ background: "#fff", borderRadius: 4, overflow: "hidden", border: "1px solid rgba(15,13,11,0.08)" }}>
                                <div style={{ height: 180, background: `linear-gradient(160deg, ${COLORS.sage}55, ${COLORS.brass}55)` }} />
                                <div style={{ padding: "18px 20px" }}>
                                    <h3 className="voice" style={{ fontSize: 19, fontWeight: 500, marginBottom: 4 }}>{m.shop?.name ?? "Unnamed Studio"}</h3>
                                    <p style={{ fontSize: 13, color: COLORS.sage, marginBottom: 10 }}>{m.shop?.description ?? ""}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ThreadDivider />

            {/* PRODUCT GRID */}
            <div style={{ padding: "1rem 3rem 5rem" }}>
                <div style={{ marginBottom: 36 }}>
                    <p style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.sage, marginBottom: 8 }}>New this week</p>
                    <h2 className="voice" style={{ fontSize: 32, fontWeight: 500 }}>Fresh from the studios</h2>
                </div>

                {products.length === 0 ? (
                    <p style={{ color: COLORS.sage, fontSize: 14 }}>No products yet.</p>
                ) : (
                    <div className="grid grid-cols-3 reveal" style={{ gap: 24 }}>
                        {products.map((p) => (
                            <Link href={`/shop/${p.slug}`} key={p.id} className="card-hover" style={{ textDecoration: "none", color: COLORS.ink }}>
                                <div style={{ height: 220, borderRadius: 4, marginBottom: 12, overflow: "hidden", background: `linear-gradient(200deg, ${COLORS.sienna}22, ${COLORS.sage}33)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {p.image ? <img src={`/storage/${p.image}`} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                                </div>
                                <p style={{ fontSize: 14.5, fontWeight: 500, marginBottom: 2 }}>{p.name}</p>
                                <p style={{ fontSize: 12.5, color: COLORS.sage, marginBottom: 4 }}>{p.shop?.name}</p>
                                <p style={{ fontSize: 14, color: COLORS.sienna, fontWeight: 500 }}>${Number(p.price).toFixed(2)}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <div style={{ background: COLORS.bg, color: "rgba(242,234,224,0.65)", padding: "2.5rem 3rem", fontSize: 13 }}>
                <div className="flex items-center justify-between">
                    <span className="voice" style={{ fontSize: 17, color: COLORS.bgLight }}>Aterlier</span>
                    <span>Handmade, sold direct. No factories, no middlemen.</span>
                </div>
            </div>
        </div>
    );
}
