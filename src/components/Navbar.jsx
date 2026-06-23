import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚡</span>eTrade
        </Link>

        <nav className="navbar-links">
          {[
            { to: "/", label: "Home", end: true },
            { to: "/products", label: "Shop" },
            { to: "/products?category=Audio", label: "Audio" },
            { to: "/products?category=Gaming", label: "Gaming" },
            { to: "/products?category=Accessories", label: "Contact" },
          ].map(({ to, label, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <div className="navbar-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products…"
              className="search-input"
            />
          </div>

          {/* Show user name + logout if logged in, otherwise show login link */}
          {user ? (
            <div className="navbar-user">
              <span className="navbar-user-name">
                Hi, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-icon-btn" title="Account">
              👤
            </Link>
          )}

          <button className="nav-icon-btn" title="Wishlist">
            🤍
          </button>

          <Link to="/cart" className="nav-icon-btn cart-icon-btn" title="Cart">
            🛒
            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
