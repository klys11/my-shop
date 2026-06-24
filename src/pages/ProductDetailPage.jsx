import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProductById, fetchRelatedProducts } from "../services/api";
import { useCart } from "../context/CartContext.jsx";
import "./ProductDetailPage.css";

function Stars({ rating, reviews }) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return (
    <div className="detail-stars-row">
      <span className="stars">
        {"★".repeat(full)}
        {"☆".repeat(empty)}
      </span>
      <span className="detail-rating-num">{rating}</span>
      <span className="stars-count">{reviews} reviews</span>
    </div>
  );
}

function productImage(filename) {
  return `/src/assets/products/${filename}`;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      setQty(1);
      try {
        const [productRes, relatedRes] = await Promise.all([
          fetchProductById(id),
          fetchRelatedProducts(id),
        ]);
        setProduct(productRes.data);
        setRelated(relatedRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page page">
        <div className="detail-skeleton">
          <div className="skeleton-image" />
          <div className="skeleton-info">
            <div className="skeleton-line short" />
            <div className="skeleton-line long" />
            <div className="skeleton-line med" />
            <div className="skeleton-line short" />
            <div className="skeleton-line long" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h3>Could not load product</h3>
          <p>{error}</p>
          <Link to="/products" className="btn btn-primary">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-icon">😕</div>
          <h3>Product not found</h3>
          <p>This product may have been removed or the link is wrong.</p>
          <Link to="/products" className="btn btn-primary">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  function handleAddToCart() {
    dispatch({
      type: "ADD",
      product: { ...product, image: productImage(product.image) },
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleQty(delta) {
    setQty((q) => Math.max(1, Math.min(product.stock, q + delta)));
  }

  return (
    <div className="detail-page page">
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <Link to="/products">Products</Link>
        <span className="breadcrumb-sep">›</span>
        <Link to={`/products?category=${product.category}`}>
          {product.category}
        </Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <div className="detail-layout">
        <div className="detail-image-panel">
          <div className="detail-image-main">
            {product.badge && (
              <span className="detail-badge">{product.badge}</span>
            )}
            <img
              src={productImage(product.image)}
              alt={product.name}
              className="detail-product-img"
            />
          </div>
        </div>

        <div className="detail-info">
          <p className="detail-category">{product.category}</p>
          <h1 className="detail-name">{product.name}</h1>
          <Stars rating={product.rating} reviews={product.reviews} />
          <hr className="divider" />

          <div className="detail-price-row">
            <span className="detail-price">${product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <>
                <span className="detail-price-old">
                  ${product.oldPrice.toFixed(2)}
                </span>
                <span className="detail-discount">-{discount}%</span>
              </>
            )}
          </div>

          <p className="detail-desc">{product.desc}</p>

          <div className="detail-stock">
            <span
              className={`stock-dot ${product.stock > 5 ? "in-stock" : "low-stock"}`}
            />
            {product.stock > 5
              ? `In stock (${product.stock} available)`
              : `Only ${product.stock} left!`}
          </div>

          <hr className="divider" />

          <div className="detail-qty-row">
            <span className="detail-qty-label">Quantity</span>
            <div className="qty-control">
              <button
                onClick={() => handleQty(-1)}
                className="qty-btn"
                disabled={qty <= 1}
              >
                −
              </button>
              <span className="qty-value">{qty}</span>
              <button
                onClick={() => handleQty(1)}
                className="qty-btn"
                disabled={qty >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          <div className="detail-actions">
            <button
              onClick={handleAddToCart}
              className={`btn btn-primary btn-lg detail-add-btn ${added ? "added" : ""}`}
            >
              {added ? "✓ Added to cart!" : "🛒 Add to cart"}
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="btn btn-secondary btn-lg"
            >
              View cart
            </button>
          </div>

          <div className="detail-trust">
            <div className="trust-item">
              🚚 <span>Free shipping over $50</span>
            </div>
            <div className="trust-item">
              ↩️ <span>30-day returns</span>
            </div>
            <div className="trust-item">
              🔒 <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-tabs-section">
        <div className="detail-tabs">
          <button className="detail-tab active">Description</button>
          <button className="detail-tab">Specifications</button>
          <button className="detail-tab">Reviews ({product.reviews})</button>
        </div>
        <div className="detail-tab-content">
          <p>{product.desc}</p>
          <ul className="detail-spec-list">
            <li>
              <span>Category</span>
              <span>{product.category}</span>
            </li>
            <li>
              <span>In stock</span>
              <span>{product.stock} units</span>
            </li>
            <li>
              <span>Rating</span>
              <span>{product.rating} / 5</span>
            </li>
            <li>
              <span>Reviews</span>
              <span>{product.reviews}</span>
            </li>
            {product.oldPrice && (
              <li>
                <span>You save</span>
                <span className="save-amount">
                  ${(product.oldPrice - product.price).toFixed(2)} ({discount}%)
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <div className="related-section">
          <h2 className="related-title">Related products</h2>
          <div className="related-grid">
            {related.map((p) => (
              <Link
                to={`/products/${p.id}`}
                key={p.id}
                className="related-card"
              >
                <div className="related-card-image">
                  <img
                    src={productImage(p.image)}
                    alt={p.name}
                    className="related-card-img"
                  />
                </div>
                <div className="related-card-body">
                  <p className="related-card-name">{p.name}</p>
                  <p className="related-card-price">${p.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
