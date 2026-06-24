const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

export const registerUser = (name, email, password) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const loginUser = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const fetchMe = () => request("/auth/me");

export function fetchProducts(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v)),
  ).toString();
  return request(`/products${query ? `?${query}` : ""}`);
}

export const fetchProductById = (id) => request(`/products/${id}`);
export const fetchRelatedProducts = (id) => request(`/products/${id}/related`);

export const createOrder = (items, shippingAddress) =>
  request("/orders", {
    method: "POST",
    body: JSON.stringify({ items, shippingAddress }),
  });

export const fetchOrderById = (id) => request(`/orders/${id}`);

export const fetchAdminStats = () => request("/admin/stats");
export const fetchAdminProducts = () => request("/admin/products");
export const fetchAdminOrders = () => request("/admin/orders");
export const adminCreateProduct = (data) =>
  request("/admin/products", { method: "POST", body: JSON.stringify(data) });
export const adminUpdateProduct = (id, data) =>
  request(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const adminDeleteProduct = (id) =>
  request(`/admin/products/${id}`, { method: "DELETE" });
export const adminUpdateOrderStatus = (id, status) =>
  request(`/admin/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
