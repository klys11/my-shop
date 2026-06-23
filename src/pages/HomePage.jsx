import { Link } from "react-router-dom";
import { PRODUCTS, CATEGORIES, FEATURED_PRODUCT } from "../data/products";
import "./HomePage.css";

function Stars({ rating, reviews }) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return (
    <div className="stars-row">
      <span className="stars">
        {"★".repeat(full)}
        {"☆".repeat(empty)}
      </span>
      <span className="stars-count">({reviews})</span>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <div className="product-card-image">
        <img src={product.image} alt={product.name} className="product-img" />
      </div>
      <div className="product-card-body">
        <p className="product-card-category">{product.category}</p>
        <h3 className="product-card-name">{product.name}</h3>
        <Stars rating={product.rating} reviews={product.reviews} />
        <div className="product-card-price">
          <span className="price-current">${product.price.toFixed(2)}</span>
          {product.oldPrice && (
            <span className="price-old">${product.oldPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const featuredProducts = PRODUCTS.slice(0, 8);

  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner container">
          <div className="hero-text">
            <span className="hero-tag">Best of the Week</span>
            <h1 className="hero-title">{FEATURED_PRODUCT.name}</h1>
            <Stars
              rating={FEATURED_PRODUCT.rating}
              reviews={FEATURED_PRODUCT.reviews}
            />
            <div className="hero-price-row">
              <span className="hero-price">${FEATURED_PRODUCT.price}</span>
              {FEATURED_PRODUCT.oldPrice && (
                <span className="hero-price-old">
                  ${FEATURED_PRODUCT.oldPrice}
                </span>
              )}
            </div>
            <Link
              to={`/products/${FEATURED_PRODUCT.id}`}
              className="btn btn-primary btn-lg hero-cta"
            >
              Shop Now
            </Link>
          </div>

          <div className="hero-visual">
            <div className="hero-glow" />
            <img
              src={FEATURED_PRODUCT.image}
              alt={FEATURED_PRODUCT.name}
              className="hero-product-img"
            />
          </div>

          <div className="hero-sidebar">
            {PRODUCTS.slice(1, 4).map((p) => (
              <Link to={`/products/${p.id}`} key={p.id} className="hero-pill">
                <img src={p.image} alt={p.name} className="hero-pill-img" />
                <div>
                  <p className="hero-pill-name">{p.name}</p>
                  <p className="hero-pill-price">${p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse by Category</h2>
            <Link to="/products" className="section-link">
              View all →
            </Link>
          </div>
          <div className="categories-row">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={
                  cat.name === "All"
                    ? "/products"
                    : `/products?category=${cat.name}`
                }
                className="category-chip"
              >
                <span className="category-chip-icon">{cat.icon}</span>
                <span className="category-chip-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Explore our Products</h2>
            <Link to="/products" className="section-link">
              View all →
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
