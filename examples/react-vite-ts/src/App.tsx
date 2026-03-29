import { KhqrCheckout } from "koma-khqr/react";

const PRODUCTS = [
  {
    id: "COFFEE-01",
    name: "Mondulkiri Coffee Box",
    desc: "Single-origin roast with tasting card",
    price: "12",
    currency: "USD" as const,
  },
  {
    id: "RICE-01",
    name: "Jasmine Rice Bundle",
    desc: "Premium harvest, sealed gift pack",
    price: "8",
    currency: "USD" as const,
  },
];

function PageShell({
  title,
  body,
  accent,
}: {
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <main style={{ fontFamily: "Segoe UI, Arial, sans-serif", margin: "72px auto", maxWidth: 520, padding: "0 20px" }}>
      <section style={{ background: "#fff", border: `1px solid ${accent}`, borderRadius: 20, boxShadow: "0 18px 48px rgba(15, 23, 42, 0.08)", padding: "40px 28px", textAlign: "center" }}>
        <h1 style={{ fontSize: 30, margin: "0 0 12px" }}>{title}</h1>
        <p style={{ color: "#475569", lineHeight: 1.6, margin: "0 0 24px" }}>{body}</p>
        <a href="/" style={{ background: accent, borderRadius: 999, color: "#fff", display: "inline-block", fontWeight: 700, padding: "12px 20px", textDecoration: "none" }}>
          Back to shop
        </a>
      </section>
    </main>
  );
}

export default function App() {
  if (window.location.pathname === "/payment/success") {
    return <PageShell title="Payment Successful" body="The KHQR payment completed successfully." accent="#15803d" />;
  }

  if (window.location.pathname === "/payment/cancelled") {
    return <PageShell title="Payment Cancelled" body="The KHQR payment was cancelled or not completed." accent="#dc2626" />;
  }

  return (
    <main style={{ fontFamily: "Segoe UI, Arial, sans-serif", margin: "48px auto", maxWidth: 560, padding: "0 20px" }}>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>React + Vite KHQR Demo</h1>
        <p style={{ color: "#64748b", margin: "8px 0 0" }}>
          React handles the checkout UI. Express handles the secure Koma routes.
        </p>
      </header>

      <div style={{ display: "grid", gap: 16 }}>
        {PRODUCTS.map((product) => (
          <section key={product.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 18, margin: "0 0 6px" }}>{product.name}</h2>
                <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>{product.desc}</p>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>${product.price}</div>
            </div>

            <KhqrCheckout
              amount={product.price}
              currency={product.currency}
              productId={product.id}
              productName={product.name}
              merchantLabel="Coffee House"
            />
          </section>
        ))}
      </div>
    </main>
  );
}
