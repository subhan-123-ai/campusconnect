import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-main py-20 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-2xl text-gray-700 mb-8">Page Not Found</p>
      <Link to="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  );
}
