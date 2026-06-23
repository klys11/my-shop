import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="page" style={{ maxWidth: 400 }}>
      <h1 style={{ marginBottom: 8 }}>Create account</h1>
      <p style={{ color: "var(--gray)", marginBottom: 24 }}>
        Coming in Step 6 — registration with email verification.
      </p>
      <p style={{ fontSize: 14, color: "var(--gray)" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "var(--indigo)", fontWeight: 600 }}>
          Log in
        </Link>
      </p>
    </div>
  );
}
