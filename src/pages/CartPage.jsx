import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartPage.css";

function CartItem({ item }) {
  const { dispatch } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>

      <div className="cart-item-info">
        <p className="cart-item-category">{item.category}</p>
        <p className="cart-item-name">{item.name}</p>
        <p className="cart-item-unit">${item.price.toFixed(2)} each</p>
      </div>

      <div className="cart-item-qty">
        <button
          className="qty-btn"
          onClick={() =>
            dispatch({ type: "SET_QTY", id: item.id, qty: item.qty - 1 })
          }
          disabled={item.qty <= 1}
        >
          −
        </button>
        <span className="qty-value">{item.qty}</span>
        <button
          className="qty-btn"
          onClick={() =>
            dispatch({ type: "SET_QTY", id: item.id, qty: item.qty + 1 })
          }
        >
          +
        </button>
      </div>

      <div className="cart-item-right">
        <p className="cart-item-total">${(item.price * item.qty).toFixed(2)}</p>
        <button
          className="cart-item-remove"
          onClick={() => dispatch({ type: "REMOVE", id: item.id })}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cart, cartCount, cartSubtotal, shipping, cartTotal, dispatch } =
    useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page">
      <div className="cart-header">
        <h1 className="cart-title">Shopping Cart</h1>
        <span className="cart-count">
          {cartCount} item{cartCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {/* Column headers */}
          <div className="cart-cols-header">
            <span>Product</span>
            <span>Quantity</span>
            <span>Price</span>
          </div>

          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          <div className="cart-list-actions">
            <Link to="/products" className="btn btn-secondary btn-sm">
              ← Continue shopping
            </Link>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => dispatch({ type: "CLEAR" })}
            >
              Clear cart
            </button>
          </div>
        </div>

        <div className="cart-summary card">
          <div className="card-body">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? "free-shipping" : ""}>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
            </div>

            {cartSubtotal < 50 && (
              <div className="shipping-nudge">
                <p>
                  Add <strong>${(50 - cartSubtotal).toFixed(2)}</strong> more
                  for free shipping
                </p>
                <div className="shipping-bar">
                  <div
                    className="shipping-bar-fill"
                    style={{
                      width: `${Math.min(100, (cartSubtotal / 50) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <hr className="divider" />

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: 20 }}
            >
              Proceed to checkout →
            </button>

            <div className="summary-trust">
              <span>🔒 Secure checkout</span>
              <span>↩️ Free returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
