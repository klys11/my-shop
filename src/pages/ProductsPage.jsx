import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchProducts } from "../services/api";
import "./ProductsPage.css";

const CATEGORIES = [
  { name: "All", icon: "🛍️" },
  { name: "Audio", icon: "🎧" },
  { name: "Gaming", icon: "🎮" },
  { name: "Accessories", icon: "⌨️" },
  { name: "Laptops", icon: "💻" },
  { name: "Monitors", icon: "🖥️" },
  { name: "Networking", icon: "📡" },
  { name: "PC Gaming", icon: "🖱️" },
];

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
  { value: "reviews", label: "Most Reviewed" },
];

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
        <img
          src={`/images/${product.image}`}
          alt={product.name}
          className="product-img"
        />
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

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchProducts({
          category: category === "All" ? "" : category,
          search,
          sort: sort === "default" ? "" : sort,
        });
        setProducts(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, search, sort]);

  function handleCategory(cat) {
    if (cat === "All") setSearchParams({});
    else setSearchParams({ category: cat });
  }

  return (
    <div className="products-page page">
      <div className="products-page-header">
        <div>
          <h1 className="products-page-title">All Products</h1>
          <p className="products-page-sub">
            {loading
              ? "Loading…"
              : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
          </p>
        </div>
        <div className="products-toolbar">
          <div className="toolbar-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="toolbar-search-input"
            />
            {search && (
              <button onClick={() => setSearch("")} className="toolbar-clear">
                ✕
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="toolbar-sort"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="category-pills">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleCategory(cat.name)}
            className={`category-pill ${category === cat.name ? "active" : ""}`}
          >
            <span>{cat.icon}</span> {cat.name}
          </button>
        ))}
      </div>

      {loading && (
        <div className="products-loading">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="product-skeleton" />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-error" style={{ marginBottom: 24 }}>
          ⚠️ Could not load products: {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try a different search term or category.</p>
          <button
            onClick={() => {
              setSearch("");
              handleCategory("All");
            }}
            className="btn btn-primary"
          >
            Clear filters
          </button>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="products-grid-page">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
