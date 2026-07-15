import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="section-padding flex flex-col items-center justify-center text-center min-h-[60vh]">
      <p className="text-6xl font-heading font-extrabold text-primary mb-2">404</p>
      <h1 className="font-heading font-bold text-2xl text-primary mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-6 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
