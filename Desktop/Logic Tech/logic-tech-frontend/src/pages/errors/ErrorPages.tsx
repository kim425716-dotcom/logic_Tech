import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import Button from '../../components/ui/Button';

function ErrorLayout({ code, title, message }: { code: string; title: string; message: string }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-extrabold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-4">
          {code}
        </p>
        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
        <p className="text-slate-400 mb-8">{message}</p>
        <Link to="/">
          <Button leftIcon={<FaHome size={14} />}>Go Home</Button>
        </Link>
      </div>
    </div>
  );
}

export function Error403() {
  return (
    <ErrorLayout
      code="403"
      title="Access Denied"
      message="You don't have permission to view this page."
    />
  );
}

export function Error404() {
  return (
    <ErrorLayout
      code="404"
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
    />
  );
}

export function Error500() {
  return (
    <ErrorLayout
      code="500"
      title="Server Error"
      message="Something went wrong on our end. Please try again later."
    />
  );
}
