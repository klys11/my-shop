import { Link, useLocation } from "react-router-dom";
import "./OrderConfirmationPage.css";

export default function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>No order found</h3>
          <p>Looks like you didn't just complete a purchase.</p>
          <Link to="/products" className="btn btn-primary">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page page">
      <div className="confirmation-header">
        <div className="confirmation-icon">✅</div>
        <h1 className="confirmation-title">Order confirmed!</h1>
        <p className="confirmation-sub">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <div className="confirmation-order-number">
          Order <strong>{order.orderNumber}</strong>
        </div>
      </div>

      <div className="confirmation-layout">
        <div className="card">
          <div className="card-body">
            <h2 className="confirmation-section-title">Items ordered</h2>
            {order.items.map((item, i) => (
              <div key={i} className="confirmation-item">
                <div className="confirmation-item-info">
                  <p className="confirmation-item-name">{item.name}</p>
                  <p className="confirmation-item-meta">
                    Qty: {item.qty} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="confirmation-item-total">
                  ${item.subtotal.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="confirmation-sidebar">
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-body">
              <h2 className="confirmation-section-title">Shipping to</h2>
              <p className="confirmation-address">
                {order.street}
                <br />
                {order.city}, {order.zip}
                <br />
                {order.country}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="confirmation-section-title">Payment summary</h2>
              <div className="confirmation-row">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="confirmation-row">
                <span>Shipping</span>
                <span className={order.shipping === 0 ? "free" : ""}>
                  {order.shipping === 0
                    ? "Free"
                    : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <hr className="divider" />
              <div className="confirmation-row confirmation-total">
                <span>Total paid</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <Link to="/products" className="btn btn-primary btn-lg">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
