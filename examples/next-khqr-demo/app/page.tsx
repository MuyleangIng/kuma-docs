import { KhqrCheckout } from "koma-khqr/react";

const PRODUCTS = [
  { id: "ART-01", name: "Khmer Art Print",    desc: "Gallery-grade print on textured stock", price: "14", currency: "USD" as const, emoji: "🖼️" },
  { id: "TEA-01", name: "Lemongrass Tea Box", desc: "Twelve hand-packed tea sachets",         price: "7",  currency: "USD" as const, emoji: "🍵" },
  { id: "SCF-01", name: "Silk Scarf",          desc: "Hand-woven Khmer silk, 180 × 45 cm",    price: "25", currency: "USD" as const, emoji: "🧣" },
];

export default async function Home() {
  const merchantId = process.env.KOMA_MERCHANT_ID ?? "";

  return (
    <main style={{ fontFamily: "'Segoe UI', Arial, sans-serif", margin: "48px auto", maxWidth: 560, padding: "0 20px" }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, margin: "0 0 6px", fontWeight: 700 }}>Next-KHQR-Demo</h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: 14 }}>
          Powered by <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: 4 }}>koma-khqr</code> — App Router example
        </p>
        {!merchantId && (
          <p style={{ marginTop: 12, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, fontSize: 13, color: "#dc2626" }}>
            ⚠ Create <code>.env.local</code> with <code>KOMA_API_URL</code>, <code>KOMA_MERCHANT_ID</code>, <code>KOMA_SECRET_KEY</code> then restart.
          </p>
        )}
      </header>

      <div style={{ display: "grid", gap: 16 }}>
        {PRODUCTS.map((product) => (
          <section key={product.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, boxShadow: "0 2px 12px rgba(15,23,42,0.06)", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 32, lineHeight: 1 }}>{product.emoji}</span>
                <div>
                  <h2 style={{ fontSize: 16, margin: "0 0 4px", fontWeight: 600 }}>{product.name}</h2>
                  <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>{product.desc}</p>
                  <p style={{ color: "#94a3b8", fontSize: 11, margin: "4px 0 0" }}>SKU: {product.id}</p>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>${product.price}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{product.currency}</div>
              </div>
            </div>

            <KhqrCheckout
              amount={product.price}
              currency={product.currency}
              productId={product.id}
              productName={product.name}
              merchantId={merchantId}
            />
          </section>
        ))}
      </div>
    </main>
  );
}
