import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <span className="footer-logo">Etrade</span>
        </div>

        <nav className="footer-links">
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Log in</Link>
          <Link to="/register">Register</Link>
        </nav>

        <p className="footer-copy">
          © {new Date().getFullYear()} Etrade · Demo only
        </p>
      </div>
    </footer>
  );
}
