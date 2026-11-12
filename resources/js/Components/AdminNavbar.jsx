import React from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { ShieldCheck, LogOut, ExternalLink, User } from "lucide-react";

const COLORS = {
    bg: "#12100E",
    sienna: "#C86D51",
    sage: "#7C8471",
    brass: "#D4AF37",
    ink: "#0F0D0B",
    cream: "#F8F5F0",
};

export default function AdminNavbar() {
    const { url, props } = usePage();
    const user = props?.auth?.user;

    const isActive = (path, exact = false) => {
        if (exact) return url === path;
        if (path === "/admin") return url === "/admin" || url === "/admin/dashboard";
        return url.startsWith(path);
    };

    const navLink = (href, label, exact = false) => {
        const active = isActive(href, exact);
        return (
            <Link
                href={href}
                className="relative text-sm tracking-wide font-medium transition-all duration-200"
                style={{
                    color: active ? COLORS.brass : "rgba(255, 255, 255, 0.75)",
                    fontWeight: active ? 600 : 400,
                    textDecoration: "none",
                    paddingBottom: 4,
                    borderBottom: active ? `2px solid ${COLORS.brass}` : "2px solid transparent",
                }}
            >
                {label}
            </Link>
        );
    };

    return (
        <nav
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.1rem 3rem",
                background: COLORS.bg,
                color: "#ffffff",
                position: "sticky",
                top: 0,
                zIndex: 100,
                boxSizing: "border-box",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
            }}
        >
            {/* BRAND LOGO */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Link
                    href="/admin"
                    style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: 22,
                        fontWeight: 500,
                        textDecoration: "none",
                        color: "#ffffff",
                        letterSpacing: "-0.01em",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${COLORS.sienna}, ${COLORS.brass})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                        }}
                    >
                        <ShieldCheck size={18} />
                    </div>
                    <span>Atelier</span>
                    <span
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            color: COLORS.brass,
                            fontWeight: 700,
                            background: "rgba(212,175,55,0.12)",
                            padding: "3px 8px",
                            borderRadius: 4,
                            border: "1px solid rgba(212,175,55,0.25)",
                        }}
                    >
                        Admin
                    </span>
                </Link>
            </div>

            {/* ADMIN NAV LINKS */}
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                {navLink("/admin", "Overview")}
                {navLink("/admin/vendors", "Vendor Approvals")}
                {navLink("/admin/payouts", "Payouts")}
                
                <span style={{ width: 1, height: 18, background: "rgba(255,255,255,0.15)" }} />

                <Link
                    href="/shop"
                    target="_blank"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        color: "rgba(255, 255, 255, 0.65)",
                        fontSize: 13,
                        textDecoration: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)")}
                >
                    <span>Storefront</span>
                    <ExternalLink size={12} />
                </Link>

                <Link
                    href="/dashboard?view=customer"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        color: "rgba(255, 255, 255, 0.65)",
                        fontSize: 13,
                        textDecoration: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)")}
                >
                    <User size={13} />
                    <span>Customer View</span>
                </Link>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 8 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "4px 12px",
                            borderRadius: 20,
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.08)",
                        }}
                    >
                        <div
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#10B981",
                            }}
                        />
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                            {user?.name || "Admin"}
                        </span>
                    </div>

                    <button
                        onClick={() => router.post("/logout")}
                        title="Log Out"
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "rgba(255,255,255,0.6)",
                            cursor: "pointer",
                            fontSize: 13,
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "6px 10px",
                            borderRadius: 6,
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#f87171";
                            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                            e.currentTarget.style.background = "transparent";
                        }}
                    >
                        <LogOut size={14} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
