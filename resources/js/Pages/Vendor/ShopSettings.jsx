import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ChevronLeft, Save, Upload, Store, Image as ImageIcon, Type, FileText, CheckCircle } from "lucide-react";
import VendorNavbar from "../../Components/VendorNavbar";

export default function VendorShopSettings({ shop }) {
    const { flash } = usePage().props;

    const [name, setName] = useState(shop.name ?? "");
    const [description, setDescription] = useState(shop.description ?? "");
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(shop.banner ? `/storage/${shop.banner}` : null);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(shop.logo ? `/storage/${shop.logo}` : null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if (bannerFile) formData.append("banner", bannerFile);
        if (logoFile) formData.append("logo", logoFile);

        router.post("/vendor/shop/edit", formData, {
            forceFormData: true,
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="min-h-screen bg-[#F2EAE0] text-stone-800 font-sans selection:bg-amber-100 selection:text-amber-900">
            <VendorNavbar />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto px-6 lg:px-12 py-10"
            >
                {/* Back link */}
                <Link
                    href="/vendor/dashboard"
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-800 transition-colors mb-6"
                >
                    <ChevronLeft size={14} />
                    <span>Back to dashboard</span>
                </Link>

                {/* Success flash */}
                {flash?.success && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 mb-6 text-sm font-medium"
                    >
                        <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                        <span>{flash.success}</span>
                    </motion.div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-300/60 pb-8 mb-8">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                            Studio Settings
                        </span>
                        <h1 className="font-serif text-3xl lg:text-4xl font-normal text-stone-900 mt-1">
                            {shop.name}
                        </h1>
                        <p className="text-sm text-stone-500 font-light mt-1.5">
                            This is what customers see on your public studio page.
                        </p>
                    </div>
                    <Link
                        href={`/studios/${shop.slug || shop.id}`}
                        className="inline-flex items-center space-x-2 py-2.5 px-4 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-sm uppercase tracking-wide"
                    >
                        <Store size={13} />
                        <span>View Public Page</span>
                    </Link>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT: Studio Info (2/3) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Studio Identity */}
                        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5">
                            <h3 className="font-serif text-lg font-normal text-stone-900 border-b border-stone-100 pb-3 flex items-center space-x-2">
                                <Type size={16} className="text-stone-400" />
                                <span>Studio Identity</span>
                            </h3>

                            {/* Name */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                                    Studio Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Earthen & Co."
                                    className="block w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-sm"
                                    required
                                />
                                {errors.name && <p className="text-xs text-red-600 mt-1.5">{errors.name}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                                    Studio Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={6}
                                    placeholder="Tell customers who you are, what you make, your craft story, and what makes your work unique..."
                                    className="block w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all resize-none text-sm"
                                />
                                <p className="text-xs text-stone-400 font-light mt-1.5">{description.length} / 2000 characters</p>
                                {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
                            </div>
                        </div>

                        {/* Banner Image */}
                        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className="font-serif text-lg font-normal text-stone-900 border-b border-stone-100 pb-3 flex items-center space-x-2">
                                <ImageIcon size={16} className="text-stone-400" />
                                <span>Banner Image</span>
                            </h3>
                            <p className="text-xs text-stone-400 font-light -mt-2">
                                Displayed prominently on your public studio page. Recommended size: 1400×400px.
                            </p>

                            {bannerPreview ? (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-stone-200 group bg-stone-50">
                                    <img
                                        src={bannerPreview}
                                        alt="Banner preview"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                                    />
                                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                                        <label className="bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center space-x-1.5 shadow-md">
                                            <Upload size={13} />
                                            <span>Change Banner</span>
                                            <input type="file" accept="image/*,.heic,.heif,.avif,.webp,.svg,.png,.jpg,.jpeg,.gif,.bmp,.tiff" onChange={handleBannerChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-40 rounded-xl border-2 border-dashed border-stone-200 hover:border-stone-400 transition-colors flex flex-col items-center justify-center text-center p-4 bg-stone-50">
                                    <ImageIcon size={28} className="text-stone-300 mb-2" />
                                    <p className="text-xs text-stone-500 font-medium">No banner uploaded</p>
                                    <label className="mt-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold py-2 px-3.5 rounded-lg cursor-pointer transition-colors shadow-sm inline-flex items-center space-x-1.5">
                                        <Upload size={12} />
                                        <span>Upload Banner</span>
                                        <input type="file" accept="image/*,.heic,.heif,.avif,.webp,.svg,.png,.jpg,.jpeg,.gif,.bmp,.tiff" onChange={handleBannerChange} className="hidden" />
                                    </label>
                                </div>
                            )}
                            {errors.banner && <p className="text-xs text-red-600 mt-1">{errors.banner}</p>}
                        </div>
                    </div>

                    {/* RIGHT: Logo + Save (1/3) */}
                    <div className="space-y-6">

                        {/* Logo Upload */}
                        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className="font-serif text-lg font-normal text-stone-900 border-b border-stone-100 pb-3">
                                Studio Logo
                            </h3>
                            <p className="text-xs text-stone-400 font-light -mt-2">
                                Shown next to your studio name. Square image recommended.
                            </p>

                            {logoPreview ? (
                                <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-stone-200 group bg-stone-50">
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                                        <label className="bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center space-x-1.5 shadow-md">
                                            <Upload size={13} />
                                            <span>Change Logo</span>
                                            <input type="file" accept="image/*,.heic,.heif,.avif,.webp,.svg,.png,.jpg,.jpeg,.gif,.bmp,.tiff" onChange={handleLogoChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full aspect-square rounded-xl border-2 border-dashed border-stone-200 hover:border-stone-400 transition-colors flex flex-col items-center justify-center text-center p-4 bg-stone-50">
                                    <Store size={28} className="text-stone-300 mb-2" />
                                    <p className="text-xs text-stone-500 font-medium">No logo uploaded</p>
                                    <label className="mt-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold py-2 px-3.5 rounded-lg cursor-pointer transition-colors shadow-sm inline-flex items-center space-x-1.5">
                                        <Upload size={12} />
                                        <span>Upload Logo</span>
                                        <input type="file" accept="image/*,.heic,.heif,.avif,.webp,.svg,.png,.jpg,.jpeg,.gif,.bmp,.tiff" onChange={handleLogoChange} className="hidden" />
                                    </label>
                                </div>
                            )}
                            {errors.logo && <p className="text-xs text-red-600 mt-1">{errors.logo}</p>}
                        </div>

                        {/* Studio info card */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-900 space-y-2">
                            <p className="font-semibold text-xs uppercase tracking-wider">Public visibility</p>
                            <p className="font-light text-xs leading-relaxed text-amber-800">
                                Your studio name, description, logo, and banner are <span className="font-semibold">publicly visible</span> to shoppers on the marketplace and your studio page.
                            </p>
                        </div>

                        {/* Save button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 active:bg-stone-950 transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                        >
                            <Save size={16} />
                            <span>{processing ? "Saving..." : "Save Settings"}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
