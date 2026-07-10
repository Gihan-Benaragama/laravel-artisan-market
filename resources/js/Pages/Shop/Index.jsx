import React, { useEffect, useRef, useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Search, SlidersHorizontal } from "lucide-react";
import Navbar from "../../Components/Navbar";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F2EAE0",
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#0F0D0B",
};

function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    obs.unobserve(el);
                }
            },
            { threshold: 0.1 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

export default function ShopIndex({ products, categories, filters }) {
    const [search, setSearch] = useState(filters?.search || "");
    const [gridRef, gridVisible] = useReveal();

    const applyFilter = (params) => {
        router.get("/shop", { ...filters, ...params }, { preserveState: true, replace: true });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilter({ search });
    };

    const productList = products?.data ?? [];

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bgLight, color: COLORS.ink, minHeight: "100vh" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
        .voice { font-family: 'Fraunces', serif; }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal { animation: riseIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .card-hover { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        .card-hover:hover { transform: translateY(-5px); }
        .pill { transition: all 0.3s ease; cursor: pointer; }
      `}</style>

            {/* NAV */}
            <Navbar />

            {/* HEADER */}
            <div style={{ padding: "3.5rem 3rem 2rem", background: COLORS.bg, color: COLORS.bgLight }}>
                <p style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.brass, marginBottom: 12 }}>
                    The full collection
                </p>
                <h1 className="voice" style={{ fontSize: 42, fontWeight: 500, marginBottom: 28 }}>
                    Shop every studio
                </h1>

                {/* SEARCH */}
                <form onSubmit={handleSearchSubmit} className="flex items-center" style={{ maxWidth: 420, gap: 10 }}>
                    <div className="flex items-center" style={{ flex: 1, background: "rgba(242,234,224,0.08)", border: "1px solid rgba(242,234,224,0.2)", borderRadius: 2, padding: "10px 14px" }}>
                        <Search size={16} style={{ opacity: 0.6, marginRight: 10 }} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search handmade pieces..."
                            style={{ background: "transparent", border: "none", outline: "none", color: COLORS.bgLight, fontSize: 14, width: "100%" }}
                        />
                    </div>
                    <button type="submit" style={{ background: COLORS.sienna, color: COLORS.bgLight, border: "none", padding: "11px 20px", fontSize: 14, borderRadius: 2, cursor: "pointer" }}>
                        Search
                    </button>
                </form>
            </div>

            {/* CATEGORY PILLS */}
            <div className="flex items-center" style={{ padding: "1.75rem 3rem", gap: 10, flexWrap: "wrap", borderBottom: "1px solid rgba(15,13,11,0.08)" }}>
                <SlidersHorizontal size={15} style={{ color: COLORS.sage, marginRight: 6 }} />
                <span
                    className="pill"
                    onClick={() => applyFilter({ category: null })}
                    style={{
                        padding: "7px 16px",
                        borderRadius: 20,
                        fontSize: 13,
                        background: !filters?.category ? COLORS.sienna : "rgba(15,13,11,0.06)",
                        color: !filters?.category ? COLORS.bgLight : COLORS.ink,
                    }}
                >
                    All
                </span>
                {categories?.map((cat) => (
                    <span
                        key={cat.id}
                        className="pill"
                        onClick={() => applyFilter({ category: cat.slug })}
                        style={{
                            padding: "7px 16px",
                            borderRadius: 20,
                            fontSize: 13,
                            background: filters?.category === cat.slug ? COLORS.sienna : "rgba(15,13,11,0.06)",
                            color: filters?.category === cat.slug ? COLORS.bgLight : COLORS.ink,
                        }}
                    >
                        {cat.name}
                    </span>
                ))}
            </div>

            {/* PRODUCT GRID */}
            <div ref={gridRef} style={{ padding: "2.5rem 3rem 5rem" }}>
                {productList.length === 0 ? (
                    <p style={{ color: COLORS.sage, fontSize: 15 }}>No pieces found. Try a different search or category.</p>
                ) : (
                    <div className="grid grid-cols-3" style={{ gap: 28 }}>
                        {productList.map((p, i) => (
                            <Link
                                href={`/shop/${p.slug}`}
                                key={p.id}
                                className={gridVisible ? "reveal card-hover" : "card-hover"}
                                style={{ animationDelay: gridVisible ? `${(i % 6) * 0.07}s` : "0s", opacity: gridVisible ? undefined : 0, textDecoration: "none", color: COLORS.ink }}
                            >
                                <div style={{ height: 230, borderRadius: 4, marginBottom: 12, overflow: "hidden", background: `linear-gradient(200deg, ${COLORS.sienna}22, ${COLORS.sage}33)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {p.image ? (
                                        <img src={`/storage/${p.image}`} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : null}
                                </div>
                                <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 3 }}>{p.name}</p>
                                <p style={{ fontSize: 12.5, color: COLORS.sage, marginBottom: 5 }}>{p.shop?.name}</p>
                                <p style={{ fontSize: 14, color: COLORS.sienna, fontWeight: 500 }}>${Number(p.price).toFixed(2)}</p>
                            </Link>
                        ))}
                    </div>
                )}

                {/* PAGINATION */}
                {products?.links && (
                    <div className="flex items-center justify-center" style={{ gap: 8, marginTop: 48 }}>
                        {products.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                style={{
                                    padding: "8px 14px",
                                    fontSize: 13,
                                    borderRadius: 2,
                                    border: "1px solid rgba(15,13,11,0.15)",
                                    background: link.active ? COLORS.sienna : "transparent",
                                    color: link.active ? COLORS.bgLight : COLORS.ink,
                                    cursor: link.url ? "pointer" : "default",
                                    opacity: link.url ? 1 : 0.35,
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
