import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page">
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h3>Page not found</h3>
        <p>The page you're looking for doesn't exist or was moved.</p>
        <Link to="/" className="btn btn-primary">
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
