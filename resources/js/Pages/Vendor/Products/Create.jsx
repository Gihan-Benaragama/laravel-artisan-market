import React from "react";
import { Link, useForm } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";
import VendorNavbar from "../../../Components/VendorNavbar";

const COLORS = {
    bg: "#1C1815",
    bgLight: "#F2EAE0",
    sienna: "#B5563C",
    sage: "#7C8471",
    brass: "#A88A5B",
    ink: "#0F0D0B",
};

const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    fontSize: 14,
    border: "1px solid rgba(15,13,11,0.15)",
    borderRadius: 2,
    outline: "none",
    fontFamily: "'Inter', sans-serif",
};

const labelStyle = { fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block" };

export default function VendorProductsCreate({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        category_id: "",
        description: "",
        price: "",
        stock: "",
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post("/vendor/products", { forceFormData: true });
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bgLight, color: COLORS.ink, minHeight: "100vh" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600&family=Inter:wght@400;500;600&display=swap');
        .voice { font-family: 'Fraunces', serif; }
        .btn-primary { transition: opacity 0.25s ease; cursor: pointer; }
        .btn-primary:hover { opacity: 0.88; }
        input:focus, textarea:focus, select:focus { border-color: ${COLORS.sienna} !important; }
      `}</style>

            <VendorNavbar />

            <div style={{ padding: "2.5rem 3rem 5rem", maxWidth: 560 }}>
                <Link href="/vendor/products" className="flex items-center" style={{ gap: 6, fontSize: 13, color: COLORS.sage, textDecoration: "none", width: "fit-content", marginBottom: 24 }}>
                    <ChevronLeft size={15} /> Back to products
                </Link>

                <h1 className="voice" style={{ fontSize: 30, fontWeight: 500, marginBottom: 28 }}>Add a new product</h1>

                <form onSubmit={submit} className="flex flex-col" style={{ gap: 20 }}>
                    <div>
                        <label style={labelStyle}>Product name</label>
                        <input
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            style={inputStyle}
                            placeholder="e.g. Hand-thrown stoneware vase"
                        />
                        {errors.name && <p style={{ color: COLORS.sienna, fontSize: 12.5, marginTop: 4 }}>{errors.name}</p>}
                    </div>

                    <div>
                        <label style={labelStyle}>Category</label>
                        <select value={data.category_id} onChange={(e) => setData("category_id", e.target.value)} style={inputStyle}>
                            <option value="">Select a category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <p style={{ color: COLORS.sienna, fontSize: 12.5, marginTop: 4 }}>{errors.category_id}</p>}
                    </div>

                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
                            placeholder="Describe the piece, materials, and craft process..."
                        />
                    </div>

                    <div className="grid grid-cols-2" style={{ gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.price}
                                onChange={(e) => setData("price", e.target.value)}
                                style={inputStyle}
                                placeholder="86.00"
                            />
                            {errors.price && <p style={{ color: COLORS.sienna, fontSize: 12.5, marginTop: 4 }}>{errors.price}</p>}
                        </div>
                        <div>
                            <label style={labelStyle}>Stock quantity</label>
                            <input
                                type="number"
                                min="0"
                                value={data.stock}
                                onChange={(e) => setData("stock", e.target.value)}
                                style={inputStyle}
                                placeholder="12"
                            />
                            {errors.stock && <p style={{ color: COLORS.sienna, fontSize: 12.5, marginTop: 4 }}>{errors.stock}</p>}
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Product photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData("image", e.target.files[0])}
                            style={{ fontSize: 14 }}
                        />
                        {errors.image && <p style={{ color: COLORS.sienna, fontSize: 12.5, marginTop: 4 }}>{errors.image}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary"
                        style={{ background: COLORS.sienna, color: COLORS.bgLight, border: "none", padding: "13px 0", fontSize: 14, fontWeight: 500, borderRadius: 2, marginTop: 8 }}
                    >
                        {processing ? "Saving..." : "Add product"}
                    </button>
                </form>
            </div>
        </div>
    );
}
