import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="page" style={{ maxWidth: 400 }}>
      <h1 style={{ marginBottom: 8 }}>Log in</h1>
      <p style={{ color: "var(--gray)", marginBottom: 24 }}>
        Coming in Step 6 — email/password login with JWT or Supabase Auth.
      </p>
      <p style={{ fontSize: 14, color: "var(--gray)" }}>
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{ color: "var(--indigo)", fontWeight: 600 }}
        >
          Register here
        </Link>
      </p>
    </div>
  );
}
