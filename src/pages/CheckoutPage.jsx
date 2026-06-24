import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { createOrder } from "../services/api";
import "./CheckoutPage.css";

function Steps({ current }) {
  const steps = ["Shipping", "Review", "Placing order"];
  return (
    <div className="checkout-steps">
      {steps.map((label, i) => {
        const num = i + 1;
        const active = num === current;
        const done = num < current;
        return (
          <div key={label} className="checkout-step">
            <div
              className={`step-circle ${active ? "active" : ""} ${done ? "done" : ""}`}
            >
              {done ? "✓" : num}
            </div>
            <span className={`step-label ${active ? "active" : ""}`}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className={`step-line ${done ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderSummary({ cart, cartSubtotal, shipping, cartTotal }) {
  return (
    <div className="checkout-summary card">
      <div className="card-body">
        <h3 className="summary-heading">Order Summary</h3>
        <div className="summary-items">
          {cart.map((item) => (
            <div key={item.id} className="summary-item">
              <div className="summary-item-img">
                <img src={item.image} alt={item.name} />
                <span className="summary-item-qty">{item.qty}</span>
              </div>
              <div className="summary-item-info">
                <p className="summary-item-name">{item.name}</p>
                <p className="summary-item-price">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <hr className="divider" />
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${cartSubtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span className={shipping === 0 ? "free" : ""}>
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <hr className="divider" />
        <div className="summary-row summary-total">
          <span>Total</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, cartSubtotal, shipping, cartTotal, dispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    zip: "",
    country: "SE",
  });

  if (!user) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <h3>Login required</h3>
          <p>You need to be logged in to checkout.</p>
          <Link
            to="/login"
            state={{ from: "/checkout" }}
            className="btn btn-primary"
          >
            Log in to continue
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products before checking out.</p>
          <Link to="/products" className="btn btn-primary">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  function handleAddressChange(e) {
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  function handleAddressSubmit(e) {
    e.preventDefault();
    if (!address.street || !address.city || !address.zip) {
      setError("Please fill in all address fields");
      return;
    }
    setError("");
    setStep(2);
  }

  async function handlePlaceOrder() {
    setLoading(true);
    setError("");
    try {
      const items = cart.map((item) => ({ productId: item.id, qty: item.qty }));
      const res = await createOrder(items, address);
      dispatch({ type: "CLEAR" });
      navigate("/order-confirmation", { state: { order: res.data } });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="checkout-page page">
      <h1 className="checkout-title">Checkout</h1>
      <Steps current={step} />

      <div className="checkout-layout">
        <div className="checkout-main">
          {step === 1 && (
            <div className="card">
              <div className="card-body">
                <h2 className="step-heading">Shipping address</h2>
                {error && (
                  <div
                    className="alert alert-error"
                    style={{ marginBottom: 16 }}
                  >
                    {error}
                  </div>
                )}
                <form onSubmit={handleAddressSubmit}>
                  <div className="form-group">
                    <label className="form-label">Street address</label>
                    <input
                      name="street"
                      className="form-input"
                      placeholder="123 Main Street"
                      value={address.street}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        name="city"
                        className="form-input"
                        placeholder="Stockholm"
                        value={address.city}
                        onChange={handleAddressChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">ZIP / Postal code</label>
                      <input
                        name="zip"
                        className="form-input"
                        placeholder="12345"
                        value={address.zip}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <select
                      name="country"
                      className="form-input"
                      value={address.country}
                      onChange={handleAddressChange}
                    >
                      <option value="SE">Sweden</option>
                      <option value="NO">Norway</option>
                      <option value="DK">Denmark</option>
                      <option value="FI">Finland</option>
                      <option value="DE">Germany</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                    </select>
                  </div>
                  <div className="checkout-actions">
                    <Link to="/cart" className="btn btn-secondary">
                      ← Back to cart
                    </Link>
                    <button type="submit" className="btn btn-primary btn-lg">
                      Continue to review →
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card">
              <div className="card-body">
                <h2 className="step-heading">Review your order</h2>
                <div className="review-section">
                  <div className="review-section-header">
                    <h3>Shipping to</h3>
                    <button
                      onClick={() => setStep(1)}
                      className="btn btn-ghost btn-sm"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="review-address">
                    {address.street}, {address.city} {address.zip},{" "}
                    {address.country}
                  </p>
                </div>
                <hr className="divider" />
                <div className="review-section">
                  <h3>Items ({cart.length})</h3>
                  {cart.map((item) => (
                    <div key={item.id} className="review-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="review-item-img"
                      />
                      <div className="review-item-info">
                        <p className="review-item-name">{item.name}</p>
                        <p className="review-item-meta">
                          Qty: {item.qty} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="review-item-total">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                {error && (
                  <div className="alert alert-error" style={{ marginTop: 16 }}>
                    {error}
                  </div>
                )}
                <div className="checkout-actions">
                  <button
                    onClick={() => setStep(1)}
                    className="btn btn-secondary"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? "Placing order…" : "Place order ✓"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <OrderSummary
          cart={cart}
          cartSubtotal={cartSubtotal}
          shipping={shipping}
          cartTotal={cartTotal}
        />
      </div>
    </div>
  );
}
