import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { ShoppingBag, Sparkles, User as UserIcon, LogOut, Store, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import CartDrawer from "./CartDrawer";

const COLORS = {
    bgDark: "rgba(18, 16, 14, 0.92)",
    terracotta: "#C86D51",
    brass: "#D4AF37",
    cream: "#F8F5F0",
};

export default function Navbar() {
    const { auth, cart } = usePage().props;
    const { url } = usePage();
    const user = auth?.user;
    const [cartOpen, setCartOpen] = useState(false);

    const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    const isActive = (path, exact = false) => {
        if (exact) return url === path;
        if (path === "/") return url === "/";
        return url.startsWith(path);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="sticky top-0 z-50 w-full px-6 md:px-12 py-4 flex items-center justify-between transition-all duration-300"
                style={{
                    background: COLORS.bgDark,
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                {/* BRAND LOGO */}
                <Link href="/" className="group flex items-center gap-3 text-decoration-none">
                    <motion.div
                        whileHover={{ rotate: 180, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C86D51] to-[#D4AF37] flex items-center justify-center text-white shadow-lg"
                    >
                        <Sparkles size={18} />
                    </motion.div>
                    <div className="flex flex-col">
                        <span
                            className="font-serif-luxury text-2xl font-semibold tracking-wider text-white group-hover:text-[#D4AF37] transition-colors duration-300"
                        >
                            ATELIER
                        </span>
                        <span className="text-[10px] tracking-[0.25em] text-[#C86D51] uppercase -mt-1 font-medium">
                            Studio Marketplace
                        </span>
                    </div>
                </Link>

                {/* NAV LINKS */}
                <div className="flex items-center gap-8">
                    <Link
                        href="/"
                        className={`relative text-sm tracking-wide font-medium transition-colors duration-300 ${
                            isActive("/", true) ? "text-[#D4AF37]" : "text-white/80 hover:text-white"
                        }`}
                    >
                        Home
                        {isActive("/", true) && (
                            <motion.div
                                layoutId="navIndicator"
                                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#D4AF37] rounded-full"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                    </Link>

                    <Link
                        href="/shop"
                        className={`relative text-sm tracking-wide font-medium transition-colors duration-300 ${
                            isActive("/shop") ? "text-[#D4AF37]" : "text-white/80 hover:text-white"
                        }`}
                    >
                        Shop Studios
                        {isActive("/shop") && (
                            <motion.div
                                layoutId="navIndicator"
                                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#D4AF37] rounded-full"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-6">
                            {user.is_admin ? (
                                <Link
                                    href="/admin"
                                    className={`relative text-sm tracking-wide font-medium transition-colors duration-300 flex items-center gap-1.5 ${
                                        url.startsWith("/admin") ? "text-[#D4AF37]" : "text-white/90 hover:text-white"
                                    }`}
                                >
                                    <ShieldCheck size={15} className="text-[#D4AF37]" />
                                    Admin Panel
                                    {url.startsWith("/admin") && (
                                        <motion.div
                                            layoutId="navIndicator"
                                            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#D4AF37] rounded-full"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            ) : (
                                <Link
                                    href="/dashboard"
                                    className={`relative text-sm tracking-wide font-medium transition-colors duration-300 flex items-center gap-1.5 ${
                                        isActive("/dashboard") ? "text-[#D4AF37]" : "text-white/80 hover:text-white"
                                    }`}
                                >
                                    <Store size={15} />
                                    Dashboard
                                    {isActive("/dashboard") && (
                                        <motion.div
                                            layoutId="navIndicator"
                                            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#D4AF37] rounded-full"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.post("/logout")}
                                className="flex items-center gap-1.5 text-xs tracking-wider uppercase text-white/70 hover:text-[#C86D51] transition-colors"
                            >
                                <LogOut size={14} />
                                Logout
                            </motion.button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-5">
                            <Link
                                href="/login"
                                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                            >
                                Log in
                            </Link>
                            <Link href="/register">
                                <motion.button
                                    whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(200, 109, 81, 0.4)" }}
                                    whileTap={{ scale: 0.96 }}
                                    className="px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white bg-gradient-to-r from-[#C86D51] to-[#B25539] rounded-full shadow-md transition-all"
                                >
                                    Register Studio
                                </motion.button>
                            </Link>
                        </div>
                    )}

                    {/* CART TRIGGER BUTTON */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCartOpen(true)}
                        className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
                        aria-label="Open Shopping Bag"
                    >
                        <ShoppingBag size={19} className="text-[#F8F5F0]" />
                        {cartCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                key={cartCount}
                                className="absolute -top-1 -right-1 bg-gradient-to-r from-[#C86D51] to-[#D4AF37] text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg border border-black/50"
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </motion.button>
                </div>
            </motion.nav>

            {/* Cart slide-out right drawer */}
            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
}
