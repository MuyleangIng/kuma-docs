import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <main style={{ fontFamily: "Segoe UI, Arial, sans-serif", margin: "80px auto", maxWidth: 520, padding: "0 24px" }}>
      <section style={{ background: "#fff", border: "1px solid #86efac", borderRadius: 20, boxShadow: "0 18px 48px rgba(22,163,74,0.12)", padding: "40px 28px", textAlign: "center" }}>
        <h1 style={{ color: "#15803d", fontSize: 30, margin: "0 0 12px" }}>Payment Successful</h1>
        <p style={{ color: "#166534", lineHeight: 1.6, margin: "0 0 24px" }}>Your KHQR payment was confirmed.</p>
        <Link href="/" style={{ background: "#15803d", borderRadius: 999, color: "#fff", display: "inline-block", fontWeight: 700, padding: "12px 20px", textDecoration: "none" }}>
          Back to shop
        </Link>
      </section>
    </main>
  );
}
