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
    Loader2,
    User,
    CheckCircle2,
    Circle,
} from 'lucide-react';
import InputError from '@/Components/InputError';

/* ── Password strength indicator ─────────────────────────── */
function PasswordStrength({ password }) {
    const checks = [
        { label: 'At least 8 characters', pass: password.length >= 8 },
        { label: 'Contains a number',     pass: /\d/.test(password) },
        { label: 'Contains a letter',     pass: /[a-zA-Z]/.test(password) },
    ];
    const passed = checks.filter((c) => c.pass).length;
    const color  =
        passed === 0 ? 'bg-stone-200' :
        passed === 1 ? 'bg-red-400'   :
        passed === 2 ? 'bg-amber-400' :
                       'bg-emerald-500';

    return (
        <div className="mt-2 space-y-1.5">
            <div className="flex gap-1 h-1">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${i < passed ? color : 'bg-stone-200'}`}
                    />
                ))}
            </div>
            {password.length > 0 && (
                <div className="space-y-1">
                    {checks.map((c) => (
                        <div key={c.label} className="flex items-center gap-1.5">
                            {c.pass
                                ? <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                                : <Circle size={11} className="text-stone-300 shrink-0" />
                            }
                            <span className={`text-[10px] ${c.pass ? 'text-emerald-600' : 'text-stone-400'}`}>
                                {c.label}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── Field wrapper ─────────────────────────────────────────── */
function Field({ label, error, children, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                {label}
            </label>
            {children}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <InputError message={error} className="mt-1.5 text-xs text-red-600" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ── Main component ────────────────────────────────────────── */
export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword]     = useState(false);
    const [showConfirm,  setShowConfirm]       = useState(false);
    const [focusedField, setFocusedField]      = useState(null);

    const inputClass = (field) =>
        `block w-full pl-10 pr-4 py-3 bg-stone-50/50 border rounded-xl text-stone-900 placeholder-stone-400
        focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all duration-200
        ${errors[field] ? 'border-red-300 ring-2 ring-red-500/10' : 'border-stone-200'}`;

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    /* Perks shown on the left panel */
    const perks = [
        { icon: '✦', text: 'Discover one-of-a-kind handcrafted goods' },
        { icon: '✦', text: 'Support independent artisan studios globally' },
        { icon: '✦', text: 'List your craft and grow your creative business' },
    ];

    return (
        <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col md:flex-row font-sans selection:bg-amber-100 selection:text-amber-900">
            <Head title="Create Account — Artisan Market" />

            {/* ── LEFT PANEL: Branding ──────────────────────────────── */}
            <div className="relative hidden md:flex md:w-1/2 lg:w-3/5 bg-stone-900 overflow-hidden flex-col justify-between p-12 text-white">
                {/* Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('/images/artisan_login_bg.png')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/65 to-stone-950/50 mix-blend-multiply" />

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
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

                {/* Hero copy */}
                <div className="relative z-10 max-w-xl my-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="inline-flex items-center space-x-2 bg-amber-500/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/20 text-xs text-amber-300 font-medium mb-6"
                    >
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                        <span>Join 10,000+ Artisan Creators</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-4xl lg:text-5xl font-serif font-normal tracking-tight text-stone-100 leading-tight"
                    >
                        Your creative journey{' '}
                        <br />
                        <span className="text-amber-300 font-medium">starts here.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-6 text-stone-300/90 leading-relaxed text-base font-light max-w-lg"
                    >
                        Join a thriving marketplace where authentic handcraft meets a community that values artistry, quality, and the human touch.
                    </motion.p>

                    {/* Perks */}
                    <motion.ul
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55, duration: 0.8 }}
                        className="mt-8 space-y-3"
                    >
                        {perks.map((p, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                className="flex items-center gap-3 text-sm text-stone-300 font-light"
                            >
                                <span className="text-amber-400 text-xs">{p.icon}</span>
                                {p.text}
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="relative z-10 flex items-center justify-between text-xs text-stone-400"
                >
                    <p>© {new Date().getFullYear()} Artisan Market Inc. All rights reserved.</p>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-amber-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-amber-300 transition-colors">Terms of Service</a>
                    </div>
                </motion.div>
            </div>

            {/* ── RIGHT PANEL: Form ─────────────────────────────────── */}
            <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-white relative overflow-y-auto">
                {/* Mobile logo */}
                <div className="md:hidden flex items-center space-x-2 mb-8">
                    <div className="bg-amber-600 p-2 rounded-lg text-white">
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                    <span className="font-serif font-semibold text-lg text-stone-900">Artisan Market</span>
                </div>

                <div className="max-w-md w-full mx-auto">
                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <h2 className="text-3xl font-serif font-normal text-stone-900 tracking-tight">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-stone-500 font-light">
                            Fill in the details below to get started — it only takes a moment.
                        </p>
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-5">

                        {/* Full Name */}
                        <Field label="Full Name" error={errors.name} delay={0.1}>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                                    <User className="h-4 w-4" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className={inputClass('name')}
                                    placeholder="Jane Doe"
                                    autoComplete="name"
                                    autoFocus
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                            </div>
                        </Field>

                        {/* Email */}
                        <Field label="Email Address" error={errors.email} delay={0.15}>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className={inputClass('email')}
                                    placeholder="name@example.com"
                                    autoComplete="username"
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                        </Field>

                        {/* Password */}
                        <Field label="Password" error={errors.password} delay={0.2}>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className={`${inputClass('password')} pr-10`}
                                    placeholder="Create a strong password"
                                    autoComplete="new-password"
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
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {/* Strength meter */}
                            {data.password.length > 0 && (
                                <PasswordStrength password={data.password} />
                            )}
                        </Field>

                        {/* Confirm Password */}
                        <Field label="Confirm Password" error={errors.password_confirmation} delay={0.25}>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    id="password_confirmation"
                                    type={showConfirm ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className={`${inputClass('password_confirmation')} pr-10`}
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                    onFocus={() => setFocusedField('confirm')}
                                    onBlur={() => setFocusedField(null)}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none cursor-pointer"
                                >
                                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {/* Match indicator */}
                            {data.password_confirmation.length > 0 && (
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    {data.password === data.password_confirmation ? (
                                        <>
                                            <CheckCircle2 size={11} className="text-emerald-500" />
                                            <span className="text-[10px] text-emerald-600">Passwords match</span>
                                        </>
                                    ) : (
                                        <>
                                            <Circle size={11} className="text-red-400" />
                                            <span className="text-[10px] text-red-500">Passwords do not match</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </Field>

                        {/* Terms notice */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-[11px] text-stone-400 font-light leading-relaxed"
                        >
                            By creating an account you agree to our{' '}
                            <a href="#" className="text-amber-700 hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-amber-700 hover:underline">Privacy Policy</a>.
                        </motion.p>

                        {/* Submit */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                        >
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-stone-900 hover:bg-[#C86D51] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Creating account…</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </form>

                    {/* Divider */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        className="mt-8 relative"
                    >
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-stone-400 font-light">Or sign up with</span>
                        </div>
                    </motion.div>

                    {/* Google */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6"
                    >
                        <button
                            type="button"
                            className="w-full flex items-center justify-center px-4 py-2.5 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 text-xs font-medium text-stone-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 cursor-pointer"
                        >
                            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </button>
                    </motion.div>

                    {/* Login link */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55 }}
                        className="mt-8 text-center text-xs text-stone-500 font-light"
                    >
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="font-medium text-amber-700 hover:text-amber-900 transition-colors underline"
                        >
                            Sign in instead
                        </Link>
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
