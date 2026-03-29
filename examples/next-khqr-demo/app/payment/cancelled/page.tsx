import Link from "next/link";

export default function PaymentCancelled() {
  return (
    <main style={{ fontFamily: "Segoe UI, Arial, sans-serif", margin: "80px auto", maxWidth: 520, padding: "0 24px" }}>
      <section style={{ background: "#fff", border: "1px solid #fca5a5", borderRadius: 20, boxShadow: "0 18px 48px rgba(220,38,38,0.12)", padding: "40px 28px", textAlign: "center" }}>
        <h1 style={{ color: "#dc2626", fontSize: 30, margin: "0 0 12px" }}>Payment Cancelled</h1>
        <p style={{ color: "#7f1d1d", lineHeight: 1.6, margin: "0 0 24px" }}>The KHQR checkout was cancelled or did not complete.</p>
        <Link href="/" style={{ background: "#dc2626", borderRadius: 999, color: "#fff", display: "inline-block", fontWeight: 700, padding: "12px 20px", textDecoration: "none" }}>
          Try again
        </Link>
      </section>
    </main>
  );
}
