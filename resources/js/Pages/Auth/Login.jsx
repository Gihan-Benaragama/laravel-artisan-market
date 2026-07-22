import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    ShoppingBag, 
    Sparkles, 
    Loader2 
} from 'lucide-react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col md:flex-row font-sans selection:bg-amber-100 selection:text-amber-900">
            <Head title="Welcome Back - Artisan Market" />

            {/* Left Column: Visual Panel (Branding / Art) */}
            <div className="relative hidden md:flex md:w-1/2 lg:w-3/5 bg-stone-900 overflow-hidden flex-col justify-between p-12 text-white">
                {/* Background Image with Warm Dark Overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] hover:scale-105"
                    style={{ backgroundImage: `url('/images/artisan_login_bg.png')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/60 to-stone-950/40 mix-blend-multiply" />

                {/* Top: Branding/Logo */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 flex items-center space-x-3"
                >
                    <div className="bg-amber-500/20 backdrop-blur-md p-2.5 rounded-xl border border-amber-500/30 shadow-inner flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                        <span className="font-semibold text-lg tracking-wider uppercase text-amber-200">Artisan</span>
                        <span className="font-light text-lg tracking-wider uppercase text-white/90 ml-1">Market</span>
                    </div>
                </motion.div>

                {/* Middle: Professional Welcome Content */}
                <div className="relative z-10 max-w-xl my-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="inline-flex items-center space-x-2 bg-amber-500/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/20 text-xs text-amber-300 font-medium mb-6"
                    >
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                        <span>Curated Handcrafted Excellence</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-4xl lg:text-5xl font-serif font-normal tracking-tight text-stone-100 leading-tight"
                    >
                        Crafted with passion, <br />
                        <span className="text-amber-300 font-medium">shared with the world.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-6 text-stone-300/95 leading-relaxed text-base font-light max-w-lg"
                    >
                        Sign in to connect with global artisans, manage your collections, or grow your creative business in a community built on authenticity.
                    </motion.p>
                </div>

                {/* Bottom: Footer Info */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="relative z-10 flex items-center justify-between text-xs text-stone-400"
                >
                    <p>© {new Date().getFullYear()} Artisan Market Inc. All rights reserved.</p>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-amber-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-amber-300 transition-colors">Terms of Service</a>
                    </div>
                </motion.div>
            </div>

            {/* Right Column: Form Panel */}
            <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-white relative">
                {/* Visual Accent for Mobile */}
                <div className="md:hidden flex items-center space-x-2 mb-8">
                    <div className="bg-amber-600 p-2 rounded-lg text-white">
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                    <span className="font-serif font-semibold text-lg text-stone-900">Artisan Market</span>
                </div>

                <div className="max-w-md w-full mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-serif font-normal text-stone-900 tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-stone-500 font-light">
                            Please enter your details to sign in to your account.
                        </p>
                    </motion.div>

                    {status && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 rounded-xl"
                        >
                            {status}
                        </motion.div>
                    )}

                    <form onSubmit={submit} className="mt-8 space-y-6">
                        {/* Email Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <label 
                                htmlFor="email" 
                                className={`block text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                                    focusedField === 'email' ? 'text-amber-700' : 'text-stone-500'
                                }`}
                            >
                                Email Address
                            </label>
                            <div className="mt-1.5 relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className={`block w-full pl-10 pr-4 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-200 ${
                                        errors.email ? 'border-red-300 ring-2 ring-red-500/10' : ''
                                    }`}
                                    placeholder="name@example.com"
                                    autoComplete="username"
                                    autoFocus
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            <AnimatePresence>
                                {errors.email && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <InputError message={errors.email} className="mt-1.5 text-xs text-red-600" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Password Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex justify-between items-center">
                                <label 
                                    htmlFor="password" 
                                    className={`block text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                                        focusedField === 'password' ? 'text-amber-700' : 'text-stone-500'
                                    }`}
                                >
                                    Password
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs text-amber-700 hover:text-amber-900 transition-colors font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <div className="mt-1.5 relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className={`block w-full pl-10 pr-10 py-3 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-200 ${
                                        errors.password ? 'border-red-300 ring-2 ring-red-500/10' : ''
                                    }`}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none cursor-pointer"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            <AnimatePresence>
                                {errors.password && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <InputError message={errors.password} className="mt-1.5 text-xs text-red-600" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Remember Me */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center justify-between"
                        >
                            <label className="flex items-center cursor-pointer select-none">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500/40"
                                />
                                <span className="ml-2.5 text-xs text-stone-600 font-light">
                                    Keep me signed in
                                </span>
                            </label>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-stone-900 hover:bg-stone-850 active:bg-stone-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg cursor-pointer"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </form>

                    {/* Social Logins Visual Mocks */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-stone-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-3 text-stone-400 font-light">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                className="w-full flex items-center justify-center px-4 py-2.5 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 text-xs font-medium text-stone-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 cursor-pointer"
                            >
                                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Google
                            </button>
                        </div>
                    </motion.div>

                    {/* Register link */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 text-center text-xs text-stone-500 font-light"
                    >
                        Don't have an account?{' '}
                        <Link
                            href={route('register')}
                            className="font-medium text-amber-700 hover:text-amber-900 transition-colors underline"
                        >
                            Create one now
                        </Link>
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
