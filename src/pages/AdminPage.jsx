import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  fetchAdminStats,
  fetchAdminProducts,
  fetchAdminOrders,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUpdateOrderStatus,
} from "../services/api";
import "./AdminPage.css";

const EMPTY_FORM = {
  name: "",
  price: "",
  oldPrice: "",
  category: "Audio",
  badge: "",
  stock: "",
  image: "",
  desc: "",
};
const CATEGORIES = [
  "Audio",
  "Gaming",
  "Accessories",
  "Laptops",
  "Monitors",
  "Networking",
];
const STATUS_COLORS = {
  pending: "#F59E0B",
  paid: "#6366F1",
  shipped: "#3B82F6",
  delivered: "#10B981",
  cancelled: "#EF4444",
};

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card card">
      <div className="card-body stat-card-body">
        <span className="stat-icon">{icon}</span>
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const field = (label, key, type = "text", placeholder = "") => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-input"
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {error && (
        <div className="alert alert-error" style={{ marginBottom: 14 }}>
          {error}
        </div>
      )}
      {field("Name", "name", "text", "Product name")}
      <div className="form-row">
        {field("Price ($)", "price", "number", "49.99")}
        {field("Old price ($)", "oldPrice", "number", "69.99")}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-input"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        {field("Stock", "stock", "number", "0")}
      </div>
      <div className="form-row">
        {field("Badge", "badge", "text", "e.g. New, 20% Off")}
        {field("Image filename", "image", "text", "headphones.png")}
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-input"
          rows={3}
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
          placeholder="Product description…"
          style={{ resize: "vertical" }}
        />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving…" : "Save product"}
        </button>
      </div>
    </form>
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  if (!user || user.role !== "admin") return <Navigate to="/" replace />;

  useEffect(() => {
    loadData();
  }, [tab]);

  async function loadData() {
    setLoading(true);
    try {
      if (tab === "dashboard") {
        const res = await fetchAdminStats();
        setStats(res.data);
      } else if (tab === "products") {
        const res = await fetchAdminProducts();
        setProducts(res.data);
      } else if (tab === "orders") {
        const res = await fetchAdminOrders();
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProduct(form) {
    if (editing) {
      await adminUpdateProduct(editing.id, form);
    } else {
      await adminCreateProduct(form);
    }
    setShowForm(false);
    setEditing(null);
    loadData();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    await adminDeleteProduct(id);
    loadData();
  }

  async function handleStatusChange(orderId, status) {
    await adminUpdateOrderStatus(orderId, status);
    loadData();
  }

  return (
    <div className="admin-page page">
      <div className="admin-header">
        <h1 className="admin-title">Admin Panel</h1>
        <p className="admin-sub">
          Logged in as <strong>{user.email}</strong>
        </p>
      </div>

      <div className="admin-tabs">
        {["dashboard", "products", "orders"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setShowForm(false);
              setEditing(null);
            }}
            className={`admin-tab ${tab === t ? "active" : ""}`}
          >
            {t === "dashboard"
              ? "📊 Dashboard"
              : t === "products"
                ? "📦 Products"
                : "🧾 Orders"}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--gray)" }}>
          Loading…
        </div>
      ) : (
        <>
          {tab === "dashboard" && stats && (
            <div className="stats-grid">
              <StatCard
                icon="📦"
                label="Total products"
                value={stats.productCount}
              />
              <StatCard
                icon="🧾"
                label="Total orders"
                value={stats.orderCount}
              />
              <StatCard icon="👤" label="Total users" value={stats.userCount} />
              <StatCard
                icon="💰"
                label="Total revenue"
                value={`$${stats.revenue.toFixed(2)}`}
              />
            </div>
          )}

          {tab === "products" && (
            <div>
              <div className="admin-section-header">
                <h2 className="admin-section-title">
                  Products ({products.length})
                </h2>
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditing(null);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  + Add product
                </button>
              </div>

              {showForm && (
                <div className="card" style={{ marginBottom: 24 }}>
                  <div className="card-body">
                    <h3 style={{ marginBottom: 16, fontWeight: 700 }}>
                      {editing ? "Edit product" : "New product"}
                    </h3>
                    <ProductForm
                      initial={editing}
                      onSave={handleSaveProduct}
                      onCancel={() => {
                        setShowForm(false);
                        setEditing(null);
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="admin-table-wrap card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={`/src/assets/products/${p.image}`}
                            alt={p.name}
                            className="admin-product-img"
                          />
                        </td>
                        <td className="admin-product-name">{p.name}</td>
                        <td>
                          <span className="badge badge-indigo">
                            {p.category}
                          </span>
                        </td>
                        <td className="admin-price">${p.price.toFixed(2)}</td>
                        <td>
                          <span
                            className={`stock-pill ${p.stock < 10 ? "low" : ""}`}
                          >
                            {p.stock}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button
                              onClick={() => {
                                setEditing(p);
                                setShowForm(true);
                              }}
                              className="btn btn-secondary btn-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h2 className="admin-section-title" style={{ marginBottom: 16 }}>
                Orders ({orders.length})
              </h2>
              <div className="admin-table-wrap card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td className="admin-order-num">{o.orderNumber}</td>
                        <td className="admin-date">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td>{o.user ? o.user.name : "Guest"}</td>
                        <td>
                          {o.items.length} item{o.items.length !== 1 ? "s" : ""}
                        </td>
                        <td className="admin-price">${o.total.toFixed(2)}</td>
                        <td>
                          <select
                            value={o.status}
                            onChange={(e) =>
                              handleStatusChange(o.id, e.target.value)
                            }
                            className="status-select"
                            style={{ color: STATUS_COLORS[o.status] }}
                          >
                            {[
                              "pending",
                              "paid",
                              "shipped",
                              "delivered",
                              "cancelled",
                            ].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
