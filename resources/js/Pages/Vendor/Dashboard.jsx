import React from "react";
import { Link, useForm, router } from "@inertiajs/react";
import { Package, DollarSign, Plus, ArrowRight, Store } from "lucide-react";
import VendorNavbar from "../../Components/VendorNavbar";

const COLORS = {
  bg: "#1C1815",
  bgLight: "#F2EAE0",
  sienna: "#B5563C",
  sage: "#7C8471",
  brass: "#A88A5B",
  ink: "#0F0D0B",
};

/** Shown when an approved vendor hasn't created their shop yet */
function SetupShopCard() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    description: "",
  });

  const submit = (e) => {
    e.preventDefault();
    post("/vendor/shop");
  };

  return (
    <div style={{ padding: "2rem 3rem 5rem", maxWidth: 520 }}>
      <Store size={28} style={{ color: COLORS.sienna, marginBottom: 16 }} />
      <h2 className="voice" style={{ fontSize: 26, fontWeight: 500, marginBottom: 8 }}>
        Set up your studio
      </h2>
      <p style={{ fontSize: 14, color: COLORS.sage, lineHeight: 1.65, marginBottom: 28 }}>
        Before you can list products, give your studio a name so customers can find you.
      </p>

      <form onSubmit={submit} className="flex flex-col" style={{ gap: 18 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
            Studio name
          </label>
          <input
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            placeholder="e.g. Earthen & Co."
            style={{
              width: "100%", padding: "11px 14px", fontSize: 14,
              border: "1px solid rgba(15,13,11,0.15)", borderRadius: 2,
              outline: "none", fontFamily: "'Inter', sans-serif",
            }}
          />
          {errors.name && (
            <p style={{ color: COLORS.sienna, fontSize: 12.5, marginTop: 4 }}>{errors.name}</p>
          )}
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>
            Short description <span style={{ color: COLORS.sage, fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            placeholder="Tell customers what you make..."
            rows={3}
            style={{
              width: "100%", padding: "11px 14px", fontSize: 14,
              border: "1px solid rgba(15,13,11,0.15)", borderRadius: 2,
              outline: "none", resize: "vertical", fontFamily: "'Inter', sans-serif",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={processing}
          style={{
            background: COLORS.sienna, color: COLORS.bgLight, border: "none",
            padding: "13px 0", fontSize: 14, fontWeight: 500, borderRadius: 2,
            cursor: processing ? "not-allowed" : "pointer",
            opacity: processing ? 0.7 : 1, transition: "opacity 0.2s ease",
          }}
        >
          {processing ? "Creating studio..." : "Create my studio →"}
        </button>
      </form>
    </div>
  );
}

export default function VendorDashboard({ shop, productCount, subOrders, totalEarnings, availableBalance = 0, payouts = [] }) {
  const requestPayout = () => {
    if (availableBalance <= 0) return;
    if (confirm(`Request payout of $${Number(availableBalance).toFixed(2)}?`)) {
      router.post('/vendor/payouts', {}, { preserveScroll: true });
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.bgLight, color: COLORS.ink, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600&family=Inter:wght@400;500;600&display=swap');
        .voice { font-family: 'Fraunces', serif; }
        .btn-primary { transition: opacity 0.25s ease; cursor: pointer; text-decoration: none; }
        .btn-primary:hover { opacity: 0.88; }
        input:focus, textarea:focus { border-color: ${COLORS.sienna} !important; }
      `}</style>

      {/* NAV */}
      <VendorNavbar />

      {/* If no shop yet — prompt vendor to create one */}
      {!shop ? (
        <SetupShopCard />
      ) : (
        <>
          <div className="flex items-center justify-between" style={{ padding: "3rem 3rem 1rem" }}>
            <div>
              <p style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.brass, marginBottom: 10 }}>
                Vendor dashboard
              </p>
              <h1 className="voice" style={{ fontSize: 34, fontWeight: 500 }}>{shop?.name}</h1>
            </div>
            <Link
              href="/vendor/products/create"
              className="btn-primary flex items-center"
              style={{ gap: 8, background: COLORS.sienna, color: COLORS.bgLight, padding: "12px 22px", borderRadius: 2, fontSize: 14, fontWeight: 500 }}
            >
              <Plus size={16} /> Add product
            </Link>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3" style={{ gap: 24, padding: "1.5rem 3rem" }}>
            <div style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: 24 }}>
              <Package size={20} style={{ color: COLORS.sienna, marginBottom: 10 }} />
              <p style={{ fontSize: 28, fontWeight: 600 }}>{productCount}</p>
              <p style={{ fontSize: 13, color: COLORS.sage }}>Products listed</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: 24 }}>
              <DollarSign size={20} style={{ color: COLORS.sienna, marginBottom: 10 }} />
              <p style={{ fontSize: 28, fontWeight: 600 }}>${Number(totalEarnings ?? 0).toFixed(2)}</p>
              <p style={{ fontSize: 13, color: COLORS.sage }}>Total earnings</p>
            </div>
            <div style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <DollarSign size={20} style={{ color: COLORS.sage, marginBottom: 10 }} />
                <p style={{ fontSize: 28, fontWeight: 600 }}>${Number(availableBalance ?? 0).toFixed(2)}</p>
                <p style={{ fontSize: 13, color: COLORS.sage }}>Available balance</p>
              </div>
              {availableBalance > 0 && (
                <button
                  onClick={requestPayout}
                  className="btn-primary"
                  style={{ background: COLORS.sienna, color: COLORS.bgLight, border: "none", padding: "8px 14px", fontSize: 12.5, borderRadius: 2, marginTop: 4 }}
                >
                  Request Payout
                </button>
              )}
            </div>
          </div>

          {/* COLUMNS LAYOUT: ORDERS & PAYOUTS */}
          <div className="grid grid-cols-3" style={{ gap: 32, padding: "1.5rem 3rem 5rem" }}>
            {/* RECENT ORDERS */}
            <div style={{ gridColumn: "span 2" }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
                <h2 className="voice" style={{ fontSize: 22, fontWeight: 500 }}>Recent orders</h2>
                <Link href="/vendor/products" className="flex items-center" style={{ gap: 6, fontSize: 13.5, color: COLORS.sienna, textDecoration: "none" }}>
                  Manage products <ArrowRight size={14} />
                </Link>
              </div>

              {(!subOrders || subOrders.length === 0) ? (
                <div style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: 32, textAlign: "center", color: COLORS.sage, fontSize: 14 }}>
                  No orders yet — they'll show up here once a customer buys from your studio.
                </div>
              ) : (
                <div className="flex flex-col" style={{ gap: 10 }}>
                  {subOrders.map((so) => (
                    <div key={so.id} style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: "16px 20px" }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                        <p style={{ fontSize: 14, fontWeight: 500 }}>Order #{so.order_id} · Sub-order #{so.id}</p>
                        <span
                          style={{
                            fontSize: 12,
                            padding: "4px 12px",
                            borderRadius: 20,
                            textTransform: "capitalize",
                            background: so.status === "pending" ? "rgba(168,138,91,0.15)" : "rgba(124,132,113,0.15)",
                            color: so.status === "pending" ? COLORS.brass : COLORS.sage,
                          }}
                        >
                          {so.status}
                        </span>
                      </div>
                      {so.items?.map((item) => (
                        <p key={item.id} style={{ fontSize: 13, color: COLORS.sage }}>
                          {item.quantity} × {item.product?.name} — ${Number(item.price * item.quantity).toFixed(2)}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PAYOUT HISTORY */}
            <div>
              <h2 className="voice" style={{ fontSize: 22, fontWeight: 500, marginBottom: 18 }}>Payouts</h2>
              {payouts.length === 0 ? (
                <div style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: 24, textAlign: "center", color: COLORS.sage, fontSize: 13.5 }}>
                  No payout history yet.
                </div>
              ) : (
                <div className="flex flex-col" style={{ gap: 10 }}>
                  {payouts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between" style={{ background: "#fff", border: "1px solid rgba(15,13,11,0.08)", borderRadius: 4, padding: "14px 16px" }}>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 500, color: COLORS.sienna }}>${Number(p.amount).toFixed(2)}</p>
                        <p style={{ fontSize: 11.5, color: COLORS.sage }}>{new Date(p.created_at).toLocaleDateString()}</p>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 20,
                          textTransform: "capitalize",
                          background: p.status === "pending" ? "rgba(168,138,91,0.12)" : "rgba(124,132,113,0.15)",
                          color: p.status === "pending" ? COLORS.brass : COLORS.sage,
                        }}
                      >
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
