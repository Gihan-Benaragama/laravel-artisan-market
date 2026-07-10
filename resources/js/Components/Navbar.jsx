import React from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { ShoppingBag } from "lucide-react";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F2EAE0",
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#0F0D0B",
};

export default function Navbar() {
    const { auth } = usePage().props;
    const { url } = usePage();
    const user = auth?.user;

    const isActive = (path, exact = false) => {
        if (exact) return url === path;
        if (path === "/") return url === "/";
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
                    opacity: active ? 1 : 0.85,
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

            {/* LINKS */}
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                {navLink("/", "Home", true)}
                {navLink("/shop", "Shop")}

                {user ? (
                    <>
                        {navLink("/dashboard", "Dashboard")}
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
                    </>
                ) : (
                    <>
                        {navLink("/login", "Log in")}
                        {navLink("/register", "Register")}
                    </>
                )}

                {/* Cart icon */}
                <Link
                    href="/cart"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        paddingBottom: 4,
                        borderBottom: isActive("/cart")
                            ? `2px solid ${COLORS.brass}`
                            : "2px solid transparent",
                        transition: "border-color 0.2s",
                    }}
                >
                    <ShoppingBag
                        size={17}
                        strokeWidth={isActive("/cart") ? 2.2 : 1.5}
                        style={{
                            color: isActive("/cart") ? COLORS.brass : "#ffffff",
                            opacity: 0.9,
                            transition: "color 0.2s",
                        }}
                    />
                </Link>
            </div>
        </nav>
    );
}
