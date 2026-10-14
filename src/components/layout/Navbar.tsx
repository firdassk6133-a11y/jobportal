import { Link, useLocation } from 'react-router-dom';
import {
  Briefcase,
  User,
  LogOut,
  Layers,
  FileText,
  Users,
  LayoutDashboard,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function Navbar() {
  const { user, isAuthenticated, logout, isAdmin, isRecruiter } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 transition-transform group-hover:scale-105">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                TalentBridge
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-600 mt-0.5">
                Staffing Agency
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/jobs"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isActive('/jobs')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Browse Jobs
            </Link>

            {isAuthenticated && (
              <Link
                to="/applications/me"
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/applications/me')
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                My Applications
              </Link>
            )}

            {(isAdmin || isRecruiter) && (
              <div className="h-4 w-px bg-slate-200 mx-2" />
            )}

            {(isAdmin || isRecruiter) && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 ${
                    isActive('/admin/dashboard')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/admin/jobs"
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 ${
                    isActive('/admin/jobs')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  <span>Requisitions</span>
                </Link>
                <Link
                  to="/admin/applications"
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 ${
                    isActive('/admin/applications')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Candidates</span>
                </Link>
                <Link
                  to="/admin/recruiters"
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 ${
                    isActive('/admin/recruiters')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Team (10)</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center space-x-3">
          {/* Swagger docs external link */}
          <a
            href="https://3jbodl5qv1.execute-api.eu-north-1.amazonaws.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center space-x-1 text-xs font-medium text-slate-500 hover:text-indigo-600 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
            title="Open Interactive Swagger UI in AWS eu-north-1"
          >
            <span>Swagger API</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2.5 rounded-full p-1 pl-2 pr-3 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-900 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <div className="pt-1">
                      <Badge
                        variant={
                          user.role === 'ADMIN'
                            ? 'default'
                            : user.role === 'RECRUITER'
                            ? 'purple'
                            : 'secondary'
                        }
                      >
                        {user.role}
                        {user.referralCode ? ` • ${user.referralCode}` : ''}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/applications/me" className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    <span>My Applications</span>
                  </Link>
                </DropdownMenuItem>
                {(isAdmin || isRecruiter) && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin/dashboard" className="flex items-center space-x-2">
                      <LayoutDashboard className="h-4 w-4 text-slate-500" />
                      <span>Admin Portal</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
