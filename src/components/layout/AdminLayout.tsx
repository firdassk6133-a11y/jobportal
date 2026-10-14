import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  FileText,
  Users,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../ui/badge';

export function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      label: 'Analytics & Overview',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Job Requisitions',
      path: '/admin/jobs',
      icon: Layers,
    },
    {
      label: 'Candidate Applications',
      path: '/admin/applications',
      icon: FileText,
    },
    {
      label: '10-Member Team Attribution',
      path: '/admin/recruiters',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60">
      <Navbar />

      {/* Admin Subheader Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link
              to="/jobs"
              className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center space-x-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Public Job Board</span>
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-900">
                Staffing Agency Operations
              </span>
              <Badge variant={user?.role === 'ADMIN' ? 'default' : 'purple'}>
                {user?.role === 'ADMIN' ? 'Admin Access' : `Recruiter: ${user?.referralCode || 'Team'}`}
              </Badge>
            </div>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
