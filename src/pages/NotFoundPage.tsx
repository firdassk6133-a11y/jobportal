import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
        <Briefcase className="h-7 w-7" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <p className="text-base font-semibold text-slate-700 mt-2">Page Not Found</p>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
        The page you are looking for does not exist or may have been relocated.
      </p>
      <Link to="/jobs">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Return to Job Board</span>
        </Button>
      </Link>
    </div>
  );
}
