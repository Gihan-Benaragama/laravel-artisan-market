import React from "react";
import { Link, usePage, router } from "@inertiajs/react";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F2EAE0",
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#0F0D0B",
};

export default function VendorNavbar() {
    const { url } = usePage();

    const isActive = (path, exact = false) => {
        if (exact) return url === path;
        return url.startsWith(path);
    };

    const navLink = (href, label, exact = false) => {
        const active = isActive(href, exact);
        return (
            <Link
                href={href}
                style={{
                    color: active ? COLORS.brass : "#ffffff",
                    fontWeight: active ? 600 : 400,
                    opacity: active ? 1 : 0.8,
                    textDecoration: "none",
                    fontSize: 14,
                    paddingBottom: 4,
                    borderBottom: active ? `2px solid ${COLORS.brass}` : "2px solid transparent",
                    transition: "color 0.2s, border-color 0.2s, opacity 0.2s",
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
                padding: "1.25rem 3rem",
                background: COLORS.bg,
                color: "#ffffff",
                position: "sticky",
                top: 0,
                zIndex: 100,
                boxSizing: "border-box",
                borderBottom: "1px solid rgba(242,234,224,0.08)",
            }}
        >
            {/* LOGO */}
            <Link
                href="/"
                style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 22,
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "#ffffff",
                    letterSpacing: "-0.01em",
                }}
            >
                Aterlier
            </Link>

            {/* VENDOR LINKS */}
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                {navLink("/vendor/dashboard", "Overview")}
                {navLink("/vendor/products", "Products")}
                {navLink("/vendor/shop/edit", "Shop Settings")}
                {navLink("/dashboard", "My Account")}
                <button
                    onClick={() => router.post("/logout")}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#ffffff",
                        opacity: 0.8,
                        cursor: "pointer",
                        fontSize: 14,
                        padding: 0,
                        transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = 1)}
                    onMouseLeave={(e) => (e.target.style.opacity = 0.8)}
                >
                    Log out
                </button>
            </div>
        </nav>
    );
}
