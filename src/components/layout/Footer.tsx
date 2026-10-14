import { Briefcase, Heart, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">
              TalentBridge Recruitment & Staffing
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Secure S3 Document Vault</span>
            </span>
            <span className="flex items-center space-x-1">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Instant Recruiter Attribution</span>
            </span>
            <a
              href="https://3jbodl5qv1.execute-api.eu-north-1.amazonaws.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              OpenAPI 3.0 / Swagger UI
            </a>
          </div>

          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} TalentBridge Agency. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
