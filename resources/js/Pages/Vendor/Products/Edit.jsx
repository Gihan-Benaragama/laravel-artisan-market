import React, { useState } from "react";
import { Link, useForm, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ChevronLeft, Save, Upload, Tag, DollarSign, Package, Image as ImageIcon } from "lucide-react";
import VendorNavbar from "../../../Components/VendorNavbar";

export default function VendorProductsEdit({ product, categories }) {
    const { data, setData, processing, errors } = useForm({
        name: product.name ?? "",
        category_id: product.category_id ?? "",
        description: product.description ?? "",
        price: product.price ?? "",
        stock: product.stock ?? "",
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(
        product.image ? `/storage/${product.image}` : null
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        router.post(`/vendor/products/${product.id}`, {
            _method: 'patch',
            ...data,
        }, { forceFormData: true });
    };

    return (
        <div className="min-h-screen bg-[#F2EAE0] text-stone-850 font-sans selection:bg-amber-100 selection:text-amber-900">
            <VendorNavbar />

            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto px-6 lg:px-12 py-10"
            >
                {/* Back button link */}
                <Link 
                    href="/vendor/products" 
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-800 transition-colors mb-6"
                >
                    <ChevronLeft size={14} />
                    <span>Back to products</span>
                </Link>

                <h1 className="font-serif text-3xl font-normal text-stone-900 mb-8">
                    Edit Product
                </h1>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Panel: Core Details (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5">
                            <h3 className="font-serif text-lg font-normal text-stone-900 border-b border-stone-100 pb-3">
                                Product Information
                            </h3>

                            {/* Product Name */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                                    Product Name
                                </label>
                                <input 
                                    value={data.name} 
                                    onChange={(e) => setData("name", e.target.value)} 
                                    className="block w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-sm font-sans"
                                    placeholder="e.g. Handmade Ceramic Bowl"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-600 mt-1.5">{errors.name}</p>
                                )}
                            </div>

                            {/* Category selector */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                                    Category
                                </label>
                                <div className="relative">
                                    <select 
                                        value={data.category_id} 
                                        onChange={(e) => setData("category_id", e.target.value)} 
                                        className="block w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-sm font-sans appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
                                        <Tag size={15} />
                                    </div>
                                </div>
                                {errors.category_id && (
                                    <p className="text-xs text-red-600 mt-1.5">{errors.category_id}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    rows={6}
                                    className="block w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all resize-none text-sm font-sans"
                                    placeholder="Describe the details, process, materials, or story behind this handcrafted item..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Price, Stock, Image & Actions (1/3 width) */}
                    <div className="space-y-6">
                        {/* Price & Stock Card */}
                        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className="font-serif text-lg font-normal text-stone-900 border-b border-stone-100 pb-3">
                                Pricing & Stock
                            </h3>

                            {/* Price */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                                    Price ($)
                                </label>
                                <div className="relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                                        <DollarSign size={15} />
                                    </div>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        min="0" 
                                        value={data.price} 
                                        onChange={(e) => setData("price", e.target.value)} 
                                        className="block w-full pl-9 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-sm font-sans"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                {errors.price && (
                                    <p className="text-xs text-red-600 mt-1.5">{errors.price}</p>
                                )}
                            </div>

                            {/* Stock Quantity */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                                    Stock Quantity
                                </label>
                                <div className="relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                                        <Package size={15} />
                                    </div>
                                    <input 
                                        type="number" 
                                        min="0" 
                                        value={data.stock} 
                                        onChange={(e) => setData("stock", e.target.value)} 
                                        className="block w-full pl-9 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-sm font-sans"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                {errors.stock && (
                                    <p className="text-xs text-red-600 mt-1.5">{errors.stock}</p>
                                )}
                            </div>
                        </div>

                        {/* Image Preview & Upload Card */}
                        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className="font-serif text-lg font-normal text-stone-900 border-b border-stone-100 pb-3">
                                Product Image
                            </h3>

                            {/* Active Image Thumbnail View */}
                            {imagePreview ? (
                                <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-stone-200 group bg-stone-50">
                                    <img 
                                        src={imagePreview} 
                                        alt="Product Preview" 
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                                    />
                                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                                        <label className="bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold py-2 px-3 rounded-lg cursor-pointer transition-all flex items-center space-x-1.5 shadow-md">
                                            <Upload size={13} />
                                            <span>Change Photo</span>
                                            <input
                                                type="file"
                                                accept="image/*,.heic,.heif,.avif,.webp,.svg,.png,.jpg,.jpeg,.gif,.bmp,.tiff"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full aspect-square rounded-xl border-2 border-dashed border-stone-200 hover:border-stone-400 transition-colors flex flex-col items-center justify-center text-center p-4 bg-stone-50">
                                    <ImageIcon size={32} className="text-stone-400 mb-2.5" />
                                    <p className="text-xs text-stone-500 font-medium">No image loaded</p>
                                    <label className="mt-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold py-2 px-3.5 rounded-lg cursor-pointer transition-colors shadow-sm inline-flex items-center space-x-1.5">
                                        <Upload size={12} />
                                        <span>Upload File</span>
                                        <input
                                            type="file"
                                            accept="image/*,.heic,.heif,.avif,.webp,.svg,.png,.jpg,.jpeg,.gif,.bmp,.tiff"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            )}
                            {errors.image && (
                                <p className="text-xs text-red-600 mt-1">{errors.image}</p>
                            )}
                        </div>

                        {/* Save Changes button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 active:bg-stone-950 focus:outline-none transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                        >
                            <Save size={16} />
                            <span>{processing ? "Saving Changes..." : "Save Changes"}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
