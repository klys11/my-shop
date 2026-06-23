import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <span className="footer-logo">ShopLite</span>
          <p>A clean, modern shop built with React.</p>
        </div>

        <nav className="footer-links">
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Log in</Link>
          <Link to="/register">Register</Link>
        </nav>

        <p className="footer-copy">
          © {new Date().getFullYear()} ShopLite · Demo only
        </p>
      </div>
    </footer>
  );
}
