import { Link } from "react-router-dom";

export default function OrderConfirmationPage() {
  return (
    <div className="page">
      <div className="empty-state">
        <div className="empty-state-icon">✅</div>
        <h3>Order confirmed!</h3>
        <p>Your order has been placed. A confirmation email is on its way.</p>
        <Link to="/products" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
