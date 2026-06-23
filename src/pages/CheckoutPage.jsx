import { Link } from "react-router-dom";

export default function CheckoutPage() {
  return (
    <div className="page" style={{ maxWidth: 600 }}>
      <h1 style={{ marginBottom: 8 }}>Checkout</h1>
      <p style={{ color: "var(--gray)", marginBottom: 24 }}>
        Coming in Step 7 — shipping address, payment with Stripe, order review.
      </p>
      <Link to="/cart" className="btn btn-secondary">
        ← Back to cart
      </Link>
    </div>
  );
}
